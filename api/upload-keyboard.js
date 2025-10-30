export default async function handler(req, res) {
  // ✅ CORS headers toestaan
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    if (!image) throw new Error('No image received');

    // ✅ upload naar imgbb
    const apiKey = process.env.IMGBB_API_KEY; // Zet deze in Vercel bij "Environment Variables"
    const imgbbUrl = 'https://api.imgbb.com/1/upload';

    const uploadRes = await fetch(`${imgbbUrl}?key=${apiKey}`, {
      method: 'POST',
      body: new URLSearchParams({ image }),
    });

    const result = await uploadRes.json();

    if (!result.success) {
      throw new Error(result.error?.message || 'Upload failed');
    }

    // ✅ Stuur correcte URL terug
    return res.status(200).json({ url: result.data.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
