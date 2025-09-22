// api/device-info.js
module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, error: 'Method not allowed' });
      return;
    }

    const payload = req.body || (await getReqBody(req));
    // Simple validation
    if (!payload) {
      res.status(400).json({ ok: false, error: 'Missing JSON body' });
      return;
    }

    // TODO: Replace with real persistence (DB, Google Sheets, S3, etc.)
    // For now: log to server console (Vercel logs)
    console.log('[device-info] received payload:', JSON.stringify(payload, null, 2));

    // Return success
    res.status(200).json({ ok: true, received: true });
  } catch (err) {
    console.error('device-info error:', err);
    res.status(500).json({ ok: false, error: err.message || String(err) });
  }
};

// helper to parse body if needed (Vercel usually handles JSON)
function getReqBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', err => reject(err));
  });
} 
