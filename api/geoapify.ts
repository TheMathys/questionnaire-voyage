import type { VercelRequest, VercelResponse } from '@vercel/node'

const FALLBACK_CITIES = [
  { formatted: 'Paris, France', lat: 48.8566, lon: 2.3522, city: 'Paris', country: 'France' },
  { formatted: 'Lyon, France', lat: 45.764, lon: 4.8357, city: 'Lyon', country: 'France' },
  { formatted: 'Marseille, France', lat: 43.2965, lon: 5.3698, city: 'Marseille', country: 'France' },
  { formatted: 'Bordeaux, France', lat: 44.8378, lon: -0.5792, city: 'Bordeaux', country: 'France' },
  { formatted: 'Toulouse, France', lat: 43.6047, lon: 1.4442, city: 'Toulouse', country: 'France' },
  { formatted: 'Bruxelles, Belgique', lat: 50.8503, lon: 4.3517, city: 'Bruxelles', country: 'Belgique' },
  { formatted: 'Genève, Suisse', lat: 46.2044, lon: 6.1432, city: 'Genève', country: 'Suisse' },
  { formatted: 'Nice, France', lat: 43.7102, lon: 7.262, city: 'Nice', country: 'France' },
  { formatted: 'Nantes, France', lat: 47.2184, lon: -1.5536, city: 'Nantes', country: 'France' },
  { formatted: 'Lille, France', lat: 50.6292, lon: 3.0573, city: 'Lille', country: 'France' },
]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const key = process.env.GEOAPIFY_API_KEY
  const type = String(req.query.type ?? 'autocomplete')

  if (!key) {
    if (type === 'autocomplete') {
      const text = String(req.query.text ?? '').toLowerCase()
      const results = FALLBACK_CITIES.filter((c) =>
        c.formatted.toLowerCase().includes(text),
      ).slice(0, 6)
      return res.status(200).json({ mode: 'fallback', results })
    }
    return res.status(200).json({ mode: 'fallback', results: [] })
  }

  try {
    if (type === 'autocomplete') {
      const text = String(req.query.text ?? '')
      if (text.length < 3) return res.status(200).json({ mode: 'live', results: [] })
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&limit=6&lang=fr&apiKey=${key}`
      const response = await fetch(url)
      if (!response.ok) throw new Error('geoapify')
      const data = await response.json()
      const results = (data.features ?? []).map(
        (f: {
          properties: {
            formatted: string
            lat: number
            lon: number
            city?: string
            country?: string
          }
        }) => ({
          formatted: f.properties.formatted,
          lat: f.properties.lat,
          lon: f.properties.lon,
          city: f.properties.city,
          country: f.properties.country,
        }),
      )
      return res.status(200).json({ mode: 'live', results })
    }

    if (type === 'places') {
      const lat = String(req.query.lat)
      const lng = String(req.query.lng)
      const categories = String(req.query.categories ?? 'tourism.sights')
      const limit = String(req.query.limit ?? '6')
      const url = `https://api.geoapify.com/v2/places?categories=${encodeURIComponent(categories)}&filter=circle:${lng},${lat},5000&bias=proximity:${lng},${lat}&limit=${limit}&lang=fr&apiKey=${key}`
      const response = await fetch(url)
      if (!response.ok) throw new Error('places')
      const data = await response.json()
      const results = (data.features ?? []).map(
        (
          f: {
            properties: {
              place_id?: string
              name?: string
              categories?: string[]
              address_line1?: string
              formatted?: string
              lat?: number
              lon?: number
              distance?: number
            }
          },
          i: number,
        ) => ({
          id: f.properties.place_id ?? `poi-${i}`,
          name: f.properties.name ?? f.properties.address_line1 ?? 'Lieu d’intérêt',
          category: f.properties.categories?.[0] ?? categories,
          address: f.properties.formatted ?? f.properties.address_line1,
          lat: f.properties.lat,
          lng: f.properties.lon,
          distance: f.properties.distance,
        }),
      )
      return res.status(200).json({ mode: 'live', results })
    }

    return res.status(400).json({ error: 'type invalide' })
  } catch {
    if (type === 'autocomplete') {
      const text = String(req.query.text ?? '').toLowerCase()
      const results = FALLBACK_CITIES.filter((c) =>
        c.formatted.toLowerCase().includes(text),
      ).slice(0, 6)
      return res.status(200).json({ mode: 'fallback', results })
    }
    return res.status(200).json({ mode: 'fallback', results: [] })
  }
}
