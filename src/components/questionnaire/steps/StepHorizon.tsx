import { SelectionCard } from '../../common/SelectionCard'
import {
  CLIMATE_OPTIONS,
  DISTANCE_OPTIONS,
  REGION_OPTIONS,
} from '../../../data/questionnaire'
import type {
  ClimatePref,
  DistancePref,
  RegionPref,
  TravelProfile,
} from '../../../types/trip'

interface Props {
  profile: TravelProfile
  update: (patch: Partial<TravelProfile>) => void
}

export function StepHorizon({ profile, update }: Props) {
  const toggleRegion = (id: RegionPref) => {
    if (id === 'ouvert') {
      update({ regionPreferences: ['ouvert'] })
      return
    }
    const without = profile.regionPreferences.filter((r) => r !== 'ouvert')
    const has = without.includes(id)
    const next = has ? without.filter((r) => r !== id) : [...without, id]
    update({ regionPreferences: next.slice(0, 3) })
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Vers quel horizon ?</h1>
        <p className="mt-2 text-trib-muted">
          Climat, zone géographique et distance : trois leviers pour affiner « Inspirez-moi ».
        </p>
      </header>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold tracking-wide text-trib-red uppercase">
          Quelle ambiance climatique ?
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {CLIMATE_OPTIONS.map((opt) => (
            <SelectionCard
              key={opt.id}
              title={opt.label}
              description={opt.description}
              selected={profile.climatePreference === opt.id}
              onClick={() => update({ climatePreference: opt.id as ClimatePref })}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1 text-sm font-semibold tracking-wide text-trib-red uppercase">
          Quelles zones vous font de l’œil ?
        </legend>
        <p className="mb-3 text-sm text-trib-muted">
          Jusqu’à 3 · {Math.min(profile.regionPreferences.filter((r) => r !== 'ouvert').length, 3)} / 3
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {REGION_OPTIONS.map((opt) => (
            <SelectionCard
              key={opt.id}
              title={opt.label}
              description={opt.description}
              selected={profile.regionPreferences.includes(opt.id)}
              disabled={
                opt.id !== 'ouvert' &&
                !profile.regionPreferences.includes(opt.id) &&
                profile.regionPreferences.filter((r) => r !== 'ouvert').length >= 3
              }
              onClick={() => toggleRegion(opt.id)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold tracking-wide text-trib-red uppercase">
          Jusqu’où êtes-vous prêt·e à aller ?
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {DISTANCE_OPTIONS.map((opt) => (
            <SelectionCard
              key={opt.id}
              title={opt.label}
              description={opt.description}
              selected={profile.distancePreference === opt.id}
              onClick={() => update({ distancePreference: opt.id as DistancePref })}
            />
          ))}
        </div>
      </fieldset>
    </div>
  )
}
