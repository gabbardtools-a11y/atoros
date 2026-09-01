import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const workTitle = (formData.get('workTitle') as string | null)?.trim();
    const workType = (formData.get('workType') as string | null)?.trim();
    const description = (formData.get('description') as string | null)?.trim() || null;
    const coAuthors = (formData.get('coAuthors') as string | null)?.trim() || null;

    if (!file) return NextResponse.json({ error: 'Файл не передан' }, { status: 400 });
    if (!workTitle) return NextResponse.json({ error: 'Укажите название произведения' }, { status: 400 });
    if (!workType) return NextResponse.json({ error: 'Укажите тип произведения' }, { status: 400 });
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `Размер файла превышает лимит 10 МБ (получено ${(file.size / 1024 / 1024).toFixed(2)} МБ)` },
        { status: 413 }
      );
    }

    // Read file into buffer for hashing and writing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Compute MD5 hash
    const md5Hash = crypto.createHash('md5').update(buffer).digest('hex');

    // Ensure uploads directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Save file with unique name: <userId>_<timestamp>_<originalname>
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const savedName = `${user.id}_${Date.now()}_${safeName}`;
    const savedPath = path.join(UPLOAD_DIR, savedName);
    await writeFile(savedPath, buffer);

    // Generate cert number: YYYY-NNN (per-year sequence)
    const year = new Date().getFullYear();
    const lastInYear = await db.certificate.findFirst({
      where: { certYear: year },
      orderBy: { certSeq: 'desc' },
    });
    const certSeq = (lastInYear?.certSeq ?? 0) + 1;
    const certNumber = `${year}-${String(certSeq).padStart(3, '0')}`;

    // Get full user profile for snapshot
    const profile = await db.user.findUnique({ where: { id: user.id } });
    if (!profile) {
      return NextResponse.json({ error: 'Профиль не найден' }, { status: 404 });
    }

    const cert = await db.certificate.create({
      data: {
        certNumber,
        certYear: year,
        certSeq,
        workTitle,
        workType,
        description,
        coAuthors,
        archiveName: file.name,
        archiveSize: file.size,
        archivePath: savedPath,
        md5Hash,
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
        certNumber: cert.certNumber,
        md5Hash: cert.md5Hash,
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
