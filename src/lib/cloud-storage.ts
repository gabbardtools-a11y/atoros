/**
 * Cloud storage utilities — upload copies of deposited archives to:
 * 1. Yandex Disk (via REST API)
 * 2. Google Drive (via Service Account)
 *
 * Both are optional — if credentials are not set, uploads are silently skipped.
 * The archive is already saved locally on the server; cloud copies are for
 * redundancy and public verification (links shown on certificate page).
 */

import { readFile } from 'fs/promises';
import { createReadStream } from 'fs';

// ============ YANDEX DISK ============

/**
 * Upload a file to Yandex Disk using REST API.
 * Flow: 1) get upload URL → 2) PUT file → 3) get public URL
 *
 * @param localPath - server path to the file
 * @param remotePath - path on Yandex Disk, e.g. "/Atoros/2026-001.7z"
 * @param token - Yandex OAuth access token
 * @returns public download URL or null on failure
 */
export async function uploadToYandexDisk(
  localPath: string,
  remotePath: string,
  token: string
): Promise<string | null> {
  try {
    // Step 0: Ensure parent folder exists (create if needed)
    const folderPath = remotePath.split('/').slice(0, -1).join('/') || '/';
    const mkDirRes = await fetch(
      `https://cloud-api.yandex.net/v1/disk/resources?path=${encodeURIComponent(folderPath)}`,
      {
        method: 'PUT',
        headers: { Authorization: `OAuth ${token}` },
      }
    );
    // 201 = created, 409 = already exists — both OK
    if (!mkDirRes.ok && mkDirRes.status !== 409) {
      console.error('[yandex] mkdir failed:', mkDirRes.status, await mkDirRes.text());
    }

    // Step 1: Get upload URL
    const uploadUrlRes = await fetch(
      `https://cloud-api.yandex.net/v1/disk/resources/upload?path=${encodeURIComponent(remotePath)}&overwrite=true`,
      {
        method: 'GET',
        headers: {
          Authorization: `OAuth ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!uploadUrlRes.ok) {
      console.error('[yandex] getUploadURL failed:', uploadUrlRes.status, await uploadUrlRes.text());
      return null;
    }

    const uploadData = await uploadUrlRes.json();
    const href = uploadData.href;
    if (!href) {
      console.error('[yandex] no href in response');
      return null;
    }

    // Step 2: Upload file
    const fileBuffer = await readFile(localPath);
    const putRes = await fetch(href, {
      method: 'PUT',
      body: fileBuffer,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    if (!putRes.ok) {
      console.error('[yandex] upload failed:', putRes.status);
      return null;
    }

    // Step 3: Publish file (make it publicly accessible)
    const publishRes = await fetch(
      `https://cloud-api.yandex.net/v1/disk/resources/publish?path=${encodeURIComponent(remotePath)}`,
      {
        method: 'PUT',
        headers: { Authorization: `OAuth ${token}` },
      }
    );

    if (!publishRes.ok) {
      console.error('[yandex] publish failed:', publishRes.status);
      // Upload succeeded, just no public link — still OK
    }

    // Step 4: Get public download URL
    const metaRes = await fetch(
      `https://cloud-api.yandex.net/v1/disk/resources?path=${encodeURIComponent(remotePath)}`,
      {
        method: 'GET',
        headers: { Authorization: `OAuth ${token}` },
      }
    );

    if (metaRes.ok) {
      const meta = await metaRes.json();
      // public_url is the shareable link
      return meta.public_url ?? meta.public_download_url ?? null;
    }

    return null;
  } catch (e: any) {
    console.error('[yandex] error:', e.message);
    return null;
  }
}

// ============ GOOGLE DRIVE ============

/**
 * Get a fresh access token using OAuth refresh token.
 * Access tokens expire in 1 hour; refresh tokens don't expire (until revoked).
 */
async function getGoogleAccessToken(): Promise<string | null> {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.log('[google] OAuth credentials not configured — skipping');
    return null;
  }

  // Read refresh token from file (written by /api/google-callback)
  let refreshToken: string | undefined;
  try {
    const tokenPath = (process.env.ATOROS_UPLOAD_DIR || process.cwd()) + '/../.google-refresh-token';
    refreshToken = (await readFile(tokenPath, 'utf-8')).trim();
  } catch {
    // Try env as fallback
    refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  }

  if (!refreshToken) {
    console.log('[google] No refresh token — skipping Google Drive');
    return null;
  }

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!res.ok) {
      console.error('[google] refresh token failed:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data.access_token;
  } catch (e: any) {
    console.error('[google] refresh error:', e.message);
    return null;
  }
}

/**
 * Upload a file to Google Drive using OAuth (user account).
 * Uses fetch + resumable upload (no googleapis SDK needed).
 *
 * @param localPath - server path to the file
 * @param fileName - name for the file on Google Drive
 * @param folderId - ID of the target folder
 * @returns shareable URL or null on failure
 */
export async function uploadToGoogleDrive(
  localPath: string,
  fileName: string,
  folderId?: string
): Promise<string | null> {
  try {
    const accessToken = await getGoogleAccessToken();
    if (!accessToken) return null;

    // Read file
    const fileBuffer = await readFile(localPath);

    // Step 1: Create file metadata + upload in single multipart request
    const boundary = 'atoros_' + Date.now();
    const metadata = {
      name: fileName,
      parents: folderId ? [folderId] : undefined,
    };

    const metadataPart = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
    const filePartStart = `--${boundary}\r\nContent-Type: application/x-7z-compressed\r\n\r\n`;
    const endBoundary = `\r\n--${boundary}--`;

    const body = Buffer.concat([
      Buffer.from(metadataPart, 'utf-8'),
      Buffer.from(filePartStart, 'utf-8'),
      fileBuffer,
      Buffer.from(endBoundary, 'utf-8'),
    ]);

    const uploadRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
          'Content-Length': body.length.toString(),
        },
        body,
      }
    );

    if (!uploadRes.ok) {
      console.error('[google] upload failed:', uploadRes.status, await uploadRes.text());
      return null;
    }

    const fileData = await uploadRes.json();
    if (!fileData.id) {
      console.error('[google] no file ID');
      return null;
    }

    // Step 2: Make file public
    const permRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileData.id}/permissions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'reader', type: 'anyone' }),
      }
    );

    if (!permRes.ok) {
      console.error('[google] make public failed:', permRes.status);
    }

    // Return webContentLink (direct download)
    return fileData.webContentLink || fileData.webViewLink || `https://drive.google.com/file/d/${fileData.id}/view`;
  } catch (e: any) {
    console.error('[google] error:', e.message);
    return null;
  }
}

// ============ ORCHESTRATOR ============

export type CloudUploadResult = {
  yandexDiskUrl: string | null;
  googleDriveUrl: string | null;
};

/**
 * Upload archive copies to both cloud storages.
 * Silently skips any platform that doesn't have credentials configured.
 */
export async function uploadToClouds(
  localPath: string,
  fileName: string,
  remotePath: string
): Promise<CloudUploadResult> {
  const result: CloudUploadResult = {
    yandexDiskUrl: null,
    googleDriveUrl: null,
  };

  // Yandex Disk (if token configured)
  const yandexToken = process.env.YANDEX_DISK_TOKEN;
  if (yandexToken) {
    console.log('[cloud] Uploading to Yandex Disk...');
    result.yandexDiskUrl = await uploadToYandexDisk(localPath, remotePath, yandexToken);
    console.log('[cloud] Yandex Disk:', result.yandexDiskUrl ?? 'failed');
  } else {
    console.log('[cloud] YANDEX_DISK_TOKEN not set — skipping');
  }

  // Google Drive (always try — getGoogleAccessToken reads refresh token from file or env)
  const googleFolder = process.env.GOOGLE_DRIVE_FOLDER_ID || undefined;
  console.log('[cloud] Uploading to Google Drive (OAuth)...');
  result.googleDriveUrl = await uploadToGoogleDrive(localPath, fileName, googleFolder);
  console.log('[cloud] Google Drive:', result.googleDriveUrl ?? 'failed/skipped');

  return result;
}
