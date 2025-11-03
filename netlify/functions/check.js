exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const SITE_ACTIVE = process.env.SITE_ACTIVE !== 'false';
  if (!SITE_ACTIVE) {
    return json({ ok:false, msg:'Content currently unavailable.' }, 503);
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json({ ok:false, msg:'Bad JSON' }, 400);
  }

  const code = (payload.code || '').trim();
  if (!code) return json({ ok:false, msg:'Missing code' }, 400);

  let cfg = { codes: ['alpha1','beta2','charlie3'], cookieHours: 8 };
  try {
    if (process.env.PASSWORDS_JSON) cfg = JSON.parse(process.env.PASSWORDS_JSON);
  } catch {}

  const allowed = Array.isArray(cfg.codes) ? cfg.codes : [];
  const ok = allowed.includes(code);
  if (!ok) return json({ ok:false, msg:'Invalid code' }, 401);

  const hours = Number(cfg.cookieHours || 8);
  const expires = new Date(Date.now() + hours*60*60*1000).toUTCString();
  const cookie = `bloomed_code=${encodeURIComponent(code)}; Expires=${expires}; Path=/; Secure; SameSite=None`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookie,
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify({ ok:true, msg:'Access granted' })
  };
};

function json(obj, status=200){
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(obj)
  };
}
