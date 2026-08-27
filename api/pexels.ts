import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const key = process.env.PEXELS_API_KEY
  const query = String(req.query.query ?? 'travel landscape')

  if (!key) {
    return res.status(200).json({ mode: 'fallback', photo: null })
  }

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`
    const response = await fetch(url, {
      headers: { Authorization: key },
    })
    if (!response.ok) throw new Error('pexels')
    const data = await response.json()
    const photo = data.photos?.[0]
    if (!photo) return res.status(200).json({ mode: 'fallback', photo: null })

    return res.status(200).json({
      mode: 'live',
      photo: {
        url: photo.src?.large2x ?? photo.src?.large ?? photo.src?.original,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        sourceUrl: photo.url,
      },
    })
  } catch {
    return res.status(200).json({ mode: 'fallback', photo: null })
  }
}
