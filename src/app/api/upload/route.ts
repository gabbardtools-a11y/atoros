import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, rm, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execFileSync } from 'child_process';
import { getCurrentUserWithProfile } from '@/lib/session';
import { db } from '@/lib/db';
import { uploadToClouds } from '@/lib/cloud-storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per file
const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30 MB total
const UPLOAD_DIR = process.env.ATOROS_UPLOAD_DIR || path.join(process.cwd(), 'uploads');

/** Generate a random archive password: 16 chars, letters+digits (avoid ambiguous chars) */
function generateArchivePassword(length = 16): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const bytes = crypto.randomBytes(length);
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += chars[bytes[i] % chars.length];
  }
  return pwd;
}

function find7z(): string {
  const candidates = ['/usr/bin/7z', '/usr/bin/7za', '/usr/local/bin/7z', '/usr/local/bin/7za'];
  for (const p of candidates) if (existsSync(p)) return p;
  return '7z';
}

function findPython(): string {
  const candidates = ['/usr/bin/python3', '/usr/local/bin/python3'];
  for (const p of candidates) if (existsSync(p)) return p;
  return 'python3';
}

interface FnsTspResult {
  ok: boolean;
  token_base64?: string;
  timestamp_iso?: string;
  serial_hex?: string;
  hash_gost?: string;
  error?: string;
}

async function requestFnsTimestamp(filePath: string): Promise<FnsTspResult> {
  const scriptCandidates = [
    '/var/www/atoros/scripts/query_fns_tsp.py',
    path.join(process.cwd(), 'scripts', 'query_fns_tsp.py'),
  ];
  let scriptPath: string | null = null;
  for (const c of scriptCandidates) if (existsSync(c)) { scriptPath = c; break; }
  if (!scriptPath) return { ok: false, error: 'query_fns_tsp.py not found' };

  const python = findPython();
  return new Promise((resolve) => {
    try {
      const stdout = execFileSync(python, [scriptPath!, filePath], {
        encoding: 'utf-8', timeout: 60000,
      });
      resolve(JSON.parse(stdout));
    } catch (e: any) {
      const errOut = (e.stdout || '') + (e.stderr || '');
      try { resolve(JSON.parse(errOut)); } catch { resolve({ ok: false, error: e.message }); }
    }
  });
}

interface TorrentResult {
  ok: boolean;
  torrent_path?: string;
  torrent_filename?: string;
  magnet?: string;
  btih?: string;
  size?: number;
  piece_length?: number;
  error?: string;
}

async function createTorrent(filePath: string, certNumber: string): Promise<TorrentResult> {
  const scriptCandidates = [
    '/var/www/atoros/scripts/create_torrent.py',
    path.join(process.cwd(), 'scripts', 'create_torrent.py'),
  ];
  let scriptPath: string | null = null;
  for (const c of scriptCandidates) if (existsSync(c)) { scriptPath = c; break; }
  if (!scriptPath) return { ok: false, error: 'create_torrent.py not found' };

  const python = findPython();
  return new Promise((resolve) => {
    try {
      const stdout = execFileSync(python, [scriptPath!, filePath, certNumber], {
        encoding: 'utf-8', timeout: 120000,
      });
      resolve(JSON.parse(stdout));
    } catch (e: any) {
      const errOut = (e.stdout || '') + (e.stderr || '');
      try { resolve(JSON.parse(errOut)); } catch { resolve({ ok: false, error: e.message }); }
    }
  });
}

export async function POST(req: NextRequest) {
  let tempDir: string | null = null;
  try {
    const user = await getCurrentUserWithProfile();
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const formData = await req.formData();
    const workTitle = (formData.get('workTitle') as string | null)?.trim();
    const workType = (formData.get('workType') as string | null)?.trim();
    const description = (formData.get('description') as string | null)?.trim() || null;
    const coAuthors = (formData.get('coAuthors') as string | null)?.trim() || null;

    if (!workTitle) return NextResponse.json({ error: 'Укажите название произведения' }, { status: 400 });
    if (!workType) return NextResponse.json({ error: 'Укажите тип произведения' }, { status: 400 });

    // Collect all files from formData
    const incomingFiles: File[] = [];
    for (const [key, value] of Array.from(formData.entries())) {
      if (key === 'files' && value instanceof File) {
        incomingFiles.push(value);
      }
    }
    const singleFile = formData.get('file');
    if (singleFile instanceof File) incomingFiles.push(singleFile);

    if (incomingFiles.length === 0) {
      return NextResponse.json({ error: 'Прикрепите хотя бы один файл' }, { status: 400 });
    }
    if (incomingFiles.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Максимум ${MAX_FILES} файлов за одно депонирование (получено ${incomingFiles.length})` },
        { status: 413 }
      );
    }

    // Validate sizes
    let totalSize = 0;
    for (const f of incomingFiles) {
      if (f.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Файл «${f.name}» превышает лимит 10 МБ (${(f.size / 1024 / 1024).toFixed(2)} МБ)` },
          { status: 413 }
        );
      }
      totalSize += f.size;
    }
    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        { error: `Общий размер файлов превышает лимит 30 МБ (${(totalSize / 1024 / 1024).toFixed(2)} МБ)` },
        { status: 413 }
      );
    }

    // Ensure uploads dir exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate cert number
    const year = new Date().getFullYear();
    const lastInYear = await db.certificate.findFirst({
      where: { certYear: year },
      orderBy: { certSeq: 'desc' },
    });
    const certSeq = (lastInYear?.certSeq ?? 0) + 1;
    const certNumber = `${year}-${String(certSeq).padStart(3, '0')}`;
    const archiveName = `atoros_${certNumber}.7z`;
    const archivePath = path.join(UPLOAD_DIR, archiveName);

    // Generate random password
    const archivePassword = generateArchivePassword(16);

    // Create temp dir for source files
    tempDir = path.join(UPLOAD_DIR, `_tmp_${user.id}_${Date.now()}`);
    await mkdir(tempDir, { recursive: true });

    // Write each uploaded file to temp dir (sanitize names)
    const fileRecords: { originalName: string; storedName: string; mimeType: string; size: number }[] = [];
    for (const f of incomingFiles) {
      const buffer = Buffer.from(await f.arrayBuffer());
      const safeName = f.name.replace(/[^a-zA-Z0-9._\-\u0400-\u04FF]/g, '_');
      const filePath = path.join(tempDir, safeName);
      await writeFile(filePath, buffer);
      fileRecords.push({
        originalName: f.name,
        storedName: `${certNumber}_${Date.now()}_${safeName}`,
        mimeType: f.type || 'application/octet-stream',
        size: f.size,
      });
    }

    // Create AES-256 encrypted 7z archive using 7z binary
    const sevenZip = find7z();
    const fileArgs = incomingFiles.map((f) =>
      path.join(tempDir, f.name.replace(/[^a-zA-Z0-9._\-\u0400-\u04FF]/g, '_'))
    );

    // 7z command: a (add) -p<PWD> -mhe=on (encrypt headers) -mx=5
    const args = ['a', `-p${archivePassword}`, '-mx=5', '-mhe=on', archivePath, ...fileArgs];
    try {
      execFileSync(sevenZip, args, { stdio: 'pipe', timeout: 120000 });
    } catch (err: any) {
      console.error('[upload] 7z failed, fallback to plain zip:', err.message);
      // Use basic zip via JSZip
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      for (const f of incomingFiles) {
        const buffer = Buffer.from(await f.arrayBuffer());
        const safeName = f.name.replace(/[^a-zA-Z0-9._\-\u0400-\u04FF]/g, '_');
        zip.file(safeName, buffer);
      }
      const zipBuffer = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });
      await writeFile(archivePath, zipBuffer);
    }

    // Compute hashes of the final archive
    const archiveBuffer = await readFile(archivePath);
    const md5Hash = crypto.createHash('md5').update(archiveBuffer).digest('hex');
    const sha256Hash = crypto.createHash('sha256').update(archiveBuffer).digest('hex');

    // === FNS trusted timestamp (RFC 3161, GOST R 34.11-2012) ===
    console.log('[upload] Requesting FNS trusted timestamp...');
    const fnsResult = await requestFnsTimestamp(archivePath);
    if (fnsResult.ok) console.log('[upload] FNS:', fnsResult.timestamp_iso, 'serial:', fnsResult.serial_hex);
    else console.warn('[upload] FNS failed:', fnsResult.error);

    // === Create torrent for decentralized storage ===
    console.log('[upload] Creating torrent for decentralized storage...');
    const torrentResult = await createTorrent(archivePath, certNumber);
    if (torrentResult.ok) console.log('[upload] Torrent:', torrentResult.btih);
    else console.warn('[upload] Torrent failed:', torrentResult.error);

    // === Upload to clouds (Yandex + Google) ===
    const cloudResult = await uploadToClouds(archivePath, archiveName, `/Atoros/${year}/${archiveName}`);

    // Create certificate + file records in a transaction
    const cert = await db.$transaction(async (tx) => {
      const newCert = await tx.certificate.create({
        data: {
          certNumber,
          certYear: year,
          certSeq,
          workTitle,
          workType,
          description,
          coAuthors,
          archiveName,
          archiveSize: archiveBuffer.length,
          archivePath,
          md5Hash,
          sha256Hash,
          fileCount: fileRecords.length,
          archivePassword,
          yandexDiskUrl: cloudResult.yandexDiskUrl,
          googleDriveUrl: cloudResult.googleDriveUrl,
          yandexDiskUploadedAt: cloudResult.yandexDiskUrl ? new Date() : null,
          googleDriveUploadedAt: cloudResult.googleDriveUrl ? new Date() : null,
          fnsTimestampToken: fnsResult.ok ? (fnsResult.token_base64 || null) : null,
          fnsTimestampTime: fnsResult.ok && fnsResult.timestamp_iso ? new Date(fnsResult.timestamp_iso) : null,
          fnsGostHash: fnsResult.ok ? (fnsResult.hash_gost || null) : null,
          fnsTokenSerial: fnsResult.ok ? (fnsResult.serial_hex || null) : null,
          torrentMagnet: torrentResult.ok ? (torrentResult.magnet || null) : null,
          torrentBtih: torrentResult.ok ? (torrentResult.btih || null) : null,
          torrentPath: torrentResult.ok ? (torrentResult.torrent_path || null) : null,
          torrentPieceLength: torrentResult.ok ? (torrentResult.piece_length || null) : null,
          torrentCreatedAt: torrentResult.ok ? new Date() : null,
          authorFirstName: user.firstName,
          authorMiddleName: user.middleName,
          authorLastName: user.lastName,
          authorCountry: user.country,
          authorEmail: user.email,
          authorPhone: user.phone,
          authorCity: user.city,
          authorId: user.id,
          status: 'published',
        },
      });

      for (const fr of fileRecords) {
        await tx.archiveFile.create({
          data: {
            certificateId: newCert.id,
            originalName: fr.originalName,
            storedName: fr.storedName,
            mimeType: fr.mimeType,
            size: fr.size,
          },
        });
      }

      return newCert;
    });

    return NextResponse.json({
      ok: true,
      certificate: {
        id: cert.id,
        slug: cert.slug,
        certNumber: cert.certNumber,
        md5Hash: cert.md5Hash,
        sha256Hash: cert.sha256Hash,
        archivePassword,
        fileCount: fileRecords.length,
        createdAt: cert.createdAt,
      },
      fnsTimestamp: fnsResult.ok ? {
        time: fnsResult.timestamp_iso, serial: fnsResult.serial_hex, gostHash: fnsResult.hash_gost,
      } : null,
      torrent: torrentResult.ok ? {
        btih: torrentResult.btih, magnet: torrentResult.magnet,
      } : null,
    });
  } catch (e: any) {
    console.error('[upload] error', e);
    return NextResponse.json(
      { error: e.message ?? 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  } finally {
    // Cleanup temp dir
    if (tempDir) {
      try { await rm(tempDir, { recursive: true, force: true }); } catch {}
    }
  }
}
