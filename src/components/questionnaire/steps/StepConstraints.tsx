import { SelectionCard } from '../../common/SelectionCard'
import { CONSTRAINT_OPTIONS } from '../../../data/questionnaire'
import type { TravelProfile } from '../../../types/trip'

interface Props {
  profile: TravelProfile
  update: (patch: Partial<TravelProfile>) => void
}

export function StepConstraints({ profile, update }: Props) {
  const toggle = (id: string) => {
    if (id === 'aucune') {
      update({ constraints: ['aucune'] })
      return
    }
    const without = profile.constraints.filter((c) => c !== 'aucune')
    const has = without.includes(id)
    update({
      constraints: has ? without.filter((c) => c !== id) : [...without, id],
    })
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Quelque chose à prendre en compte ?
        </h1>
        <p className="mt-2 text-trib-muted">
          Ces précisions nous aident à rester réalistes et confortables.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {CONSTRAINT_OPTIONS.map((opt) => (
          <SelectionCard
            key={opt.id}
            title={opt.label}
            selected={profile.constraints.includes(opt.id)}
            onClick={() => toggle(opt.id)}
          />
        ))}
      </div>
      <div>
        <label htmlFor="constraint-details" className="mb-1.5 block text-sm font-medium">
          Une précision utile ? (facultatif)
        </label>
        <textarea
          id="constraint-details"
          rows={3}
          value={profile.constraintDetails ?? ''}
          placeholder="Allergie aux fruits de mer, poussette indispensable…"
          className="w-full rounded-2xl border border-trib-border bg-white px-4 py-3 text-sm"
          onChange={(e) => update({ constraintDetails: e.target.value })}
        />
      </div>
    </div>
  )
}
