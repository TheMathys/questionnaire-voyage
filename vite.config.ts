import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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

function localApiPlugin(): Plugin {
  return {
    name: 'tribtravel-local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next()

        const url = new URL(req.url, 'http://localhost')
        res.setHeader('Content-Type', 'application/json')

        try {
          if (url.pathname === '/api/geoapify') {
            const type = url.searchParams.get('type') ?? 'autocomplete'
            const key = process.env.GEOAPIFY_API_KEY

            if (type === 'autocomplete') {
              const text = url.searchParams.get('text') ?? ''
              if (!key) {
                const results = FALLBACK_CITIES.filter((c) =>
                  c.formatted.toLowerCase().includes(text.toLowerCase()),
                ).slice(0, 6)
                res.end(JSON.stringify({ mode: 'fallback', results }))
                return
              }
              if (text.length < 3) {
                res.end(JSON.stringify({ mode: 'live', results: [] }))
                return
              }
              const apiUrl = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&limit=6&lang=fr&apiKey=${key}`
              const response = await fetch(apiUrl)
              const data = (await response.json()) as {
                features?: Array<{
                  properties: {
                    formatted: string
                    lat: number
                    lon: number
                    city?: string
                    country?: string
                  }
                }>
              }
              const results = (data.features ?? []).map((f) => ({
                formatted: f.properties.formatted,
                lat: f.properties.lat,
                lon: f.properties.lon,
                city: f.properties.city,
                country: f.properties.country,
              }))
              res.end(JSON.stringify({ mode: 'live', results }))
              return
            }

            if (type === 'places') {
              if (!key) {
                res.end(JSON.stringify({ mode: 'fallback', results: [] }))
                return
              }
              const lat = url.searchParams.get('lat')
              const lng = url.searchParams.get('lng')
              const categories = url.searchParams.get('categories') ?? 'tourism.sights'
              const limit = url.searchParams.get('limit') ?? '6'
              const apiUrl = `https://api.geoapify.com/v2/places?categories=${encodeURIComponent(categories)}&filter=circle:${lng},${lat},5000&bias=proximity:${lng},${lat}&limit=${limit}&lang=fr&apiKey=${key}`
              const response = await fetch(apiUrl)
              const data = (await response.json()) as {
                features?: Array<{
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
                }>
              }
              const results = (data.features ?? []).map(
                (f, i) => ({
                id: f.properties.place_id ?? `poi-${i}`,
                name: f.properties.name ?? f.properties.address_line1 ?? 'Lieu d’intérêt',
                category: f.properties.categories?.[0] ?? categories,
                address: f.properties.formatted ?? f.properties.address_line1,
                lat: f.properties.lat,
                lng: f.properties.lon,
                distance: f.properties.distance,
              }))
              res.end(JSON.stringify({ mode: 'live', results }))
              return
            }
          }

          if (url.pathname === '/api/pexels') {
            const key = process.env.PEXELS_API_KEY
            const query = url.searchParams.get('query') ?? 'travel landscape'
            if (!key) {
              res.end(JSON.stringify({ mode: 'fallback', photo: null }))
              return
            }
            const response = await fetch(
              `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
              { headers: { Authorization: key } },
            )
            const data = (await response.json()) as {
              photos?: Array<{
                src?: { large2x?: string; large?: string }
                photographer?: string
                photographer_url?: string
                url?: string
              }>
            }
            const photo = data.photos?.[0]
            if (!photo) {
              res.end(JSON.stringify({ mode: 'fallback', photo: null }))
              return
            }
            res.end(
              JSON.stringify({
                mode: 'live',
                photo: {
                  url: photo.src?.large2x ?? photo.src?.large,
                  photographer: photo.photographer,
                  photographerUrl: photo.photographer_url,
                  sourceUrl: photo.url,
                },
              }),
            )
            return
          }

          res.statusCode = 404
          res.end(JSON.stringify({ error: 'not found' }))
        } catch {
          res.statusCode = 200
          res.end(JSON.stringify({ mode: 'fallback', results: [], photo: null }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localApiPlugin()],
})
