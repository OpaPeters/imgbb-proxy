// Vercel serverless function - accepts JSON { image: 'data:image/png;base64,...' }
// and forwards to Imgbb using an env var IMGBB_API_KEY
export const config = {
  api: {
    bodyParser: {
      // Vergroot limiet als je grote images verwacht (10mb in dit voorbeeld)
      sizeLimit: '10mb'
    }
  }
};

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST' });

    const { image } = req.body;
    if (!image || typeof image !== 'string') return res.status(400).json({ error: 'No image provided' });

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Server missing IMGBB_API_KEY' });

    // stuur base64 zonder data: prefix naar Imgbb
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
      console.warn('ImgBB response:', j);
      return res.status(500).json({ error: 'ImgBB upload failed', detail: j });
    }
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
