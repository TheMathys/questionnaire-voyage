import { STORAGE_KEY } from '../data/questionnaire'
import type { TravelProfile } from '../types/trip'

export const defaultProfile = (): TravelProfile => ({
  travelers: { adults: 2, children: 0, childrenAges: [] },
  origin: { label: '' },
  dates: { flexibility: 'fixed' },
  destinationMode: 'inspire',
  themes: [],
  pace: '',
  transportPreferences: [],
  accommodationTypes: [],
  comfortLevel: '',
  activities: [],
  constraints: [],
  budgetRange: '',
  priorities: [],
})

export function loadStoredProfile(): TravelProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProfile()
    return { ...defaultProfile(), ...JSON.parse(raw) }
  } catch {
    return defaultProfile()
  }
}

export function validateStep(step: number, profile: TravelProfile): string | null {
  switch (step) {
    case 0:
      if (profile.travelers.adults + profile.travelers.children < 1) {
        return 'Ajoutez au moins un voyageur.'
      }
      return null
    case 1:
      if (!profile.origin.label.trim()) return 'Indiquez votre ville de départ.'
      if (!profile.dates.departure || !profile.dates.return) {
        return 'Choisissez vos dates de départ et de retour.'
      }
      if (new Date(profile.dates.return) < new Date(profile.dates.departure)) {
        return 'La date de retour doit être après le départ.'
      }
      return null
    case 2:
      if (profile.destinationMode === 'known' && !profile.destination?.label?.trim()) {
        return 'Indiquez une destination ou choisissez « Inspirez-moi ».'
      }
      return null
    case 3:
      if (profile.themes.length === 0) return 'Sélectionnez au moins une envie.'
      return null
    case 4:
      if (!profile.pace) return 'Choisissez votre rythme de voyage.'
      return null
    case 5:
      if (profile.transportPreferences.length === 0) {
        return 'Sélectionnez au moins un mode de déplacement.'
      }
      return null
    case 6:
      if (profile.accommodationTypes.length === 0) return 'Choisissez un type d’hébergement.'
      if (!profile.comfortLevel) return 'Indiquez votre niveau de confort.'
      return null
    case 7:
      if (profile.activities.length === 0) return 'Sélectionnez au moins une expérience.'
      return null
    case 8:
      if (profile.constraints.length === 0) return 'Indiquez vos contraintes ou « Aucune ».'
      return null
    case 9:
      if (!profile.budgetRange) return 'Choisissez une enveloppe budgétaire.'
      return null
    default:
      return null
  }
}

export function getDemoProfile(): TravelProfile {
  return {
    travelers: { adults: 2, children: 0, childrenAges: [] },
    origin: {
      label: 'Paris, France',
      lat: 48.8566,
      lng: 2.3522,
      city: 'Paris',
      country: 'France',
    },
    dates: {
      departure: new Date(Date.now() + 40 * 86400000).toISOString().slice(0, 10),
      return: new Date(Date.now() + 50 * 86400000).toISOString().slice(0, 10),
      flexibility: '2-days',
    },
    destinationMode: 'inspire',
    themes: ['nature', 'aventure', 'plage'],
    pace: 'equilibre',
    transportPreferences: ['avion'],
    accommodationTypes: ['hotel', 'ecolodge'],
    comfortLevel: 'confortable',
    activities: ['randonnee', 'plage', 'sport'],
    constraints: ['aucune'],
    budgetRange: '4000-6000',
    priorities: ['hebergement', 'activites', 'experiences'],
    idealTrip: 'Nature, aventure et plages, sans trop de stress.',
  }
}
