export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // 🔹 Haal base64-waarde uit FormData of JSON body
    let image;

    if (req.headers['content-type']?.includes('application/json')) {
      // Komt binnen als JSON
      ({ image } = req.body);
    } else {
      // Komt binnen als multipart/form-data
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = Buffer.concat(chunks).toString();
      const match = body.match(/name="image"\r\n\r\n(.+)/);
      if (match) image = match[1];
    }

    if (!image) {
      console.error('❌ Geen afbeelding ontvangen');
      return res.status(400).json({ error: 'No image received' });
    }

    // ✅ strip "data:image/png;base64," als dat nog aanwezig is
    if (image.startsWith('data:image')) {
      image = image.replace(/^data:image\/\w+;base64,/, '');
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      console.error('❌ Geen API key ingesteld');
      return res.status(500).json({ error: 'Missing IMGBB API key on server' });
    }

    console.log('📤 Uploaden naar imgbb...');

    // ✅ Gebruik FormData voor imgbb-upload
    const formData = new FormData();
    formData.append('image', image);

    const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
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
