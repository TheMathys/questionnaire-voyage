import { DESTINATIONS, findDestinationByLabel } from '../data/destinations'
import { BUDGET_OPTIONS } from '../data/questionnaire'
import type {
  CustomDestinationResult,
  Destination,
  Pace,
  ScoredDestination,
  TravelProfile,
} from '../types/trip'

const WEIGHTS = {
  themes: 0.25,
  activities: 0.2,
  budget: 0.15,
  season: 0.15,
  group: 0.1,
  pace: 0.05,
  transport: 0.05,
  comfort: 0.05,
} as const

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function overlapRatio(selected: string[], available: string[]): number {
  if (selected.length === 0) return 0.5
  const hits = selected.filter((s) => available.includes(s)).length
  return hits / selected.length
}

function budgetFit(profile: TravelProfile, dest: Destination): number {
  const option = BUDGET_OPTIONS.find((b) => b.id === profile.budgetRange)
  if (!option || profile.budgetRange === 'unknown') return 70
  const mid = option.mid
  const estimated = dest.approximateCostIndex * 900
  const ratio = mid / estimated
  if (ratio >= 0.85 && ratio <= 1.4) return 95
  if (ratio >= 0.7 && ratio < 0.85) return 75
  if (ratio > 1.4 && ratio <= 2) return 80
  if (ratio < 0.7) return 45
  return 60
}

function seasonFit(profile: TravelProfile, dest: Destination): number {
  const date = profile.dates.departure
  if (!date) return 70
  const month = new Date(date).getMonth() + 1
  if (dest.preferredSeasons.includes(month)) return 95
  const adjacent = dest.preferredSeasons.some(
    (m) => Math.abs(m - month) === 1 || Math.abs(m - month) === 11,
  )
  return adjacent ? 75 : 45
}

function groupFit(profile: TravelProfile, dest: Destination): number {
  const hasChildren = profile.travelers.children > 0
  if (hasChildren) {
    if (!dest.familyFriendly) return 25
    if (profile.activities.includes('famille') || profile.constraints.includes('jeunes-enfants')) {
      return dest.familyFriendly ? 95 : 20
    }
    return 85
  }
  return dest.familyFriendly ? 75 : 80
}

function paceFit(profile: TravelProfile, dest: Destination): number {
  if (!profile.pace) return 70
  return dest.paceCompatibility.includes(profile.pace as Pace) ? 95 : 40
}

function transportFit(profile: TravelProfile, dest: Destination): number {
  const prefs = profile.transportPreferences
  if (prefs.length === 0 || prefs.includes('ouvert')) return 80
  const hits = prefs.filter((p) => dest.transportProfiles.includes(p) || p === 'mix').length
  if (hits > 0) return 90
  if (prefs.includes('avion') && dest.transportProfiles.includes('avion')) return 90
  return 50
}

function comfortFit(profile: TravelProfile, dest: Destination): number {
  if (!profile.comfortLevel) return 70
  return dest.comfortLevels.includes(profile.comfortLevel) ? 92 : 55
}

function buildReasons(
  profile: TravelProfile,
  dest: Destination,
  parts: Record<string, number>,
): { title: string; detail: string }[] {
  const reasons: { title: string; detail: string }[] = []
  const themeLabels: Record<string, string> = {
    nature: 'Nature',
    aventure: 'Aventure',
    plage: 'Plage',
    culture: 'Culture',
    gastronomie: 'Gastronomie',
    detente: 'Détente',
    sport: 'Sport',
    roadtrip: 'Road trip',
    luxe: 'Bien-être',
    immersion: 'Immersion',
  }

  const matchedThemes = profile.themes.filter((t) => dest.themes.includes(t as never))
  for (const t of matchedThemes.slice(0, 2)) {
    reasons.push({
      title: themeLabels[t] ?? t,
      detail: `Vous avez placé « ${themeLabels[t] ?? t} » parmi vos priorités.`,
    })
  }

  if (parts.pace >= 80 && profile.pace) {
    const paceText: Record<string, string> = {
      doux: 'un rythme tout en douceur',
      equilibre: 'un rythme équilibré',
      intense: 'un rythme dynamique',
      itinerant: 'un itinéraire en plusieurs étapes',
    }
    reasons.push({
      title: 'Rythme',
      detail: `Cette destination se prête bien à ${paceText[profile.pace]}.`,
    })
  }

  if (parts.budget >= 70) {
    reasons.push({
      title: 'Budget',
      detail: 'Cette proposition reste cohérente avec l’enveloppe indiquée.',
    })
  } else if (parts.budget < 55) {
    reasons.push({
      title: 'Budget',
      detail: 'Le budget est un peu juste : TribTravel privilégierait certains postes.',
    })
  }

  if (profile.travelers.children > 0 && dest.familyFriendly) {
    reasons.push({
      title: 'Tribu',
      detail: 'Destination particulièrement adaptée aux familles.',
    })
  }

  if (reasons.length < 2) {
    reasons.push({
      title: 'Ambiance',
      detail: dest.highlights[0]
        ? `${dest.highlights[0]} correspond à l’esprit de votre voyage.`
        : dest.summary,
    })
  }

  return reasons.slice(0, 4)
}

/**
 * Calcule un score de compatibilité sur 100 pour une destination,
 * selon la pondération TribTravel (envies, activités, budget, saison, groupe, rythme, transports, confort).
 */
export function scoreDestination(profile: TravelProfile, dest: Destination): ScoredDestination {
  const parts = {
    themes: overlapRatio(profile.themes, dest.themes) * 100,
    activities: overlapRatio(profile.activities, dest.activities) * 100,
    budget: budgetFit(profile, dest),
    season: seasonFit(profile, dest),
    group: groupFit(profile, dest),
    pace: paceFit(profile, dest),
    transport: transportFit(profile, dest),
    comfort: comfortFit(profile, dest),
  }

  const raw =
    parts.themes * WEIGHTS.themes +
    parts.activities * WEIGHTS.activities +
    parts.budget * WEIGHTS.budget +
    parts.season * WEIGHTS.season +
    parts.group * WEIGHTS.group +
    parts.pace * WEIGHTS.pace +
    parts.transport * WEIGHTS.transport +
    parts.comfort * WEIGHTS.comfort

  // Cap réaliste : jamais 98/99 arbitraires
  const score = clampScore(Math.min(96, raw))

  return {
    destination: dest,
    score,
    reasons: buildReasons(profile, dest, parts),
  }
}

export function recommendDestinations(profile: TravelProfile): {
  primary: ScoredDestination
  alternatives: ScoredDestination[]
} {
  const scored = DESTINATIONS.map((d) => scoreDestination(profile, d)).sort(
    (a, b) => b.score - a.score,
  )

  return {
    primary: scored[0],
    alternatives: scored.slice(1, 3),
  }
}

export function resolveKnownDestination(profile: TravelProfile): {
  primary: ScoredDestination | CustomDestinationResult
  alternatives: ScoredDestination[]
} {
  const label = profile.destination?.label ?? ''
  const fromCatalog = findDestinationByLabel(label)
  const alternatives = recommendDestinations(profile).alternatives

  if (fromCatalog) {
    const scored = scoreDestination(profile, fromCatalog)
    return { primary: scored, alternatives: alternatives.filter((a) => a.destination.id !== fromCatalog.id).slice(0, 2) }
  }

  const custom: CustomDestinationResult = {
    destination: {
      id: 'custom',
      city: profile.destination?.city ?? label.split(',')[0]?.trim() ?? label,
      country: profile.destination?.country ?? '',
      lat: profile.destination?.lat ?? 0,
      lng: profile.destination?.lng ?? 0,
      summary: `Un voyage sur mesure vers ${label}, imaginé à partir de vos envies.`,
      highlights: profile.themes.slice(0, 3),
      fallbackImage:
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80',
      themes: profile.themes as never[],
      activities: profile.activities as never[],
      approximateCostIndex: 3,
    },
    score: null,
    reasons: [
      { title: 'Votre choix', detail: 'Vous avez indiqué cette destination : on respecte votre cap.' },
      {
        title: 'Personnalisation',
        detail: 'Le road book s’appuie sur vos envies, votre rythme et votre budget.',
      },
    ],
    badge: 'Voyage personnalisé',
  }

  return { primary: custom, alternatives }
}
