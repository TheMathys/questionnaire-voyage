import { SelectionCard } from '../../common/SelectionCard'
import { TRANSPORT_OPTIONS } from '../../../data/questionnaire'
import type { TravelProfile } from '../../../types/trip'

interface Props {
  profile: TravelProfile
  update: (patch: Partial<TravelProfile>) => void
}

export function StepTransport({ profile, update }: Props) {
  const toggle = (id: string) => {
    const has = profile.transportPreferences.includes(id)
    update({
      transportPreferences: has
        ? profile.transportPreferences.filter((t) => t !== id)
        : [...profile.transportPreferences, id],
    })
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Comment souhaitez-vous vous déplacer ?
        </h1>
        <p className="mt-2 text-trib-muted">Plusieurs choix possibles.</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {TRANSPORT_OPTIONS.map((opt) => (
          <SelectionCard
            key={opt.id}
            title={opt.label}
            selected={profile.transportPreferences.includes(opt.id)}
            onClick={() => toggle(opt.id)}
          />
        ))}
      </div>
      <div>
        <label htmlFor="avoid-transport" className="mb-1.5 block text-sm font-medium">
          Y a-t-il un transport que vous souhaitez éviter ? (facultatif)
        </label>
        <input
          id="avoid-transport"
          type="text"
          value={profile.avoidTransport ?? ''}
          placeholder="Ex. bateau, longs trajets en bus…"
          className="w-full rounded-2xl border border-trib-border bg-white px-4 py-3 text-sm"
          onChange={(e) => update({ avoidTransport: e.target.value })}
        />
      </div>
    </div>
  )
}
