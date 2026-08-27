import { SelectionCard } from '../../common/SelectionCard'
import { ACCOMMODATION_OPTIONS, COMFORT_OPTIONS } from '../../../data/questionnaire'
import type { ComfortLevel, TravelProfile } from '../../../types/trip'

interface Props {
  profile: TravelProfile
  update: (patch: Partial<TravelProfile>) => void
}

export function StepAccommodation({ profile, update }: Props) {
  const toggle = (id: string) => {
    if (id === 'peu-importe') {
      update({ accommodationTypes: ['peu-importe'] })
      return
    }
    const without = profile.accommodationTypes.filter((t) => t !== 'peu-importe')
    const has = without.includes(id)
    update({
      accommodationTypes: has ? without.filter((t) => t !== id) : [...without, id],
    })
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Où aimez-vous poser vos valises ?</h1>
        <p className="mt-2 text-trib-muted">Type d’hébergement, puis niveau de confort.</p>
      </header>

      <div>
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-trib-red uppercase">
          Type d’hébergement
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {ACCOMMODATION_OPTIONS.map((opt) => (
            <SelectionCard
              key={opt.id}
              title={opt.label}
              selected={profile.accommodationTypes.includes(opt.id)}
              onClick={() => toggle(opt.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-trib-red uppercase">
          Niveau de confort
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {COMFORT_OPTIONS.map((opt) => (
            <SelectionCard
              key={opt.id}
              title={opt.label}
              description={opt.description}
              selected={profile.comfortLevel === opt.id}
              onClick={() => update({ comfortLevel: opt.id as ComfortLevel })}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
