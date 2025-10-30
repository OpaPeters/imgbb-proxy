export default async function handler(req, res) {
  // ✅ CORS headers toestaan
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { image } = req.body;
    if (!image) throw new Error('No image received');

    // 👇 hier kun je later echte upload toevoegen
    res.status(200).json({
      url: 'https://via.placeholder.com/600x200.png?text=Keyboard'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
