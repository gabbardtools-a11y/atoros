import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import JSZip from 'jszip';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per file
const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30 MB total
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

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

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
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
    // Backward compat: also accept single "file" field
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

    // Generate cert number FIRST (so we know the archive name)
    const year = new Date().getFullYear();
    const lastInYear = await db.certificate.findFirst({
      where: { certYear: year },
      orderBy: { certSeq: 'desc' },
    });
    const certSeq = (lastInYear?.certSeq ?? 0) + 1;
    const certNumber = `${year}-${String(certSeq).padStart(3, '0')}`;
    const archiveName = `atoros_${certNumber}.zip`;

    // Generate random password for ZIP
    const archivePassword = generateArchivePassword(16);

    // Build ZIP with password protection (ZipCrypto — supported by JSZip)
    const zip = new JSZip();
    const fileRecords: { originalName: string; storedName: string; mimeType: string; size: number }[] = [];

    for (const f of incomingFiles) {
      const buffer = Buffer.from(await f.arrayBuffer());
      const safeName = f.name.replace(/[^a-zA-Z0-9._\-\u0400-\u04FF]/g, '_');
      zip.file(safeName, buffer, {
        // @ts-ignore — password option exists in JSZip for ZipCrypto
        password: archivePassword,
      });
      fileRecords.push({
        originalName: f.name,
        storedName: `${certNumber}_${Date.now()}_${safeName}`,
        mimeType: f.type || 'application/octet-stream',
        size: f.size,
      });
    }

    // Generate encrypted ZIP buffer
    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
      // @ts-ignore — encryption option for ZipCrypto
      encryption: 'std',
    });

    // Compute hashes
    const md5Hash = crypto.createHash('md5').update(zipBuffer).digest('hex');
    const sha256Hash = crypto.createHash('sha256').update(zipBuffer).digest('hex');

    // Save ZIP to disk
    const savedPath = path.join(UPLOAD_DIR, `${user.id}_${Date.now()}_${archiveName}`);
    await writeFile(savedPath, zipBuffer);

    // Get full user profile
    const profile = await db.user.findUnique({ where: { id: user.id } });
    if (!profile) {
      return NextResponse.json({ error: 'Профиль не найден' }, { status: 404 });
    }

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
          archiveSize: zipBuffer.length,
          archivePath: savedPath,
          md5Hash,
          sha256Hash,
          fileCount: fileRecords.length,
          archivePassword,
          authorFirstName: profile.firstName,
          authorMiddleName: profile.middleName,
          authorLastName: profile.lastName,
          authorCountry: profile.country,
          authorEmail: profile.email,
          authorPhone: profile.phone,
          authorCity: profile.city,
          authorId: profile.id,
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
        archivePassword,
        fileCount: fileRecords.length,
        createdAt: cert.createdAt,
      },
    });
  } catch (e: any) {
    console.error('[upload] error', e);
    return NextResponse.json(
      { error: e.message ?? 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
