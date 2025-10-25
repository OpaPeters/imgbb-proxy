export default async function handler(req, res) {
  // 1️⃣ CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2️⃣ Preflight request afhandelen
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3️⃣ Alleen POST toestaan
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { image } = req.body;
    if (!image) throw new Error('No image provided');

    // Voor nu: we simuleren upload en geven een test URL terug
    // Later kun je echte upload naar imgbb of S3 doen
    const uploadedUrl = 'https://via.placeholder.com/600x200.png?text=Keyboard+Upload';

    res.status(200).json({ url: uploadedUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
