import type {
  ActivityId,
  ClimatePref,
  ComfortLevel,
  DistancePref,
  Pace,
  RegionPref,
  ThemeId,
} from '../types/trip'

export const TOTAL_STEPS = 11

export const THEME_OPTIONS: { id: ThemeId; label: string; description: string }[] = [
  { id: 'detente', label: 'Détente / repos', description: 'Ralentir et se ressourcer' },
  { id: 'culture', label: 'Découverte culturelle', description: 'Patrimoine et rencontres' },
  { id: 'nature', label: 'Nature / paysages', description: 'Grands espaces et outdoors' },
  { id: 'aventure', label: 'Aventure', description: 'Sensations et exploration' },
  { id: 'gastronomie', label: 'Gastronomie', description: 'Saveurs et tables locales' },
  { id: 'plage', label: 'Plage', description: 'Sable, baignade, horizon' },
  { id: 'sport', label: 'Sport', description: 'Activités dynamiques' },
  { id: 'roadtrip', label: 'Road trip', description: 'Liberté sur la route' },
  { id: 'luxe', label: 'Luxe / bien-être', description: 'Confort et cocooning' },
  { id: 'immersion', label: 'Immersion locale', description: 'Vivre comme les habitants' },
]

export const CLIMATE_OPTIONS: { id: ClimatePref; label: string; description: string }[] = [
  { id: 'chaud', label: 'Chaud / ensoleillé', description: 'Soleil, chaleur, ambiance estivale' },
  { id: 'tempere', label: 'Tempéré', description: 'Douceur, sans extrêmes' },
  { id: 'frais', label: 'Frais / grand air', description: 'Montagnes, nord, air vif' },
  { id: 'indifferent', label: 'Peu importe', description: 'On s’adapte à la destination' },
]

export const REGION_OPTIONS: { id: RegionPref; label: string; description: string }[] = [
  { id: 'europe', label: 'Europe', description: 'Villes, campagnes, proches' },
  { id: 'mediterranee', label: 'Méditerranée', description: 'Mer, villages, soleil' },
  { id: 'afrique-mo', label: 'Afrique & Moyen-Orient', description: 'Déserts, médinas, safaris' },
  { id: 'asie', label: 'Asie', description: 'Temples, street food, contrastes' },
  { id: 'ameriques', label: 'Amériques', description: 'Grands espaces et cultures' },
  { id: 'iles', label: 'Îles & outre-mer', description: 'Lagon, volcan, lagons' },
  { id: 'ouvert', label: 'Surprenez-moi', description: 'Aucune limite géographique' },
]

export const DISTANCE_OPTIONS: { id: DistancePref; label: string; description: string }[] = [
  { id: 'proche', label: 'Proche (≤ 3 h de vol)', description: 'Europe et alentours' },
  { id: 'moyen', label: 'Moyen (3–7 h)', description: 'Méditerranée élargie, Afrique du Nord…' },
  { id: 'loin', label: 'Long-courrier', description: 'Asie, Amériques, Océanie…' },
  { id: 'ouvert', label: 'Ouvert', description: 'La distance n’est pas un critère' },
]

export const PACE_OPTIONS: { id: Pace; label: string; description: string }[] = [
  {
    id: 'doux',
    label: 'Tout doux',
    description: 'Peu de déplacements, beaucoup de temps pour profiter.',
  },
  {
    id: 'equilibre',
    label: 'Équilibré',
    description: 'Visites, expériences et temps libre.',
  },
  {
    id: 'intense',
    label: 'Intense',
    description: 'Des journées bien remplies et beaucoup de découvertes.',
  },
  {
    id: 'itinerant',
    label: 'Itinérant',
    description: 'Plusieurs étapes et le plaisir de changer régulièrement de décor.',
  },
]

export const TRANSPORT_OPTIONS = [
  { id: 'avion', label: 'Avion' },
  { id: 'train', label: 'Train' },
  { id: 'voiture', label: 'Voiture / location' },
  { id: 'transports', label: 'Transports en commun' },
  { id: 'bateau', label: 'Bateau' },
  { id: 'mix', label: 'Mix de plusieurs moyens' },
  { id: 'ouvert', label: 'Je suis ouvert aux propositions' },
] as const

export const ACCOMMODATION_OPTIONS = [
  { id: 'hotel', label: 'Hôtel' },
  { id: 'appartement', label: 'Appartement' },
  { id: 'villa', label: 'Villa / maison' },
  { id: 'chambre', label: 'Chambre d’hôtes' },
  { id: 'camping', label: 'Camping / glamping' },
  { id: 'ecolodge', label: 'Écolodge' },
  { id: 'peu-importe', label: 'Peu importe' },
] as const

export const COMFORT_OPTIONS: { id: ComfortLevel; label: string; description: string }[] = [
  { id: 'essentiel', label: 'Essentiel', description: 'Simple, propre, efficace' },
  { id: 'confortable', label: 'Confortable', description: 'Bon équilibre qualité / prix' },
  { id: 'haut-de-gamme', label: 'Haut de gamme', description: 'Services soignés' },
  { id: 'exceptionnel', label: 'Exceptionnel', description: 'Expérience premium' },
]

export const ACTIVITY_OPTIONS: { id: ActivityId; label: string }[] = [
  { id: 'randonnee', label: 'Randonnée' },
  { id: 'plage', label: 'Plage' },
  { id: 'musees', label: 'Musées & patrimoine' },
  { id: 'gastronomie', label: 'Gastronomie' },
  { id: 'sport', label: 'Activités sportives' },
  { id: 'excursions', label: 'Excursions' },
  { id: 'vie-locale', label: 'Vie locale' },
  { id: 'insolite', label: 'Activités insolites' },
  { id: 'bien-etre', label: 'Bien-être' },
  { id: 'famille', label: 'Sorties en famille' },
  { id: 'nightlife', label: 'Vie nocturne' },
  { id: 'photo', label: 'Photographie / paysages' },
]

export const CONSTRAINT_OPTIONS = [
  { id: 'mobilite', label: 'Mobilité réduite' },
  { id: 'jeunes-enfants', label: 'Jeunes enfants' },
  { id: 'allergies', label: 'Allergies / alimentation' },
  { id: 'animal', label: 'Voyage avec un animal' },
  { id: 'longs-trajets', label: 'Éviter les longs trajets' },
  { id: 'physique', label: 'Éviter les activités physiques intenses' },
  { id: 'jetlag', label: 'Éviter le décalage horaire important' },
  { id: 'aucune', label: 'Aucune contrainte particulière' },
] as const

export const BUDGET_OPTIONS = [
  { id: 'lt-1500', label: 'Moins de 1 500 €', mid: 1200 },
  { id: '1500-2500', label: '1 500 – 2 500 €', mid: 2000 },
  { id: '2500-4000', label: '2 500 – 4 000 €', mid: 3250 },
  { id: '4000-6000', label: '4 000 – 6 000 €', mid: 5000 },
  { id: '6000-10000', label: '6 000 – 10 000 €', mid: 8000 },
  { id: 'gt-10000', label: 'Plus de 10 000 €', mid: 12000 },
  { id: 'unknown', label: 'Je ne sais pas encore', mid: 4000 },
] as const

export const PRIORITY_OPTIONS = [
  { id: 'transport', label: 'Transport' },
  { id: 'hebergement', label: 'Hébergement' },
  { id: 'gastronomie', label: 'Gastronomie' },
  { id: 'activites', label: 'Activités' },
  { id: 'confort', label: 'Confort' },
  { id: 'experiences', label: 'Expériences exceptionnelles' },
] as const

export const FLEXIBILITY_OPTIONS = [
  { id: 'fixed', label: 'Non, dates fixes' },
  { id: '2-days', label: '± 2 jours' },
  { id: '5-days', label: '± 5 jours' },
  { id: 'very-flexible', label: 'Je suis très flexible' },
] as const

export const STEP_TITLES = [
  'Votre tribu',
  'Votre départ',
  'Votre destination',
  'Votre horizon',
  'Vos envies',
  'Votre rythme',
  'Vos déplacements',
  'Votre cocon',
  'Vos expériences',
  'Vos contraintes',
  'Votre budget',
]

export const STORAGE_KEY = 'tribtravel-profile-v2'
