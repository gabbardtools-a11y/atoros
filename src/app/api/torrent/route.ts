import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Параметр slug обязателен' }, { status: 400 });
    }

    const cert = await db.certificate.findUnique({
      where: { slug },
      select: {
        certNumber: true,
        workTitle: true,
        torrentPath: true,
        torrentBtih: true,
        torrentMagnet: true,
        archiveName: true,
        status: true,
      },
    });

    if (!cert || cert.status !== 'published') {
      return NextResponse.json({ error: 'Свидетельство не найдено' }, { status: 404 });
    }

    if (!cert.torrentPath || !existsSync(cert.torrentPath)) {
      return NextResponse.json({ error: 'Torrent-файл не найден на сервере' }, { status: 404 });
    }

    const torrentData = await readFile(cert.torrentPath);

    // Set filename for download
    const filename = `atoros_${cert.certNumber}.torrent`;

    return new NextResponse(torrentData, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-bittorrent',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': torrentData.length.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (e: any) {
    console.error('[api/torrent] error:', e);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
