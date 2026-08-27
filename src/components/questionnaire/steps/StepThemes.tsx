import {
  Waves,
  Landmark,
  Trees,
  Mountain,
  UtensilsCrossed,
  Umbrella,
  Dumbbell,
  Car,
  Sparkles,
  Home,
} from 'lucide-react'
import { SelectionCard } from '../../common/SelectionCard'
import { THEME_OPTIONS } from '../../../data/questionnaire'
import type { ThemeId, TravelProfile } from '../../../types/trip'

const ICONS: Record<ThemeId, typeof Waves> = {
  detente: Waves,
  culture: Landmark,
  nature: Trees,
  aventure: Mountain,
  gastronomie: UtensilsCrossed,
  plage: Umbrella,
  sport: Dumbbell,
  roadtrip: Car,
  luxe: Sparkles,
  immersion: Home,
}

interface Props {
  profile: TravelProfile
  update: (patch: Partial<TravelProfile>) => void
}

export function StepThemes({ profile, update }: Props) {
  const toggle = (id: ThemeId) => {
    const has = profile.themes.includes(id)
    if (has) {
      update({ themes: profile.themes.filter((t) => t !== id) })
      return
    }
    if (profile.themes.length >= 3) return
    update({ themes: [...profile.themes, id] })
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Qu’avez-vous envie de vivre ?</h1>
        <p className="mt-2 text-trib-muted">Choisissez jusqu’à 3 univers.</p>
        <p className="mt-2 text-sm font-semibold text-trib-red">
          {profile.themes.length} / 3 sélectionnées
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {THEME_OPTIONS.map((opt) => {
          const Icon = ICONS[opt.id]
          return (
            <SelectionCard
              key={opt.id}
              title={opt.label}
              description={opt.description}
              icon={<Icon className="h-5 w-5" />}
              selected={profile.themes.includes(opt.id)}
              disabled={!profile.themes.includes(opt.id) && profile.themes.length >= 3}
              onClick={() => toggle(opt.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
