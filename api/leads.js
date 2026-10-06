// Vercel Node function. Credentials stay on the server, never in the Vite bundle.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) {
    return res.status(415).json({ ok: false });
  }
  let data;
  try { data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
  catch { return res.status(400).json({ ok: false }); }
  const { id, name, phone = '' } = data || {};
  if (typeof id !== 'string' || !/^[a-f0-9-]{36}$/i.test(id) ||
      typeof name !== 'string' || !name.trim() || name.length > 30 ||
      typeof phone !== 'string' || (phone !== '' && !/^\d{10,15}$/.test(phone))) {
    return res.status(400).json({ ok: false });
  }
  const url = process.env.GOOGLE_SHEETS_WEB_APP_URL;
  const secret = process.env.GOOGLE_SHEETS_SECRET;
  if (!url || !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url) || !secret) {
    return res.status(503).json({ ok: false });
  }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: name.trim(), phone, secret }),
      signal: AbortSignal.timeout(20000),
      redirect: 'follow',
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error('Sheet write failed');
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ ok: false });
  }
}
