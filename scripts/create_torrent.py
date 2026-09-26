#!/usr/bin/env python3
"""
create_torrent.py — Create a .torrent file for a deposited archive
and add it to transmission-daemon for seeding.

Usage:
    python3 create_torrent.py <file_path> <cert_number>

Output (JSON to stdout):
    {
      "ok": true,
      "torrent_path": "/var/www/atoros/torrents/files/atoros_2026-001.torrent",
      "magnet": "magnet:?xt=urn:btih:...&dn=...&tr=...",
      "btih": "abcdef1234567890...",
      "info_hash_v2": null,  # if v1 only
      "size": 12345,
      "piece_length": 16384,
      "trackers": [...]
    }

On error:
    {"ok": false, "error": "..."}
"""
import os
import sys
import json
import subprocess
import urllib.parse
from pathlib import Path

# Trackers — hybrid: our own + 5 public
# Our tracker is not yet set up, so use public ones first.
# When tracker.atoros.ru is up, add: "http://tracker.atoros.ru:6969/announce"
TRACKERS = [
    "udp://tracker.opentrackr.org:1337/announce",
    "udp://tracker.openbittorrent.com:80/announce",
    "udp://exodus.desync.com:6969/announce",
    "udp://tracker.torrent.eu.org:451/announce",
    "udp://open.stealth.si:80/announce",
    "udp://tracker.tiny-vps.com:6969/announce",
]

TORRENT_DIR = "/var/www/atoros/torrents/files"
TRANSMISSION_REMOTE = "/usr/bin/transmission-remote"


def create_torrent(file_path: str, cert_number: str) -> dict:
    """Create a .torrent file using transmission-create, then add to transmission."""
    if not os.path.exists(file_path):
        return {"ok": False, "error": f"File not found: {file_path}"}

    file_size = os.path.getsize(file_path)
    if file_size == 0:
        return {"ok": False, "error": "File is empty"}

    # Determine piece size
    # For small files (<1 MB): 16 KB pieces
    # For medium files (1-100 MB): 256 KB pieces
    # For large files (>100 MB): 1 MB pieces
    if file_size < 1 * 1024 * 1024:
        piece_size = 16 * 1024  # 16 KB
    elif file_size < 100 * 1024 * 1024:
        piece_size = 256 * 1024  # 256 KB
    else:
        piece_size = 1024 * 1024  # 1 MB

    # Output torrent path
    torrent_filename = f"atoros_{cert_number}.torrent"
    torrent_path = os.path.join(TORRENT_DIR, torrent_filename)

    # Ensure dir exists
    os.makedirs(TORRENT_DIR, exist_ok=True)

    # Build transmission-create command
    cmd = [
        "/usr/bin/transmission-create",
        "-o", torrent_path,
        "-c", f"Atoros deposit #{cert_number} — https://atoros.ru/cert/{cert_number.lower().replace('-', '/')}",
        "-n", "Atoros.ru",  # creator
    ]
    # Add trackers
    for tracker in TRACKERS:
        cmd.extend(["-t", tracker])
    # Add the file
    cmd.append(file_path)

    # Run
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        if result.returncode != 0:
            return {
                "ok": False,
                "error": f"transmission-create failed: {result.stderr or result.stdout}",
            }
    except Exception as e:
        return {"ok": False, "error": f"transmission-create error: {e}"}

    if not os.path.exists(torrent_path):
        return {"ok": False, "error": "Torrent file was not created"}

    # Get info hash using transmission-show
    try:
        result = subprocess.run(
            ["/usr/bin/transmission-show", torrent_path],
            capture_output=True, text=True, timeout=30
        )
        show_output = result.stdout
    except Exception as e:
        return {"ok": False, "error": f"transmission-show error: {e}"}

    # Parse transmission-show output to get hash
    # Format in Transmission 4.x: "Hash v1: abc123..." or "Hash v2: def456..."
    btih = None
    for line in show_output.split("\n"):
        line = line.strip()
        if line.startswith("Hash v1:"):
            btih = line.split(":", 1)[1].strip()
            break
        elif line.startswith("Hash:"):
            btih = line.split(":", 1)[1].strip()
            break

    if not btih:
        return {"ok": False, "error": f"Could not parse hash from: {show_output[:300]}"}

    # Get magnet using transmission-show -m
    try:
        result = subprocess.run(
            ["/usr/bin/transmission-show", "-m", torrent_path],
            capture_output=True, text=True, timeout=30
        )
        magnet = result.stdout.strip()
    except Exception as e:
        # Fallback: build magnet manually
        display_name = f"atoros_{cert_number}.7z"
        magnet_parts = [
            f"xt=urn:btih:{btih}",
            f"dn={urllib.parse.quote(display_name)}",
        ]
        for tracker in TRACKERS:
            magnet_parts.append(f"tr={urllib.parse.quote(tracker)}")
        magnet = "magnet:?" + "&".join(magnet_parts)

    # Add to transmission-daemon for seeding
    try:
        result = subprocess.run(
            [TRANSMISSION_REMOTE, "--add", torrent_path],
            capture_output=True, text=True, timeout=30
        )
        # transmission-remote returns something like:
        # "/var/www/atoros/torrents/files/atoros_2026-001.torrent (1): ... responded: success"
        if result.returncode != 0 and "success" not in (result.stdout + result.stderr).lower():
            return {
                "ok": False,
                "error": f"transmission-remote --add failed: {result.stderr or result.stdout}",
                "torrent_path": torrent_path,
                "magnet": magnet,
                "btih": btih,
            }
    except Exception as e:
        return {
            "ok": False,
            "error": f"transmission-remote error: {e}",
            "torrent_path": torrent_path,
            "magnet": magnet,
            "btih": btih,
        }

    return {
        "ok": True,
        "torrent_path": torrent_path,
        "torrent_filename": torrent_filename,
        "magnet": magnet,
        "btih": btih,
        "size": file_size,
        "piece_length": piece_size,
        "trackers": TRACKERS,
        "transmission_show": show_output[:500],
    }


def main():
    if len(sys.argv) < 3:
        print(json.dumps({
            "ok": False,
            "error": "Usage: create_torrent.py <file_path> <cert_number>"
        }))
        sys.exit(1)

    file_path = sys.argv[1]
    cert_number = sys.argv[2]  # e.g. "2026-001"

    result = create_torrent(file_path, cert_number)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
