import type {
  Destination,
  Pace,
  RoadBookDay,
  TravelProfile,
} from '../types/trip'

function dayCount(profile: TravelProfile): number {
  if (profile.dates.departure && profile.dates.return) {
    const a = new Date(profile.dates.departure)
    const b = new Date(profile.dates.return)
    const days = Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return Math.max(3, Math.min(days, 21))
  }
  return 8
}

export function computeDurationDays(profile: TravelProfile): number {
  return dayCount(profile)
}

/**
 * Construit un mini road book éditorial à partir du profil, des tags destination et des POI.
 */
export function buildRoadBook(
  profile: TravelProfile,
  dest: Pick<Destination, 'city' | 'country' | 'highlights' | 'fallbackExperiences' | 'themes'>,
  poiNames: string[],
): RoadBookDay[] {
  const days = dayCount(profile)
  const pace = profile.pace as Pace | ''
  const experiences = dest.fallbackExperiences
  const dream = profile.dreamExperience?.trim()

  const templates: RoadBookDay[] = [
    {
      day: 1,
      title: `Premiers pas à ${dest.city}`,
      summary: 'Arrivée, installation et découverte du quartier pour prendre vos marques.',
      slots: [
        { period: 'Matin', text: 'Arrivée et transfert vers votre hébergement.' },
        { period: 'Après-midi', text: 'Balade légère autour de votre quartier.' },
        { period: 'Soir', text: 'Dîner local pour goûter l’ambiance du lieu.' },
      ],
    },
    {
      day: 2,
      title: experiences[0]?.title ?? 'Direction la nature',
      summary:
        experiences[0]?.description ??
        'Une première expérience alignée avec vos envies principales.',
      slots: [
        {
          period: 'Matin',
          text: poiNames[0]
            ? `Visite de ${poiNames[0]}.`
            : experiences[0]?.description ?? 'Exploration du site phare.',
        },
        {
          period: 'Midi',
          text: profile.themes.includes('gastronomie')
            ? 'Pause gourmande dans une adresse recommandée.'
            : 'Déjeuner sur place.',
        },
        {
          period: 'Après-midi',
          text:
            pace === 'doux'
              ? 'Temps libre pour profiter sans précipitation.'
              : experiences[1]?.description ?? 'Poursuite des découvertes.',
        },
      ],
    },
    {
      day: 3,
      title: dream ? 'Une expérience à votre image' : experiences[1]?.title ?? 'Au cœur de la destination',
      summary: dream
        ? `Place à votre rêve : ${dream}`
        : experiences[1]?.description ?? 'Une journée construite autour de vos centres d’intérêt.',
      slots: [
        {
          period: 'Matin',
          text: dream
            ? `Préparation de l’expérience : ${dream}`
            : poiNames[1]
              ? `Découverte de ${poiNames[1]}.`
              : 'Activité phare de la journée.',
        },
        {
          period: 'Après-midi',
          text:
            pace === 'intense'
              ? 'Enchaînement d’une seconde expérience.'
              : 'Moment plus calme pour digérer les impressions.',
        },
        { period: 'Soir', text: 'Retour tranquille et dîner selon vos envies.' },
      ],
    },
  ]

  if (days >= 4) {
    templates.push({
      day: 4,
      title: experiences[2]?.title ?? dest.highlights[1] ?? 'Changement de décor',
      summary:
        pace === 'itinerant'
          ? 'Nouvelle étape pour varier les paysages.'
          : experiences[2]?.description ?? 'Journée thématique selon votre profil.',
      slots: [
        {
          period: 'Matin',
          text: poiNames[2] ? `Orientation vers ${poiNames[2]}.` : 'Départ vers un nouveau lieu.',
        },
        {
          period: 'Après-midi',
          text: profile.activities.includes('plage')
            ? 'Temps libre côté mer si la destination le permet.'
            : 'Exploration libre.',
        },
      ],
    })
  }

  if (days >= 5) {
    templates.push({
      day: 5,
      title: 'Immersion locale',
      summary: 'Prendre le pouls de la vie quotidienne et des saveurs du lieu.',
      slots: [
        {
          period: 'Matin',
          text: profile.activities.includes('vie-locale')
            ? 'Marché ou quartier authentique.'
            : 'Balade dans un quartier moins touristique.',
        },
        {
          period: 'Midi',
          text: 'Repas typique, éventuellement chez l’habitant ou en petite adresse.',
        },
        {
          period: 'Après-midi',
          text: profile.activities.includes('bien-etre')
            ? 'Parenthèse bien-être.'
            : 'Temps libre selon l’énergie du groupe.',
        },
      ],
    })
  }

  if (days >= 6) {
    templates.push({
      day: 6,
      title: experiences[3]?.title ?? dest.highlights[2] ?? 'Grand air',
      summary: experiences[3]?.description ?? 'Une journée outdoor ou culturelle selon vos tags.',
      slots: [
        {
          period: 'Matin',
          text: profile.activities.includes('randonnee')
            ? 'Randonnée adaptée à votre rythme.'
            : profile.activities.includes('musees')
              ? 'Visite patrimoniale.'
              : 'Expérience signature TribTravel.',
        },
        { period: 'Après-midi', text: 'Retour progressif et temps libre.' },
      ],
    })
  }

  if (days >= 7) {
    templates.push({
      day: 7,
      title: days > 7 ? 'Jours suivants — à votre rythme' : 'Derniers instants',
      summary:
        days > 7
          ? `Les jours ${7} à ${days} prolongent l’expérience : reprises des coups de cœur, détente, et petites surprises selon l’énergie de la tribu.`
          : 'Profitez d’une dernière belle journée avant le retour.',
      slots: [
        {
          period: 'Matin',
          text: days > 7 ? 'Itinéraire flexible selon vos envies du moment.' : 'Dernière balade souvenir.',
        },
        {
          period: 'Après-midi',
          text: days > 7 ? 'Alternance d’activités et de temps libre.' : 'Préparation du départ en douceur.',
        },
        ...(days === 7
          ? [{ period: 'Soir' as const, text: 'Dîner d’au revoir.' }]
          : []),
      ],
    })
  }

  if (days > 7) {
    templates.push({
      day: days,
      title: 'Retour',
      summary: 'Dernière matinée et transfert vers le départ.',
      slots: [
        { period: 'Matin', text: 'Petit-déjeuner et check-out.' },
        { period: 'Midi', text: 'Transfert et vol / trajet retour.' },
      ],
    })
  }

  return templates
}

export function buildTagline(
  profile: TravelProfile,
  destName: string,
  summary: string,
): string {
  const themes = profile.themes
  const bits: string[] = []
  if (themes.includes('nature')) bits.push('nature')
  if (themes.includes('aventure')) bits.push('aventure')
  if (themes.includes('plage')) bits.push('plages')
  if (themes.includes('culture')) bits.push('culture')
  if (themes.includes('gastronomie')) bits.push('gastronomie')
  if (themes.includes('detente')) bits.push('douceur')

  if (bits.length >= 2) {
    return `${bits.slice(0, 3).join(', ').replace(/^./, (c) => c.toUpperCase())} : ${destName} coche presque toutes les cases de votre tribu.`
  }
  return summary
}
