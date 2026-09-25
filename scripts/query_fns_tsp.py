#!/usr/bin/env python3
"""
query_fns_tsp.py — Request a qualified trusted timestamp from FNS TSP server.

Usage:
    python3 query_fns_tsp.py <file_path>

Output (JSON to stdout):
    {
      "ok": true,
      "token_base64": "...",       # DER TimeStampResp, base64
      "token_size": 3761,           # bytes (decoded)
      "timestamp_iso": "2026-09-12T20:07:12Z",
      "serial_hex": "2676677003...",
      "hash_gost": "be72f7ab...",   # hex GOST R 34.11-2012 256-bit hash
      "hash_algorithm": "1.2.643.7.1.1.2.2",
      "tsp_url": "http://uc.nalog.ru/tsp/tsp.srf",
      "error": null
    }

On error:
    {"ok": false, "error": "...", ...}

Algorithm:
  1. Read file, compute GOST R 34.11-2012 (Streebog) 256-bit hash
  2. Build RFC 3161 TimeStampReq DER (version=1, hash=GOST, nonce=random, cert_req=true)
  3. POST to http://uc.nalog.ru/tsp/tsp.srf (Content-Type: application/timestamp-query)
  4. Parse TimeStampResp DER — extract status, timestamp, serial
  5. Return JSON
"""
import os
import sys
import json
import base64
import secrets
import urllib.request
import urllib.error
import subprocess
import tempfile
from pathlib import Path

TSP_URL = 'http://uc.nalog.ru/tsp/tsp.srf'
GOST_HASH_OID = '1.2.643.7.1.1.2.2'  # GOST R 34.11-2012 256-bit


# ===== ASN.1 DER encoding helpers =====

def der_length(length: int) -> bytes:
    if length < 0x80:
        return bytes([length])
    elif length < 0x100:
        return bytes([0x81, length])
    elif length < 0x10000:
        return bytes([0x82, length >> 8, length & 0xff])
    elif length < 0x1000000:
        return bytes([0x83, (length >> 16) & 0xff, (length >> 8) & 0xff, length & 0xff])
    else:
        raise ValueError(f'Length too large: {length}')


def der_tag_length(tag: int, content: bytes) -> bytes:
    return bytes([tag]) + der_length(len(content)) + content


def der_sequence(content: bytes) -> bytes:
    return der_tag_length(0x30, content)


def der_oid(oid_str: str) -> bytes:
    parts = [int(x) for x in oid_str.split('.')]
    first = parts[0] * 40 + parts[1]
    body = bytes([first])
    for p in parts[2:]:
        if p == 0:
            body += b'\x00'
            continue
        chunks = []
        while p > 0:
            chunks.insert(0, p & 0x7f)
            p >>= 7
        for i in range(len(chunks) - 1):
            chunks[i] |= 0x80
        body += bytes(chunks)
    return der_tag_length(0x06, body)


def der_octet_string(data: bytes) -> bytes:
    return der_tag_length(0x04, data)


def der_integer(value: int) -> bytes:
    if value == 0:
        return der_tag_length(0x02, b'\x00')
    body = value.to_bytes((value.bit_length() + 7) // 8, 'big', signed=False)
    if body[0] & 0x80:
        body = b'\x00' + body
    return der_tag_length(0x02, body)


def der_boolean(value: bool) -> bytes:
    return der_tag_length(0x01, b'\xff' if value else b'\x00')


# ===== GOST hash =====

def compute_gost_hash(data: bytes) -> bytes:
    """Compute GOST R 34.11-2012 256-bit (Streebog) hash."""
    from gostcrypto import gosthash
    h = gosthash.new('streebog256')
    h.update(data)
    return h.digest()


# ===== TSP query builder =====

def build_tsp_query(hash_bytes: bytes, hash_oid: str = GOST_HASH_OID, cert_req: bool = True) -> bytes:
    """Build RFC 3161 TimeStampReq DER."""
    algorithm_id = der_sequence(der_oid(hash_oid) + der_tag_length(0x05, b''))
    message_imprint = der_sequence(algorithm_id + der_octet_string(hash_bytes))
    nonce_int = int.from_bytes(secrets.token_bytes(16), 'big')
    nonce_der = der_integer(nonce_int)
    cert_req_der = der_boolean(cert_req)
    version = der_integer(1)
    content = version + message_imprint + nonce_der + cert_req_der
    return der_sequence(content)


# ===== TSP response parser =====

def parse_tsp_response(response_der: bytes, query_file: Path = None) -> dict:
    """
    Parse TimeStampResp DER using openssl ts -reply -text.
    Returns dict with: status, timestamp_iso, serial_hex.
    """
    with tempfile.NamedTemporaryFile(suffix='.tsr', delete=False) as f:
        f.write(response_der)
        tsr_path = f.name

    try:
        result = subprocess.run(
            ['openssl', 'ts', '-reply', '-in', tsr_path, '-text'],
            capture_output=True, text=True, timeout=10
        )
        text = result.stdout
        if not text:
            return {'status': 'parse_error', 'raw_stderr': result.stderr[:500]}

        # Parse output
        out = {'status': 'unknown'}
        for line in text.split('\n'):
            line = line.strip()
            if line.startswith('Status:'):
                out['status'] = line.split(':', 1)[1].strip().rstrip('.')
            elif line.startswith('Time stamp:'):
                ts_str = line.split(':', 1)[1].strip()
                # Format: "Sep 12 20:07:12 2026 GMT"
                try:
                    from datetime import datetime, timezone
                    dt = datetime.strptime(ts_str, '%b %d %H:%M:%S %Y %Z').replace(tzinfo=timezone.utc)
                    out['timestamp_iso'] = dt.isoformat().replace('+00:00', 'Z')
                except Exception:
                    out['timestamp_raw'] = ts_str
            elif line.startswith('Serial number:'):
                serial = line.split(':', 1)[1].strip()
                # Format: "0x2676677003000000005C82F79A"
                if serial.startswith('0x'):
                    out['serial_hex'] = serial[2:]
                else:
                    out['serial_hex'] = serial
        return out
    finally:
        os.unlink(tsr_path)


# ===== Main =====

def main():
    if len(sys.argv) < 2:
        print(json.dumps({'ok': False, 'error': 'Usage: query_fns_tsp.py <file_path>'}))
        sys.exit(1)

    file_path = sys.argv[1]
    if not os.path.exists(file_path):
        print(json.dumps({'ok': False, 'error': f'File not found: {file_path}'}))
        sys.exit(1)

    try:
        file_data = Path(file_path).read_bytes()
    except Exception as e:
        print(json.dumps({'ok': False, 'error': f'Cannot read file: {e}'}))
        sys.exit(1)

    try:
        hash_bytes = compute_gost_hash(file_data)
    except ImportError:
        print(json.dumps({
            'ok': False,
            'error': 'gostcrypto not installed. Run: pip install gostcrypto'
        }))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({'ok': False, 'error': f'GOST hash failed: {e}'}))
        sys.exit(1)

    try:
        query = build_tsp_query(hash_bytes, GOST_HASH_OID, cert_req=True)
    except Exception as e:
        print(json.dumps({'ok': False, 'error': f'Query build failed: {e}'}))
        sys.exit(1)

    req = urllib.request.Request(TSP_URL, data=query, method='POST')
    req.add_header('Content-Type', 'application/timestamp-query')
    req.add_header('User-Agent', 'Atoros-TSP/1.0')

    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            status = r.status
            response_data = r.read()
            ct = r.headers.get('Content-Type', '')
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', errors='replace')[:500]
        print(json.dumps({'ok': False, 'error': f'HTTP {e.code}: {body}'}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({'ok': False, 'error': f'Network error: {e}'}))
        sys.exit(1)

    if status != 200:
        print(json.dumps({'ok': False, 'error': f'HTTP {status}'}))
        sys.exit(1)

    parsed = parse_tsp_response(response_data)

    if parsed.get('status') not in ('Granted', 'Granted with modifications'):
        print(json.dumps({
            'ok': False,
            'error': f"FNS rejected query: status={parsed.get('status')}",
            'fns_status': parsed,
        }))
        sys.exit(1)

    token_b64 = base64.b64encode(response_data).decode()

    result = {
        'ok': True,
        'token_base64': token_b64,
        'token_size': len(response_data),
        'timestamp_iso': parsed.get('timestamp_iso'),
        'timestamp_raw': parsed.get('timestamp_raw'),
        'serial_hex': parsed.get('serial_hex'),
        'hash_gost': hash_bytes.hex(),
        'hash_algorithm': GOST_HASH_OID,
        'tsp_url': TSP_URL,
        'error': None,
    }

    print(json.dumps(result, ensure_ascii=False))


if __name__ == '__main__':
    main()
