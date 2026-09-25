import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET || '';
const REDIRECT_URI = 'https://atoros.ru/api/google-callback';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const error = req.nextUrl.searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`https://atoros.ru/dashboard?google_error=${error}`);
  }

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('[google-callback] token exchange failed:', errText);
      return NextResponse.redirect(`https://atoros.ru/dashboard?google_error=token_failed`);
    }

    const tokens = await tokenRes.json();
    const refreshToken = tokens.refresh_token;
    const accessToken = tokens.access_token;

    if (!refreshToken) {
      console.error('[google-callback] no refresh_token in response');
      return NextResponse.redirect(`https://atoros.ru/dashboard?google_error=no_refresh`);
    }

    // Write refresh token to a separate file (more reliable than .env in standalone mode)
    const { writeFile, mkdir } = await import('fs/promises');
    const { dirname } = await import('path');
    const tokenPath = (process.env.ATOROS_UPLOAD_DIR || process.cwd()) + '/../.google-refresh-token';
    const tokenDir = dirname(tokenPath);
    try { await mkdir(tokenDir, { recursive: true }); } catch {}
    await writeFile(tokenPath, refreshToken, 'utf-8');
    console.log('[google-callback] Refresh token saved to', tokenPath);
    console.log('[google-callback] Google Drive connected successfully!');

    return NextResponse.redirect(`https://atoros.ru/dashboard?google_success=true`);
  } catch (e: any) {
    console.error('[google-callback] error:', e.message);
    return NextResponse.redirect(`https://atoros.ru/dashboard?google_error=exception`);
  }
}
