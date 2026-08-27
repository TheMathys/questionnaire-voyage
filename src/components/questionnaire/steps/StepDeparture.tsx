import { SelectionCard } from '../../common/SelectionCard'
import { PlaceAutocomplete } from '../PlaceAutocomplete'
import { FLEXIBILITY_OPTIONS } from '../../../data/questionnaire'
import type { DateFlexibility, TravelProfile } from '../../../types/trip'

interface Props {
  profile: TravelProfile
  update: (patch: Partial<TravelProfile>) => void
}

export function StepDeparture({ profile, update }: Props) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          D’où et quand souhaitez-vous partir ?
        </h1>
        <p className="mt-2 text-trib-muted">Indiquez votre point de départ et vos dates.</p>
      </header>

      <PlaceAutocomplete
        id="origin"
        label="Ville de départ"
        placeholder="Ex. Paris, Lyon, Bruxelles…"
        value={profile.origin.label}
        onChange={(label) => update({ origin: { ...profile.origin, label } })}
        onSelect={(place) =>
          update({
            origin: {
              label: place.label,
              lat: place.lat,
              lng: place.lng,
              city: place.city,
              country: place.country,
            },
          })
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="departure" className="mb-1.5 block text-sm font-medium">
            Date de départ
          </label>
          <input
            id="departure"
            type="date"
            value={profile.dates.departure ?? ''}
            className="w-full rounded-2xl border border-trib-border bg-white px-4 py-3 text-sm"
            onChange={(e) =>
              update({ dates: { ...profile.dates, departure: e.target.value } })
            }
          />
        </div>
        <div>
          <label htmlFor="return" className="mb-1.5 block text-sm font-medium">
            Date de retour
          </label>
          <input
            id="return"
            type="date"
            value={profile.dates.return ?? ''}
            min={profile.dates.departure}
            className="w-full rounded-2xl border border-trib-border bg-white px-4 py-3 text-sm"
            onChange={(e) =>
              update({ dates: { ...profile.dates, return: e.target.value } })
            }
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-medium">Vos dates sont-elles flexibles ?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {FLEXIBILITY_OPTIONS.map((opt) => (
            <SelectionCard
              key={opt.id}
              title={opt.label}
              selected={profile.dates.flexibility === opt.id}
              onClick={() =>
                update({
                  dates: { ...profile.dates, flexibility: opt.id as DateFlexibility },
                })
              }
            />
          ))}
        </div>
      </fieldset>
    </div>
  )
}
