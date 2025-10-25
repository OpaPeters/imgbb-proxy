export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' }
  }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing IMGBB_API_KEY' });

    const payload = new URLSearchParams();
    payload.append('image', image.split(',')[1]);
    payload.append('name', 'keyboard_' + Date.now());

    const r = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      body: payload
    });

    const j = await r.json();
    if (j && j.success && j.data && j.data.url) {
      return res.status(200).json({ url: j.data.url });
    } else {
      console.error('ImgBB response error', j);
      return res.status(500).json({ error: 'ImgBB upload failed', detail: j });
    }
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server exception' });
  }
}
