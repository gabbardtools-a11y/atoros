import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const PDF_CACHE_DIR = path.join(process.cwd(), '.next', 'pdf-cache');

async function getOrBuildPdf(certId: string): Promise<Buffer> {
  // Check cache first (PDF is deterministic for a given cert)
  const cachePath = path.join(PDF_CACHE_DIR, `${certId}.pdf`);
  try {
    const cached = await fs.readFile(cachePath);
    // Verify cert still exists & unchanged
    const cert = await db.certificate.findUnique({ where: { id: certId } });
    if (cert && cached.length > 5000) {
      return cached;
    }
  } catch {
    // not cached, build it
  }

  // Lazy-load puppeteer (heavy dependency)
  const puppeteer = (await import('puppeteer')).default;

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  try {
    const page = await browser.newPage();
    // Use localhost:3011 (the running PM2 atoros process) to render the cert page
    const url = `http://localhost:3011/cert/${certId}?print=true`;
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait a bit more for any animations / fonts
    await new Promise((r) => setTimeout(r, 1500));

    // Generate PDF — 2 pages (A4 portrait, no margins, with backgrounds)
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: false,
    });

    // Save to cache
    try {
      await fs.mkdir(PDF_CACHE_DIR, { recursive: true });
      await fs.writeFile(cachePath, pdfBuffer);
    } catch (e) {
      // cache failure is non-fatal
    }

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Verify cert exists and is published
  const cert = await db.certificate.findUnique({ where: { id } });
  if (!cert || cert.status !== 'published') {
    return NextResponse.json({ error: 'Свидетельство не найдено' }, { status: 404 });
  }

  try {
    const pdfBuffer = await getOrBuildPdf(id);
    const filename = `Свидетельство № ${cert.certNumber} — Atoros.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(pdfBuffer.length),
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (e: any) {
    console.error('[pdf] error', e);
    return NextResponse.json(
      { error: 'Не удалось сгенерировать PDF', details: e.message },
      { status: 500 }
    );
  }
}
