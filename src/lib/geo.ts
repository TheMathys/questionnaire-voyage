/** Distance approximative en km (formule de Haversine). */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

export function suggestTransportMode(
  distanceKm: number,
  preferences: string[],
): string {
  if (preferences.includes('avion') || distanceKm > 800) return 'Avion'
  if (preferences.includes('train') && distanceKm <= 1200) return 'Train'
  if (preferences.includes('voiture') && distanceKm <= 900) return 'Voiture / location'
  if (preferences.includes('bateau')) return 'Bateau'
  if (distanceKm > 600) return 'Avion'
  if (distanceKm > 250) return 'Train'
  return 'Voiture / transports'
}

export interface GeoSuggestion {
  label: string
  lat: number
  lng: number
  city?: string
  country?: string
}

const cache = new Map<string, GeoSuggestion[]>()

export async function autocompletePlace(query: string): Promise<{
  results: GeoSuggestion[]
  mode: 'live' | 'fallback'
}> {
  const q = query.trim()
  if (q.length < 3) return { results: [], mode: 'fallback' }

  const key = q.toLowerCase()
  if (cache.has(key)) return { results: cache.get(key)!, mode: 'live' }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)
    const res = await fetch(`/api/geoapify?type=autocomplete&text=${encodeURIComponent(q)}`, {
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) throw new Error('geo')
    const data = await res.json()
    const results: GeoSuggestion[] = (data.results ?? []).map(
      (r: {
        formatted: string
        lat: number
        lon: number
        city?: string
        country?: string
      }) => ({
        label: r.formatted,
        lat: r.lat,
        lng: r.lon,
        city: r.city,
        country: r.country,
      }),
    )
    cache.set(key, results)
    return { results, mode: data.mode === 'live' ? 'live' : 'fallback' }
  } catch {
    return { results: fallbackCities(q), mode: 'fallback' }
  }
}

function fallbackCities(q: string): GeoSuggestion[] {
  const cities: GeoSuggestion[] = [
    { label: 'Paris, France', lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France' },
    { label: 'Lyon, France', lat: 45.764, lng: 4.8357, city: 'Lyon', country: 'France' },
    { label: 'Marseille, France', lat: 43.2965, lng: 5.3698, city: 'Marseille', country: 'France' },
    { label: 'Bordeaux, France', lat: 44.8378, lng: -0.5792, city: 'Bordeaux', country: 'France' },
    { label: 'Toulouse, France', lat: 43.6047, lng: 1.4442, city: 'Toulouse', country: 'France' },
    { label: 'Nantes, France', lat: 47.2184, lng: -1.5536, city: 'Nantes', country: 'France' },
    { label: 'Lille, France', lat: 50.6292, lng: 3.0573, city: 'Lille', country: 'France' },
    { label: 'Bruxelles, Belgique', lat: 50.8503, lng: 4.3517, city: 'Bruxelles', country: 'Belgique' },
    { label: 'Genève, Suisse', lat: 46.2044, lng: 6.1432, city: 'Genève', country: 'Suisse' },
    { label: 'Nice, France', lat: 43.7102, lng: 7.262, city: 'Nice', country: 'France' },
  ]
  const n = q.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
  return cities.filter((c) =>
    c.label
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .includes(n),
  )
}

export async function fetchNearbyPlaces(
  lat: number,
  lng: number,
  categories: string,
  limit = 6,
): Promise<{ items: Array<{ id: string; name: string; category: string; address?: string; lat?: number; lng?: number; distance?: number }>; mode: 'live' | 'fallback' }> {
  try {
    const res = await fetch(
      `/api/geoapify?type=places&lat=${lat}&lng=${lng}&categories=${encodeURIComponent(categories)}&limit=${limit}`,
    )
    if (!res.ok) throw new Error('places')
    const data = await res.json()
    return {
      items: data.results ?? [],
      mode: data.mode === 'live' ? 'live' : 'fallback',
    }
  } catch {
    return { items: [], mode: 'fallback' }
  }
}
