import { SelectionCard } from '../../common/SelectionCard'
import { BUDGET_OPTIONS, PRIORITY_OPTIONS } from '../../../data/questionnaire'
import type { TravelProfile } from '../../../types/trip'

interface Props {
  profile: TravelProfile
  update: (patch: Partial<TravelProfile>) => void
}

export function StepBudget({ profile, update }: Props) {
  const togglePriority = (id: string) => {
    const has = profile.priorities.includes(id)
    if (has) {
      update({ priorities: profile.priorities.filter((p) => p !== id) })
      return
    }
    if (profile.priorities.length >= 3) return
    update({ priorities: [...profile.priorities, id] })
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dernière étape : parlons budget.</h1>
        <p className="mt-2 text-trib-muted">
          Le montant représente le budget total pour tous les voyageurs.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {BUDGET_OPTIONS.map((opt) => (
          <SelectionCard
            key={opt.id}
            title={opt.label}
            selected={profile.budgetRange === opt.id}
            onClick={() => update({ budgetRange: opt.id })}
          />
        ))}
      </div>

      <div>
        <h2 className="mb-1 text-sm font-semibold tracking-wide text-trib-red uppercase">
          Sur quoi souhaitez-vous privilégier la qualité ?
        </h2>
        <p className="mb-3 text-sm text-trib-muted">
          Maximum 3 · {profile.priorities.length} / 3
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {PRIORITY_OPTIONS.map((opt) => (
            <SelectionCard
              key={opt.id}
              title={opt.label}
              selected={profile.priorities.includes(opt.id)}
              disabled={!profile.priorities.includes(opt.id) && profile.priorities.length >= 3}
              onClick={() => togglePriority(opt.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="ideal" className="mb-1.5 block text-sm font-medium">
          En quelques mots, à quoi ressemble votre voyage idéal ? (facultatif)
        </label>
        <textarea
          id="ideal"
          rows={3}
          value={profile.idealTrip ?? ''}
          placeholder="Ambiance, rythme, souvenirs que vous aimeriez ramener…"
          className="w-full rounded-2xl border border-trib-border bg-white px-4 py-3 text-sm"
          onChange={(e) => update({ idealTrip: e.target.value })}
        />
      </div>
    </div>
  )
}
