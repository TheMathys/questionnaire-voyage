import { SelectionCard } from '../../common/SelectionCard'
import { PACE_OPTIONS } from '../../../data/questionnaire'
import type { Pace, TravelProfile } from '../../../types/trip'

interface Props {
  profile: TravelProfile
  update: (patch: Partial<TravelProfile>) => void
}

export function StepPace({ profile, update }: Props) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          À quel rythme aimez-vous voyager ?
        </h1>
        <p className="mt-2 text-trib-muted">Un seul choix — celui qui vous ressemble le plus.</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {PACE_OPTIONS.map((opt) => (
          <SelectionCard
            key={opt.id}
            title={opt.label}
            description={opt.description}
            selected={profile.pace === opt.id}
            onClick={() => update({ pace: opt.id as Pace })}
          />
        ))}
      </div>
    </div>
  )
}
