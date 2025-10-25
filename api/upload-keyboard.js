export default async function handler(req, res) {
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

  const { image } = req.body;
  if (!image) return res.status(400).json({ error: 'No image provided' });

  // Voor nu simuleren we een upload
  res.status(200).json({ url: 'https://via.placeholder.com/600x200.png?text=Keyboard' });
}
