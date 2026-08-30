import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    const certs = await db.certificate.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        certNumber: true,
        workTitle: true,
        workType: true,
        archiveName: true,
        archiveSize: true,
        md5Hash: true,
        status: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ certificates: certs });
  } catch (e: any) {
    console.error('[certificates list] error', e);
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 });
  }
}
