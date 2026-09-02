import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile, unlink } from 'fs/promises';
import { existsSync, createWriteStream } from 'fs';
import path from 'path';
import crypto from 'crypto';
import archiver from 'archiver';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per file
const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30 MB total
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Generate 12-char alphanumeric password
function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes = crypto.randomBytes(12);
  let pwd = '';
  for (let i = 0; i < 12; i++) {
    pwd += chars[bytes[i] % chars.length];
  }
  return pwd;
}

export async function POST(req: NextRequest) {
  let tmpFiles: string[] = [];
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files').filter((f): f is File => f instanceof File);

    const workTitle = (formData.get('workTitle') as string | null)?.trim();
    const workType = (formData.get('workType') as string | null)?.trim();
    const description = (formData.get('description') as string | null)?.trim() || null;
    const coAuthors = (formData.get('coAuthors') as string | null)?.trim() || null;

    if (!files.length) return NextResponse.json({ error: 'Прикрепите хотя бы один файл' }, { status: 400 });
    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Максимум ${MAX_FILES} файлов за раз` }, { status: 413 });
    }
    if (!workTitle) return NextResponse.json({ error: 'Укажите название произведения' }, { status: 400 });
    if (!workType) return NextResponse.json({ error: 'Укажите тип произведения' }, { status: 400 });

    // Validate sizes
    let totalSize = 0;
    for (const f of files) {
      if (f.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Файл "${f.name}" превышает лимит 10 МБ (${(f.size / 1024 / 1024).toFixed(2)} МБ)` },
          { status: 413 }
        );
      }
      totalSize += f.size;
    }
    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        { error: `Суммарный размер файлов превышает лимит 30 МБ (${(totalSize / 1024 / 1024).toFixed(2)} МБ)` },
        { status: 413 }
      );
    }

    // Ensure uploads dir exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Save files to temp dir
    const tmpDir = path.join(UPLOAD_DIR, `tmp_${user.id}_${Date.now()}`);
    await mkdir(tmpDir, { recursive: true });
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const safeName = f.name.replace(/[^a-zA-Zа-яА-Я0-9._\-\s]/g, '_');
      const tmpPath = path.join(tmpDir, safeName);
      const buf = Buffer.from(await f.arrayBuffer());
      await writeFile(tmpPath, buf);
      tmpFiles.push(tmpPath);
    }

    // Generate archive password
    const archivePassword = generatePassword();

    // Build archive name: YYYYMMDD_N.zip where N = sequence today
    const now = new Date();
    const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

    // Count today's certs to determine sequence
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const todayCerts = await db.certificate.count({
      where: { createdAt: { gte: startOfDay, lte: endOfDay } },
    });
    const daySeq = todayCerts + 1;

    const archiveName = `${ymd}_${daySeq}.zip`;
    const archivePath = path.join(UPLOAD_DIR, archiveName);
    const slug = `${daySeq}_${ymd}`;

    // Generate legacy cert number YYYY-NNN
    const year = now.getFullYear();
    const lastInYear = await db.certificate.findFirst({
      where: { certYear: year },
      orderBy: { certSeq: 'desc' },
    });
    const certSeq = (lastInYear?.certSeq ?? 0) + 1;
    const certNumber = `${year}-${String(certSeq).padStart(3, '0')}`;

    // Create ZIP with AES-256 encryption
    await new Promise<void>((resolve, reject) => {
      const output = createWriteStream(archivePath);
      const archive = archiver('zip', {
        zlib: { level: 6 },
        encryption: {
          password: archivePassword,
          algorithm: 'aes256',
        },
      } as any);

      output.on('close', () => resolve());
      output.on('error', reject);
      archive.on('error', reject);

      archive.pipe(output);

      // Add each file to archive
      for (const tmpPath of tmpFiles) {
        const filename = path.basename(tmpPath);
        archive.file(tmpPath, { name: filename });
      }

      archive.finalize();
    });

    // Read archive into buffer for hashing
    const archiveBuffer = await readFile(archivePath);
    const md5Hash = crypto.createHash('md5').update(archiveBuffer).digest('hex');
    const sha256Hash = crypto.createHash('sha256').update(archiveBuffer).digest('hex');

    // Delete temporary files (we keep only the encrypted archive)
    for (const tmpPath of tmpFiles) {
      try { await unlink(tmpPath); } catch {}
    }
    try { await unlink(tmpDir); } catch {}

    // Get full user profile for snapshot
    const profile = await db.user.findUnique({ where: { id: user.id } });
    if (!profile) {
      return NextResponse.json({ error: 'Профиль не найден' }, { status: 404 });
    }

    const cert = await db.certificate.create({
      data: {
        slug,
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
        fileCount: files.length,
        md5Hash,
        sha256Hash,
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

    return NextResponse.json({
      ok: true,
      certificate: {
        id: cert.id,
        slug: cert.slug,
        certNumber: cert.certNumber,
        archiveName: cert.archiveName,
        md5Hash: cert.md5Hash,
        sha256Hash: cert.sha256Hash,
        fileCount: cert.fileCount,
        createdAt: cert.createdAt,
      },
    });
  } catch (e: any) {
    console.error('[upload] error', e);
    for (const tmpPath of tmpFiles) {
      try { await unlink(tmpPath); } catch {}
    }
    return NextResponse.json(
      { error: e.message ?? 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
