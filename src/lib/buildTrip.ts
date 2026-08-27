import { DESTINATIONS } from '../data/destinations'
import { fetchDestinationPhoto } from './api'
import { estimateBudget } from './budget'
import { fetchNearbyPlaces, haversineKm, suggestTransportMode } from './geo'
import { recommendDestinations, resolveKnownDestination, scoreDestination } from './recommendation'
import { buildRoadBook, buildTagline, computeDurationDays } from './roadbook'
import { fetchWeather } from './weather'
import type {
  AccommodationItem,
  CustomDestinationResult,
  Destination,
  PoiItem,
  ScoredDestination,
  TravelProfile,
  TripResult,
} from '../types/trip'

function isScored(
  value: ScoredDestination | CustomDestinationResult,
): value is ScoredDestination {
  return value.score !== null
}

function asDestinationMeta(dest: ScoredDestination['destination'] | CustomDestinationResult['destination']) {
  const full = DESTINATIONS.find((d) => d.id === dest.id)
  return {
    city: dest.city,
    country: dest.country,
    highlights: 'highlights' in dest ? dest.highlights : [],
    fallbackExperiences: full?.fallbackExperiences ?? [],
    themes: 'themes' in dest ? dest.themes : [],
    fallbackImage:
      'fallbackImage' in dest && dest.fallbackImage
        ? dest.fallbackImage
        : full?.fallbackImage ??
          'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80',
    fallbackAccommodations: full?.fallbackAccommodations ?? [
      'Hôtel confortable en centre-ville',
      'Appartement bien situé',
      'Adresse calme recommandée',
    ],
    approximateCostIndex: ('approximateCostIndex' in dest
      ? dest.approximateCostIndex
      : full?.approximateCostIndex ?? 3) as 1 | 2 | 3 | 4 | 5,
    summary:
      'summary' in dest && typeof dest.summary === 'string'
        ? dest.summary
        : full?.summary ?? `Cap sur ${dest.city}.`,
  }
}

function categoriesForProfile(profile: TravelProfile): string {
  if (profile.themes.includes('culture') || profile.activities.includes('musees')) {
    return 'tourism.sights,entertainment.museum,heritage'
  }
  if (profile.themes.includes('nature') || profile.activities.includes('randonnee')) {
    return 'natural,tourism.attraction,leisure.park'
  }
  if (profile.travelers.children > 0 || profile.activities.includes('famille')) {
    return 'entertainment,leisure.park,tourism.attraction'
  }
  if (profile.themes.includes('gastronomie')) {
    return 'catering.restaurant,tourism.sights'
  }
  return 'tourism.sights,entertainment,leisure'
}

/**
 * Assemble le résultat complet du voyage (scoring + APIs + fallbacks).
 */
export async function buildTripResult(
  profile: TravelProfile,
  preferredDestinationId?: string,
): Promise<TripResult> {
  const durationDays = computeDurationDays(profile)
  let primary: ScoredDestination | CustomDestinationResult
  let alternatives: ScoredDestination[]

  if (preferredDestinationId) {
    const dest = DESTINATIONS.find((d) => d.id === preferredDestinationId)
    if (dest) {
      primary = scoreDestination(profile, dest)
      alternatives = DESTINATIONS.filter((d) => d.id !== dest.id)
        .map((d) => scoreDestination(profile, d))
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
    } else {
      const rec = recommendDestinations(profile)
      primary = rec.primary
      alternatives = rec.alternatives
    }
  } else if (profile.destinationMode === 'known' && profile.destination?.label) {
    const resolved = resolveKnownDestination(profile)
    primary = resolved.primary
    alternatives = resolved.alternatives
  } else {
    const rec = recommendDestinations(profile)
    primary = rec.primary
    alternatives = rec.alternatives
  }

  const dest = primary.destination
  const meta = asDestinationMeta(dest)
  const lat = dest.lat || profile.destination?.lat || 0
  const lng = dest.lng || profile.destination?.lng || 0
  const isCustom = !isScored(primary)

  const [weather, photo, places, hotels] = await Promise.all([
    lat && lng
      ? fetchWeather(lat, lng, profile.dates.departure)
      : Promise.resolve({
          mode: 'fallback' as const,
          description: 'Météo indisponible',
          isForecast: false,
          attribution: 'Données météo : Open-Meteo.com',
        }),
    fetchDestinationPhoto(
      `${dest.city} ${dest.country} travel landscape`,
      `${dest.city}, ${dest.country}`,
      meta.fallbackImage,
    ),
    lat && lng
      ? fetchNearbyPlaces(lat, lng, categoriesForProfile(profile), 6)
      : Promise.resolve({ items: [], mode: 'fallback' as const }),
    lat && lng
      ? fetchNearbyPlaces(lat, lng, 'accommodation.hotel,accommodation', 3)
      : Promise.resolve({ items: [], mode: 'fallback' as const }),
  ])

  let accommodations: AccommodationItem[] = hotels.items.map((h) => ({
    ...h,
    type: 'Hébergement',
    mode: hotels.mode,
  }))

  if (accommodations.length === 0) {
    accommodations = meta.fallbackAccommodations.slice(0, 3).map((name, i) => ({
      id: `fb-acc-${i}`,
      name,
      type: 'Suggestion TribTravel',
      mode: 'fallback' as const,
    }))
  }

  let experiences: PoiItem[] = places.items.map((p) => ({
    ...p,
    mode: places.mode,
  }))

  if (experiences.length === 0) {
    experiences = meta.fallbackExperiences.map((e, i) => ({
      id: `fb-exp-${i}`,
      name: e.title,
      category: 'Suggestion TribTravel',
      address: e.description,
      mode: 'fallback' as const,
    }))
  }

  const budget = estimateBudget(profile, meta.approximateCostIndex, durationDays)

  const originLat = profile.origin.lat
  const originLng = profile.origin.lng
  let distanceKm: number | undefined
  let transportMode = 'Avion'
  if (originLat != null && originLng != null && lat && lng) {
    distanceKm = haversineKm(originLat, originLng, lat, lng)
    transportMode = suggestTransportMode(distanceKm, profile.transportPreferences)
  } else if (profile.transportPreferences.includes('avion')) {
    transportMode = 'Avion'
  }

  const originLabel = profile.origin.label?.split(',')[0] ?? 'votre ville'
  const roadBook = buildRoadBook(
    profile,
    {
      city: dest.city,
      country: dest.country,
      highlights: meta.highlights,
      fallbackExperiences: meta.fallbackExperiences,
      themes: meta.themes as Destination['themes'],
    },
    experiences.map((e) => e.name),
  )

  const tagline = buildTagline(profile, dest.country || dest.city, meta.summary)
  const why =
    primary.reasons.length > 0
      ? primary.reasons
      : [{ title: 'Personnalisation', detail: 'Construit à partir de vos réponses.' }]

  return {
    profile,
    primary,
    alternatives,
    budget,
    weather,
    photo,
    alternativePhotos: alternatives.map((alt) => ({
      url: alt.destination.fallbackImage,
      mode: 'fallback' as const,
      alt: `${alt.destination.city}, ${alt.destination.country}`,
    })),
    accommodations,
    experiences,
    roadBook,
    transport: {
      mode: transportMode,
      route: `${transportMode} recommandé · ${originLabel} → ${dest.city}`,
      distanceKm,
      note: 'Les horaires et tarifs seraient vérifiés lors de la réservation.',
    },
    copy: {
      headline: `Cap sur ${dest.country || dest.city}`,
      tagline,
      why,
    },
    durationDays,
    isCustomDestination: isCustom,
  }
}
