// Production server for www.reallycare.org.
//
// Serves the static site built into ../dist, sets security headers, redirects
// old Hexo URLs, and handles the demo request form (POST /api/demo), which is
// emailed via Amazon SES to the Plait support inbox so it becomes a ticket.
//
// Environment:
//   PORT          port to listen on (default 3003)
//   DEMO_TO       where demo requests go (default support@reallycare.plaitapp.org)
//   DEMO_FROM     sender address, must be on an SES-verified domain (default noreply@reallycare.plaitapp.org)
//   AWS_REGION    SES region (default eu-west-2). AWS credentials come from the usual SDK chain.
//   DEMO_DRY_RUN  if set, log demo requests instead of sending them (for local testing)

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const PORT = Number(process.env.PORT ?? 3003);
const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const DEMO_TO = process.env.DEMO_TO ?? 'support@reallycare.plaitapp.org';
const DEMO_FROM = process.env.DEMO_FROM ?? 'noreply@reallycare.plaitapp.org';
const DRY_RUN = Boolean(process.env.DEMO_DRY_RUN);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.pdf': 'application/pdf',
};
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.svg']);

// Old Hexo URLs. Blog posts kept their URLs, so they need no entry here.
const REDIRECTS = {
  '/home/': '/',
  '/solutions/': '/plait/',
  '/thanks/': '/why-reallycare/',
  '/contact/': '/about/#contact',
  '/privacy.html': '/privacy/', // linked from shipped versions of the Plait mobile app
};
const REDIRECT_PREFIXES = ['/archives/', '/categories/', '/tags/', '/page/'];

// ---------------------------------------------------------------------------
// Load the whole built site into memory at startup (it is small), with
// pre-compressed copies, so requests never touch the disk.

const files = new Map();
const inlineScriptHashes = new Set();

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(full); continue; }
    const ext = path.extname(entry.name).toLowerCase();
    const body = fs.readFileSync(full);
    const file = {
      body,
      type: MIME[ext] ?? 'application/octet-stream',
      etag: '"' + crypto.createHash('sha1').update(body).digest('base64url') + '"',
      // Astro's hashed bundles never change, so they can be cached for ever
      immutable: full.includes(`${path.sep}_astro${path.sep}`),
    };
    if (COMPRESSIBLE.has(ext) && body.length > 1024) {
      file.br = zlib.brotliCompressSync(body);
      file.gzip = zlib.gzipSync(body, { level: 9 });
    }
    if (ext === '.html') collectInlineScripts(body.toString('utf8'));
    files.set('/' + path.relative(DIST, full).split(path.sep).join('/'), file);
  }
}

// The CSP allows only scripts from this site plus the exact inline scripts the
// build produced, so their hashes are worked out here rather than kept by hand.
function collectInlineScripts(html) {
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    if (m[1].trim()) inlineScriptHashes.add(`'sha256-${crypto.createHash('sha256').update(m[1]).digest('base64')}'`);
  }
}

walk(DIST);

const CSP = [
  "default-src 'self'",
  `script-src 'self' ${[...inlineScriptHashes].join(' ')}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  'frame-src https://www.youtube-nocookie.com',
  "form-action 'self' https://reallycare.us20.list-manage.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');

const SECURITY_HEADERS = {
  'Content-Security-Policy': CSP,
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  // YouTube embeds need at least the origin to be sent
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

// ---------------------------------------------------------------------------

function findFile(pathname) {
  let p;
  try { p = decodeURIComponent(pathname); } catch { return null; }
  if (p.includes('\0')) return null;
  return files.get(p) ?? files.get(p.endsWith('/') ? p + 'index.html' : p + '/index.html') ?? null;
}

function send(req, res, file, status = 200) {
  const headers = {
    ...SECURITY_HEADERS,
    'Content-Type': file.type,
    'Cache-Control': file.immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
    ETag: file.etag,
    Vary: 'Accept-Encoding',
  };
  if (status === 200 && req.headers['if-none-match'] === file.etag) {
    res.writeHead(304, headers);
    return res.end();
  }
  const accept = req.headers['accept-encoding'] ?? '';
  let body = file.body;
  if (file.br && /\bbr\b/.test(accept)) { body = file.br; headers['Content-Encoding'] = 'br'; }
  else if (file.gzip && /\bgzip\b/.test(accept)) { body = file.gzip; headers['Content-Encoding'] = 'gzip'; }
  headers['Content-Length'] = body.length;
  res.writeHead(status, headers);
  res.end(req.method === 'HEAD' ? undefined : body);
}

function redirect(res, location, status = 301) {
  res.writeHead(status, { ...SECURITY_HEADERS, Location: location, 'Content-Length': 0 });
  res.end();
}

// ---------------------------------------------------------------------------
// Demo request form

const mailer = DRY_RUN
  ? null
  : nodemailer.createTransport({
      SES: { sesClient: new SESv2Client({ region: process.env.AWS_REGION ?? 'eu-west-2' }), SendEmailCommand },
    });

// Simple per-IP limit so the form can't be used to flood the support inbox
const recent = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const times = (recent.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  times.push(now);
  recent.set(ip, times);
  if (recent.size > 10000) recent.clear();
  return times.length > 5;
}

function readBody(req, limit = 16 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(new Error('Body too large')); req.destroy(); }
      else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const clean = (v, max) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);

async function handleDemo(req, res) {
  const ip = String(req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? '').split(',')[0].trim();
  try {
    const form = new URLSearchParams(await readBody(req));
    // Bots fill in the hidden field; pretend it worked so they don't retry
    if (form.get('website')) return redirect(res, '/demo-requested/', 303);

    const name = clean(form.get('name'), 100);
    const email = clean(form.get('email'), 200);
    const org = clean(form.get('org'), 200);
    const phone = clean(form.get('phone'), 40);
    const message = String(form.get('message') ?? '').trim().slice(0, 4000);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return redirect(res, '/demo-problem/', 303);
    if (rateLimited(ip)) return redirect(res, '/demo-problem/', 303);

    const text = [
      'Demo request from www.reallycare.org',
      '',
      `Name:         ${name}`,
      `Email:        ${email}`,
      `Organisation: ${org || '-'}`,
      `Phone:        ${phone || '-'}`,
      '',
      message || '(no message)',
    ].join('\n');

    if (DRY_RUN) {
      console.log(`[demo] DRY RUN, would send to ${DEMO_TO}:\n${text}`);
    } else {
      await mailer.sendMail({
        from: { name: 'ReallyCare website', address: DEMO_FROM },
        to: DEMO_TO,
        replyTo: { name, address: email },
        subject: `Demo request: ${name}${org ? `, ${org}` : ''}`,
        text,
      });
    }
    console.log(`[demo] request from ${email} (${org || 'no organisation'})`);
    redirect(res, '/demo-requested/', 303);
  } catch (err) {
    console.error('[demo] failed:', err);
    redirect(res, '/demo-problem/', 303);
  }
}

// ---------------------------------------------------------------------------

const notFound = files.get('/404.html');

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const { pathname } = url;

    if (pathname === '/api/demo') {
      if (req.method === 'POST') return void handleDemo(req, res);
      return redirect(res, '/#demo', 303);
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { ...SECURITY_HEADERS, Allow: 'GET, HEAD' });
      return res.end();
    }

    if (REDIRECTS[pathname]) return redirect(res, REDIRECTS[pathname]);
    if (REDIRECT_PREFIXES.some((p) => pathname.startsWith(p))) return redirect(res, '/blog/');

    const file = findFile(pathname);
    if (file) {
      // Directory URLs always end in a slash, as they did on the old site
      if (!pathname.endsWith('/') && !path.extname(pathname)) return redirect(res, pathname + '/' + url.search);
      return send(req, res, file);
    }
    send(req, res, notFound, 404);
  })
  .listen(PORT, () => {
    console.log(`Serving ${files.size} files from ${DIST} on port ${PORT}${DRY_RUN ? ' (demo form in dry-run mode)' : ''}`);
  });
