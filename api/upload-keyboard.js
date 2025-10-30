export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { image } = req.body;
    if (!image) {
      console.error('❌ Geen afbeelding ontvangen');
      return res.status(400).json({ error: 'No image received' });
    }

    // 🔑 Gebruik jouw IMGBB API-sleutel
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      console.error('❌ Geen API key ingesteld');
      return res.status(500).json({ error: 'Missing IMGBB API key on server' });
    }

    console.log('📤 Uploaden naar imgbb...');

    // Upload naar imgbb
    const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: new URLSearchParams({ image })
    });

    const result = await uploadRes.json();
    console.log('📦 Antwoord van imgbb:', result);

    if (!result.success) {
      throw new Error(result.error?.message || 'Upload failed');
    }

    // ✅ Alles goed
    res.status(200).json({ url: result.data.url });

  } catch (err) {
    console.error('💥 Upload error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
