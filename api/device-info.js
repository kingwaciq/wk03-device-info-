const fetch = require('node-fetch'); // که Node.js < 18 وي، که نه native fetch کار کوي

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const payload = req.body || (await getReqBody(req));
    if (!payload) return res.status(400).json({ ok: false, error: 'Missing payload' });

    console.log('[device-info] received payload:', payload);

    // --- تلګرام ته واستول ---
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.ADMIN_CHAT_ID;

    let message = `📱 Device Info Received:\n`;
    for (let key in payload) {
      if (typeof payload[key] === 'object') {
        message += `${key}: ${JSON.stringify(payload[key])}\n`;
      } else {
        message += `${key}: ${payload[key]}\n`;
      }
    }

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message })
    });

    res.status(200).json({ ok: true, sent: true });
  } catch(err) {
    console.error('device-info error:', err);
    res.status(500).json({ ok: false, error: err.message || String(err) });
  }
};

function getReqBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } 
      catch (e) { reject(e); }
    });
    req.on('error', err => reject(err));
  });
} 
