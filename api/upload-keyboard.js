export default async function handler(req, res) {
  // CORS toestaan
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
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image data received' });
    }

    const formData = new FormData();
    formData.append('image', imageBase64);
    formData.append('name', `keyboard_${Date.now()}`);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=JOUW_IMGBB_API_KEY`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!data.success) {
      return res.status(500).json({ error: 'Upload naar imgbb mislukt', details: data });
    }

    return res.status(200).json({ imageUrl: data.data.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Serverfout tijdens upload' });
  }
}

