import { SelectionCard } from '../../common/SelectionCard'
import { ACTIVITY_OPTIONS } from '../../../data/questionnaire'
import type { ActivityId, TravelProfile } from '../../../types/trip'

interface Props {
  profile: TravelProfile
  update: (patch: Partial<TravelProfile>) => void
}

export function StepExperiences({ profile, update }: Props) {
  const toggle = (id: ActivityId) => {
    const has = profile.activities.includes(id)
    update({
      activities: has
        ? profile.activities.filter((a) => a !== id)
        : [...profile.activities, id],
    })
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Qu’aimeriez-vous absolument vivre ?
        </h1>
        <p className="mt-2 text-trib-muted">Sélectionnez toutes les expériences qui vous font de l’œil.</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {ACTIVITY_OPTIONS.map((opt) => (
          <SelectionCard
            key={opt.id}
            title={opt.label}
            selected={profile.activities.includes(opt.id)}
            onClick={() => toggle(opt.id)}
          />
        ))}
      </div>
      <div>
        <label htmlFor="dream" className="mb-1.5 block text-sm font-medium">
          Une expérience dont vous rêvez ? (facultatif)
        </label>
        <textarea
          id="dream"
          rows={3}
          value={profile.dreamExperience ?? ''}
          placeholder="Ex. dormir face à un volcan, voir les aurores boréales, apprendre à cuisiner avec des locaux…"
          className="w-full rounded-2xl border border-trib-border bg-white px-4 py-3 text-sm"
          onChange={(e) => update({ dreamExperience: e.target.value })}
        />
      </div>
    </div>
  )
}
