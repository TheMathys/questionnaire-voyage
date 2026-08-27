export type DateFlexibility = 'fixed' | '2-days' | '5-days' | 'very-flexible'
export type DestinationMode = 'known' | 'inspire'
export type Pace = 'doux' | 'equilibre' | 'intense' | 'itinerant'
export type ComfortLevel = 'essentiel' | 'confortable' | 'haut-de-gamme' | 'exceptionnel'
export type DataMode = 'live' | 'fallback'
export type ClimatePref = 'chaud' | 'tempere' | 'frais' | 'indifferent'
export type RegionPref =
  | 'europe'
  | 'mediterranee'
  | 'afrique-mo'
  | 'asie'
  | 'ameriques'
  | 'iles'
  | 'ouvert'
export type DistancePref = 'proche' | 'moyen' | 'loin' | 'ouvert'
export type ClimateType = 'tropical' | 'mediterraneen' | 'tempere' | 'froid' | 'desertique'
export type RegionId =
  | 'europe'
  | 'mediterranee'
  | 'afrique-mo'
  | 'asie'
  | 'ameriques'
  | 'iles'
export type DistanceBand = 'proche' | 'moyen' | 'loin'

export interface Travelers {
  adults: number
  children: number
  childrenAges: number[]
}

export interface GeoPlace {
  label: string
  lat?: number
  lng?: number
  city?: string
  country?: string
}

export interface TravelDates {
  departure?: string
  return?: string
  flexibility: DateFlexibility
}

export interface TravelProfile {
  travelers: Travelers
  origin: GeoPlace
  dates: TravelDates
  destinationMode: DestinationMode
  destination?: GeoPlace
  climatePreference: ClimatePref | ''
  regionPreferences: RegionPref[]
  distancePreference: DistancePref | ''
  themes: string[]
  pace: Pace | ''
  transportPreferences: string[]
  avoidTransport?: string
  accommodationTypes: string[]
  comfortLevel: ComfortLevel | ''
  activities: string[]
  dreamExperience?: string
  constraints: string[]
  constraintDetails?: string
  budgetRange: string
  priorities: string[]
  idealTrip?: string
}

export type ThemeId =
  | 'detente'
  | 'culture'
  | 'nature'
  | 'aventure'
  | 'gastronomie'
  | 'plage'
  | 'sport'
  | 'roadtrip'
  | 'luxe'
  | 'immersion'

export type ActivityId =
  | 'randonnee'
  | 'plage'
  | 'musees'
  | 'gastronomie'
  | 'sport'
  | 'excursions'
  | 'vie-locale'
  | 'insolite'
  | 'bien-etre'
  | 'famille'
  | 'nightlife'
  | 'photo'

export interface Destination {
  id: string
  city: string
  country: string
  lat: number
  lng: number
  themes: ThemeId[]
  activities: ActivityId[]
  paceCompatibility: Pace[]
  familyFriendly: boolean
  comfortLevels: ComfortLevel[]
  approximateCostIndex: 1 | 2 | 3 | 4 | 5
  preferredSeasons: number[]
  transportProfiles: string[]
  climate: ClimateType
  region: RegionId
  distanceBand: DistanceBand
  offbeat?: boolean
  summary: string
  highlights: string[]
  fallbackImage: string
  fallbackAccommodations: string[]
  fallbackExperiences: { title: string; description: string; period?: string }[]
  univers?: 'sportive' | 'culturelle' | 'familiale'
}

export interface ScoredDestination {
  destination: Destination
  score: number
  reasons: { title: string; detail: string }[]
}

export interface BudgetBreakdown {
  transport: number
  accommodation: number
  activities: number
  meals: number
  contingency: number
  total: number
  note?: string
  underBudget: boolean
}

export interface WeatherInfo {
  mode: DataMode
  temperature?: number
  temperatureMin?: number
  temperatureMax?: number
  weatherCode?: number
  windSpeed?: number
  description: string
  isForecast: boolean
  attribution: string
}

export interface PoiItem {
  id: string
  name: string
  category: string
  address?: string
  lat?: number
  lng?: number
  distance?: number
  mode: DataMode
}

export interface AccommodationItem {
  id: string
  name: string
  type: string
  address?: string
  lat?: number
  lng?: number
  distance?: number
  mode: DataMode
}

export interface PhotoAsset {
  url: string
  photographer?: string
  photographerUrl?: string
  sourceUrl?: string
  mode: DataMode
  alt: string
}

export interface RoadBookDay {
  day: number
  title: string
  summary: string
  slots: { period: 'Matin' | 'Midi' | 'Après-midi' | 'Soir'; text: string }[]
}

export interface TransportSuggestion {
  mode: string
  route: string
  distanceKm?: number
  note: string
}

export interface TripResult {
  profile: TravelProfile
  primary: ScoredDestination | CustomDestinationResult
  alternatives: ScoredDestination[]
  budget: BudgetBreakdown
  weather: WeatherInfo
  photo: PhotoAsset
  alternativePhotos: PhotoAsset[]
  accommodations: AccommodationItem[]
  experiences: PoiItem[]
  roadBook: RoadBookDay[]
  transport: TransportSuggestion
  copy: {
    headline: string
    tagline: string
    why: { title: string; detail: string }[]
  }
  durationDays: number
  isCustomDestination: boolean
}

export interface CustomDestinationResult {
  destination: {
    id: string
    city: string
    country: string
    lat: number
    lng: number
    summary: string
    highlights: string[]
    fallbackImage: string
    themes: ThemeId[]
    activities: ActivityId[]
    approximateCostIndex: 1 | 2 | 3 | 4 | 5
  }
  score: null
  reasons: { title: string; detail: string }[]
  badge: 'Voyage personnalisé'
}

export type AppView = 'landing' | 'questionnaire' | 'analysis' | 'result'
