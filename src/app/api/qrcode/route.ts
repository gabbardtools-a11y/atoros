import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const data = req.nextUrl.searchParams.get('data');
  if (!data) {
    return NextResponse.json({ error: 'data required' }, { status: 400 });
  }
  try {
    const buffer = await QRCode.toBuffer(data, {
      type: 'png',
      margin: 1,
      width: 320,
      color: { dark: '#0B1220', light: '#FFFFFF' },
      errorCorrectionLevel: 'M',
    });
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
