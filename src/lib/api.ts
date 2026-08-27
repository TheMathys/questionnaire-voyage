import type { PhotoAsset } from '../types/trip'

export async function fetchDestinationPhoto(
  query: string,
  alt: string,
  fallbackUrl: string,
): Promise<PhotoAsset> {
  try {
    const res = await fetch(`/api/pexels?query=${encodeURIComponent(query)}`)
    if (!res.ok) throw new Error('pexels')
    const data = await res.json()
    if (data.mode === 'live' && data.photo?.url) {
      return {
        url: data.photo.url,
        photographer: data.photo.photographer,
        photographerUrl: data.photo.photographerUrl,
        sourceUrl: data.photo.sourceUrl,
        mode: 'live',
        alt,
      }
    }
  } catch {
    // fallback below
  }

  return {
    url: fallbackUrl,
    mode: 'fallback',
    alt,
  }
}
