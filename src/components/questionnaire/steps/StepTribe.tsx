import type { TravelProfile } from '../../../types/trip'

interface Props {
  profile: TravelProfile
  update: (patch: Partial<TravelProfile>) => void
}

export function StepTribe({ profile, update }: Props) {
  const { adults, children, childrenAges } = profile.travelers

  const setTravelers = (next: Partial<TravelProfile['travelers']>) => {
    const merged = { ...profile.travelers, ...next }
    if (merged.children < childrenAges.length) {
      merged.childrenAges = childrenAges.slice(0, merged.children)
    }
    while (merged.childrenAges.length < merged.children) {
      merged.childrenAges.push(8)
    }
    update({ travelers: merged })
  }

  const total = adults + children
  const summary = [
    `${adults} adulte${adults > 1 ? 's' : ''}`,
    children > 0 ? `${children} enfant${children > 1 ? 's' : ''}` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Qui embarque dans l’aventure ?</h1>
        <p className="mt-2 text-trib-muted">
          Parlez-nous de votre tribu pour imaginer un voyage adapté à chacun.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            { key: 'adults' as const, label: 'Adultes', min: 0 },
            { key: 'children' as const, label: 'Enfants', min: 0 },
          ] as const
        ).map((row) => (
          <div key={row.key} className="trib-card flex items-center justify-between p-5">
            <span className="font-semibold">{row.label}</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={`Retirer un ${row.label.slice(0, -1).toLowerCase()}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-trib-border text-lg font-bold hover:bg-black/5 disabled:opacity-30"
                disabled={
                  row.key === 'adults'
                    ? adults <= (children > 0 ? 0 : 1)
                    : children <= 0 || (adults === 0 && children <= 1)
                }
                onClick={() =>
                  setTravelers({
                    [row.key]: Math.max(row.min, profile.travelers[row.key] - 1),
                  })
                }
              >
                −
              </button>
              <span className="w-6 text-center text-lg font-bold" aria-live="polite">
                {profile.travelers[row.key]}
              </span>
              <button
                type="button"
                aria-label={`Ajouter un ${row.label.slice(0, -1).toLowerCase()}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-trib-red text-lg font-bold text-white hover:bg-[#c93725]"
                onClick={() =>
                  setTravelers({ [row.key]: profile.travelers[row.key] + 1 })
                }
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {children > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Âges des enfants (facultatif)</p>
          <div className="flex flex-wrap gap-2">
            {childrenAges.map((age, i) => (
              <label key={i} className="flex items-center gap-2 rounded-full border border-trib-border bg-white px-3 py-2 text-sm">
                Enfant {i + 1}
                <input
                  type="number"
                  min={0}
                  max={17}
                  value={age}
                  aria-label={`Âge de l’enfant ${i + 1}`}
                  className="w-14 rounded-lg border border-trib-border px-2 py-1"
                  onChange={(e) => {
                    const next = [...childrenAges]
                    next[i] = Number(e.target.value)
                    setTravelers({ childrenAges: next })
                  }}
                />
                ans
              </label>
            ))}
          </div>
        </div>
      )}

      {total >= 1 && (
        <p className="rounded-2xl bg-[color-mix(in_srgb,var(--color-trib-yellow)_30%,white)] px-4 py-3 text-sm font-medium">
          Résumé : {summary}
        </p>
      )}
    </div>
  )
}
