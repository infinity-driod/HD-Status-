import express from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const {
  PORT = 3000, WHATSAPP_TOKEN, PHONE_NUMBER_ID, WA_BUSINESS_NUMBER,
  VERIFY_TOKEN, APP_SECRET, APP_PASSWORD, GRAPH_VERSION = 'v23.0',
} = process.env;

const MAX_VIDEO = 15 * 1024 * 1024; // WhatsApp API limit is 16 MB; keep a margin
const MAX_IMAGE = 4.8 * 1024 * 1024; // limit is 5 MB
const MAX_FILES = 20;
const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
const TMP = path.resolve('tmp');
await fs.mkdir(TMP, { recursive: true });

const jobs = new Map(); // batchId -> { items: [{ file, kind, sent }], expires, busy }
const upload = multer({ dest: TMP, limits: { fileSize: 500 * 1024 * 1024 } });

const run = (cmd, args) => new Promise((resolve, reject) => {
  const p = spawn(cmd, args);
  let out = '', err = '';
  p.stdout.on('data', d => (out += d));
  p.stderr.on('data', d => (err += d));
  p.on('error', reject);
  p.on('close', c => (c === 0 ? resolve(out) : reject(new Error(err.slice(-300)))));
});
const size = async f => (await fs.stat(f)).size;

const probe = (sel, input) => run('ffprobe', ['-v', 'error', '-select_streams', sel,
  '-show_entries', 'stream=codec_name', '-of', 'csv=p=0', input]).then(s => s.trim());

async function processVideo(input, output) {
  const maps = ['-map', '0:v:0', '-map', '0:a:0?'];
  const [v, a] = await Promise.all([probe('v:0', input), probe('a:0', input)]);
  // Already H.264/AAC and small enough: copy the streams, zero quality loss, instant.
  if (v === 'h264' && (a === 'aac' || a === '') && (await size(input)) <= MAX_VIDEO) {
    await run('ffmpeg', ['-y', '-i', input, ...maps, '-c', 'copy', '-movflags', '+faststart', output]);
    return;
  }
  const base = ['-y', '-i', input, ...maps, '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart'];
  await run('ffmpeg', [...base, '-preset', 'veryfast', '-crf', '18', output]);
  if ((await size(output)) <= MAX_VIDEO) return;
  const dur = parseFloat(await run('ffprobe', ['-v', 'error', '-show_entries',
    'format=duration', '-of', 'csv=p=0', input]));
  const kbps = Math.floor((MAX_VIDEO * 8 * 0.95) / dur / 1000) - 128;
  if (kbps < 300) throw new Error('Video is too long to fit in 16 MB. Trim it first.');
  await run('ffmpeg', [...base, '-preset', 'veryfast', '-b:v', `${kbps}k`, '-maxrate', `${kbps}k`,
    '-bufsize', `${kbps * 2}k`, output]);
}

async function processImage(input, output) {
  for (const q of ['2', '5', '10', '18']) {
    await run('ffmpeg', ['-y', '-i', input, '-frames:v', '1', '-q:v', q, output]);
    if ((await size(output)) <= MAX_IMAGE) return;
  }
  throw new Error('Could not shrink the image under 5 MB.');
}

const graph = (endpoint, init) =>
  fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${PHONE_NUMBER_ID}/${endpoint}`, {
    ...init,
    headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, ...init.headers },
  }).then(async r => {
    const j = await r.json();
    if (!r.ok) throw new Error(JSON.stringify(j.error ?? j));
    return j;
  });

const sendText = (to, body) => graph('messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body } }),
});

async function deliver(to, item) {
  const mime = item.kind === 'video' ? 'video/mp4' : 'image/jpeg';
  const form = new FormData();
  form.append('messaging_product', 'whatsapp');
  form.append('type', mime);
  form.append('file', new Blob([await fs.readFile(item.file)], { type: mime }), path.basename(item.file));
  const { id } = await graph('media', { method: 'POST', body: form });
  await graph('messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: item.kind, [item.kind]: { id } }),
  });
}

const dropJob = id => {
  const job = jobs.get(id);
  jobs.delete(id);
  job?.items.forEach(i => fs.unlink(i.file).catch(() => {}));
};

const app = express();
app.use(express.json({ verify: (req, _res, buf) => { req.rawBody = buf; } }));
app.get('/', (_req, res) => res.sendFile(path.resolve('index.html')));
app.get('/api/info', (_req, res) => res.json({ passwordRequired: !!APP_PASSWORD, maxFiles: MAX_FILES }));

// 1) Start a batch. One WhatsApp message later delivers every file in it.
app.post('/api/batch', (req, res) => {
  if (APP_PASSWORD && req.body?.password !== APP_PASSWORD) return res.status(401).json({ error: 'Wrong password.' });
  const id = crypto.randomUUID();
  jobs.set(id, { items: [], expires: Date.now() + 3600e3 });
  const text = `Please CLICK SEND to get your HD files!\n<${id}>`;
  res.json({ id, link: `https://wa.me/${WA_BUSINESS_NUMBER}?text=${encodeURIComponent(text)}` });
});

// 2) Add files one at a time (keeps requests small and lets the page show progress).
app.post('/api/batch/:id/file', upload.single('file'), async (req, res) => {
  const f = req.file;
  try {
    const job = jobs.get(req.params.id);
    if (!job) return res.status(404).json({ error: 'Batch expired. Start again.' });
    if (!f) return res.status(400).json({ error: 'No file received.' });
    if (job.items.length >= MAX_FILES) return res.status(400).json({ error: `Max ${MAX_FILES} files per batch.` });
    const kind = f.mimetype.startsWith('video/') ? 'video' : f.mimetype.startsWith('image/') ? 'image' : null;
    if (!kind) return res.status(400).json({ error: 'Only photos and videos are supported.' });
    const out = path.join(TMP, crypto.randomUUID() + (kind === 'video' ? '.mp4' : '.jpg'));
    await (kind === 'video' ? processVideo : processImage)(f.path, out);
    job.items.push({ file: out, kind });
    job.expires = Date.now() + 3600e3;
    res.json({ kind, size: await size(out) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    if (f) fs.unlink(f.path).catch(() => {});
  }
});

app.get('/webhook', (req, res) => {
  const q = req.query;
  if (q['hub.mode'] === 'subscribe' && q['hub.verify_token'] === VERIFY_TOKEN) return res.send(q['hub.challenge']);
  res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  if (APP_SECRET) {
    const got = req.get('x-hub-signature-256') || '';
    const want = 'sha256=' + crypto.createHmac('sha256', APP_SECRET).update(req.rawBody ?? '').digest('hex');
    if (got.length !== want.length || !crypto.timingSafeEqual(Buffer.from(got), Buffer.from(want))) {
      return res.sendStatus(401);
    }
  }
  res.sendStatus(200);
  const msgs = (req.body.entry ?? []).flatMap(e => e.changes ?? []).flatMap(c => c.value?.messages ?? []);
  for (const m of msgs) {
    const id = m.text?.body?.match(UUID)?.[0].toLowerCase();
    if (!id) continue;
    const job = jobs.get(id);
    try {
      if (!job || !job.items.length) { await sendText(m.from, 'That link expired. Upload the files again.'); continue; }
      if (job.busy) continue;
      job.busy = true;
      try {
        for (const item of job.items) {
          if (item.sent) continue;
          await deliver(m.from, item); // in order, one by one
          item.sent = true;
        }
        dropJob(id);
      } finally { job.busy = false; }
    } catch (e) {
      console.error('Delivery failed:', e.message); // unsent files stay; send the message again to retry
    }
  }
});

setInterval(() => {
  for (const [id, j] of jobs) if (j.expires < Date.now()) dropJob(id);
}, 5 * 60 * 1000);

app.listen(PORT, () => console.log(`HD Status running on http://localhost:${PORT}`));
