import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    const slug = req.nextUrl.searchParams.get('slug');
    const id = req.nextUrl.searchParams.get('id');
    if (!slug && !id) {
      return NextResponse.json({ error: 'slug или id обязателен' }, { status: 400 });
    }

    const cert = slug
      ? await db.certificate.findUnique({ where: { slug } })
      : await db.certificate.findUnique({ where: { id: id! } });

    if (!cert) return NextResponse.json({ error: 'Не найдено' }, { status: 404 });
    if (cert.authorId !== user.id) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const buffer = await readFile(cert.archivePath);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${cert.archiveName}"`,
        'Content-Length': String(buffer.length),
      },
    });
  } catch (e: any) {
    console.error('[download] error', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
