// api/upload.js
module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, error: 'Method not allowed' });
      return;
    }

    const payload = req.body || (await getReqBody(req));
    if (!payload || !payload.image) {
      res.status(400).json({ ok: false, error: 'Missing image data' });
      return;
    }

    // payload.image is a dataURL (data:image/png;base64,...)
    // TODO: Add real storage (S3, Cloudinary, filesystem in serverless is ephemeral)
    // For now, just log basic info (length)
    console.log('[upload] uid:', payload.uid || null, 'image length:', (payload.image || '').length);

    // Optionally: store small metadata in memory (not persisted across invocations)
    // Return success
    res.status(200).json({ ok: true, uploaded: true });
  } catch (err) {
    console.error('upload error:', err);
    res.status(500).json({ ok: false, error: err.message || String(err) });
  }
};

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
