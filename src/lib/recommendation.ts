import { DESTINATIONS, findDestinationByLabel } from '../data/destinations'
import { BUDGET_OPTIONS } from '../data/questionnaire'
import type {
  ClimatePref,
  ClimateType,
  CustomDestinationResult,
  Destination,
  DistanceBand,
  Pace,
  RegionId,
  RegionPref,
  ScoredDestination,
  TravelProfile,
} from '../types/trip'

/**
 * Pondération TribTravel (total 100 %) :
 * envies 20 · activités 15 · budget 12 · saison 10 · climat 10 ·
 * région 10 · distance 8 · groupe 5 · rythme 4 · transports 3 · confort 3
 */
const WEIGHTS = {
  themes: 0.2,
  activities: 0.15,
  budget: 0.12,
  season: 0.1,
  climate: 0.1,
  region: 0.1,
  distance: 0.08,
  group: 0.05,
  pace: 0.04,
  transport: 0.03,
  comfort: 0.03,
} as const

const CLIMATE_MAP: Record<Exclude<ClimatePref, 'indifferent'>, ClimateType[]> = {
  chaud: ['tropical', 'mediterraneen', 'desertique'],
  tempere: ['tempere', 'mediterraneen'],
  frais: ['froid', 'tempere'],
}

const REGION_MAP: Record<Exclude<RegionPref, 'ouvert'>, RegionId[]> = {
  europe: ['europe'],
  mediterranee: ['mediterranee', 'europe'],
  'afrique-mo': ['afrique-mo'],
  asie: ['asie'],
  ameriques: ['ameriques'],
  iles: ['iles'],
}

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
  const travelers = Math.max(1, profile.travelers.adults + profile.travelers.children * 0.7)
  const days =
    profile.dates.departure && profile.dates.return
      ? Math.max(
          3,
          Math.round(
            (new Date(profile.dates.return).getTime() -
              new Date(profile.dates.departure).getTime()) /
              86400000,
          ) + 1,
        )
      : 8
  const estimated = dest.approximateCostIndex * 55 * days * travelers
  const ratio = option.mid / estimated
  if (ratio >= 0.9 && ratio <= 1.35) return 96
  if (ratio >= 0.75 && ratio < 0.9) return 78
  if (ratio > 1.35 && ratio <= 2) return 82
  if (ratio < 0.75 && ratio >= 0.55) return 55
  if (ratio < 0.55) return 35
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
  return adjacent ? 72 : 38
}

function climateFit(profile: TravelProfile, dest: Destination): number {
  const pref = profile.climatePreference
  if (!pref || pref === 'indifferent') return 75
  return CLIMATE_MAP[pref].includes(dest.climate) ? 95 : 35
}

function regionFit(profile: TravelProfile, dest: Destination): number {
  const prefs = profile.regionPreferences
  if (!prefs.length || prefs.includes('ouvert')) return 75
  for (const p of prefs) {
    if (p === 'ouvert') continue
    if (REGION_MAP[p]?.includes(dest.region)) return 95
  }
  return 30
}

function distanceFit(profile: TravelProfile, dest: Destination): number {
  const pref = profile.distancePreference
  if (!pref || pref === 'ouvert') {
    if (profile.constraints.includes('longs-trajets') || profile.constraints.includes('jetlag')) {
      return dest.distanceBand === 'proche' ? 95 : dest.distanceBand === 'moyen' ? 60 : 25
    }
    return 75
  }
  const order: DistanceBand[] = ['proche', 'moyen', 'loin']
  const want = pref as DistanceBand
  if (dest.distanceBand === want) return 95
  const gap = Math.abs(order.indexOf(dest.distanceBand) - order.indexOf(want))
  return gap === 1 ? 55 : 25
}

function groupFit(profile: TravelProfile, dest: Destination): number {
  const hasChildren = profile.travelers.children > 0
  if (hasChildren || profile.constraints.includes('jeunes-enfants')) {
    if (!dest.familyFriendly) return 15
    return profile.activities.includes('famille') ? 96 : 88
  }
  return dest.familyFriendly ? 72 : 82
}

function paceFit(profile: TravelProfile, dest: Destination): number {
  if (!profile.pace) return 70
  return dest.paceCompatibility.includes(profile.pace as Pace) ? 95 : 38
}

function transportFit(profile: TravelProfile, dest: Destination): number {
  const prefs = profile.transportPreferences
  if (prefs.length === 0 || prefs.includes('ouvert')) return 80
  if (prefs.some((p) => dest.transportProfiles.includes(p) || p === 'mix')) return 90
  return 48
}

function comfortFit(profile: TravelProfile, dest: Destination): number {
  if (!profile.comfortLevel) return 70
  return dest.comfortLevels.includes(profile.comfortLevel) ? 92 : 50
}

/** Pénalités liées aux contraintes explicites. */
function constraintPenalty(profile: TravelProfile, dest: Destination): number {
  let penalty = 0
  if (profile.constraints.includes('longs-trajets') && dest.distanceBand === 'loin') penalty += 12
  if (profile.constraints.includes('jetlag') && dest.distanceBand === 'loin') penalty += 10
  if (profile.constraints.includes('physique') && dest.themes.includes('aventure')) penalty += 8
  if (profile.constraints.includes('physique') && dest.paceCompatibility.includes('intense')) {
    penalty += 6
  }
  if (profile.constraints.includes('mobilite') && dest.offbeat) penalty += 6
  return penalty
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

  for (const t of profile.themes.filter((th) => dest.themes.includes(th as never)).slice(0, 2)) {
    reasons.push({
      title: themeLabels[t] ?? t,
      detail: `Vous avez placé « ${themeLabels[t] ?? t} » parmi vos priorités.`,
    })
  }

  if (parts.climate >= 85 && profile.climatePreference && profile.climatePreference !== 'indifferent') {
    reasons.push({
      title: 'Climat',
      detail: 'Le climat de cette destination correspond à l’ambiance recherchée.',
    })
  }

  if (parts.region >= 85 && profile.regionPreferences.length && !profile.regionPreferences.includes('ouvert')) {
    reasons.push({
      title: 'Horizon',
      detail: 'Elle se situe dans la zone géographique que vous avez privilégiée.',
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

  if (parts.budget >= 75) {
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
 * Calcule un score de compatibilité sur 100 pour une destination.
 */
export function scoreDestination(profile: TravelProfile, dest: Destination): ScoredDestination {
  const parts = {
    themes: overlapRatio(profile.themes, dest.themes) * 100,
    activities: overlapRatio(profile.activities, dest.activities) * 100,
    budget: budgetFit(profile, dest),
    season: seasonFit(profile, dest),
    climate: climateFit(profile, dest),
    region: regionFit(profile, dest),
    distance: distanceFit(profile, dest),
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
    parts.climate * WEIGHTS.climate +
    parts.region * WEIGHTS.region +
    parts.distance * WEIGHTS.distance +
    parts.group * WEIGHTS.group +
    parts.pace * WEIGHTS.pace +
    parts.transport * WEIGHTS.transport +
    parts.comfort * WEIGHTS.comfort

  const penalty = constraintPenalty(profile, dest)
  const score = clampScore(Math.min(96, raw - penalty))

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
    return {
      primary: scored,
      alternatives: alternatives
        .filter((a) => a.destination.id !== fromCatalog.id)
        .slice(0, 2),
    }
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
      {
        title: 'Votre choix',
        detail: 'Vous avez indiqué cette destination : on respecte votre cap.',
      },
      {
        title: 'Personnalisation',
        detail: 'Le road book s’appuie sur vos envies, votre rythme et votre budget.',
      },
    ],
    badge: 'Voyage personnalisé',
  }

  return { primary: custom, alternatives }
}
