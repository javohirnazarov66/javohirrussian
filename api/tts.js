// Vercel Serverless Function — Google Translate TTS Proxy
// Place this file at: api/tts.js in your GitHub repo root
// It will be available at: https://your-site.vercel.app/api/tts?q=слово

export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    res.status(400).json({ error: 'Missing query parameter: q' });
    return;
  }

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(q)}&tl=ru&client=tw-ob&ttsspeed=0.85`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/',
      },
    });

    if (!response.ok) {
      throw new Error(`Google TTS responded with ${response.status}`);
    }

    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // cache audio 24h
    res.status(200).send(Buffer.from(buffer));

  } catch (err) {
    console.error('TTS proxy error:', err);
    res.status(500).json({ error: err.message });
  }
}
