import { Compass, MapPinned } from 'lucide-react'
import { PlaceAutocomplete } from '../PlaceAutocomplete'
import type { TravelProfile } from '../../../types/trip'

interface Props {
  profile: TravelProfile
  update: (patch: Partial<TravelProfile>) => void
}

export function StepDestination({ profile, update }: Props) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Vous savez déjà où partir ?</h1>
        <p className="mt-2 text-trib-muted">
          Indiquez une destination ou laissez TribTravel vous surprendre.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          aria-pressed={profile.destinationMode === 'known'}
          onClick={() => update({ destinationMode: 'known' })}
          className={`trib-card p-6 text-left transition ${
            profile.destinationMode === 'known'
              ? 'border-2 border-trib-red'
              : 'hover:-translate-y-0.5'
          }`}
        >
          <MapPinned className="mb-3 h-8 w-8 text-trib-red" aria-hidden />
          <h2 className="text-xl font-bold">J’ai une destination en tête</h2>
          <p className="mt-2 text-sm text-trib-muted">
            Ville, région ou pays — on construit autour de votre choix.
          </p>
        </button>

        <button
          type="button"
          aria-pressed={profile.destinationMode === 'inspire'}
          onClick={() => update({ destinationMode: 'inspire', destination: undefined })}
          className={`relative overflow-hidden p-6 text-left transition ${
            profile.destinationMode === 'inspire'
              ? 'border-2 border-trib-red'
              : 'border border-trib-border'
          } rounded-[1.25rem] bg-gradient-to-br from-trib-red via-trib-coral to-trib-yellow text-white shadow-lg`}
        >
          <Compass className="mb-3 h-8 w-8" aria-hidden />
          <h2 className="text-xl font-bold">Inspirez-moi</h2>
          <p className="mt-2 text-sm text-white/90">
            Surprenez-moi à partir de mes envies.
          </p>
        </button>
      </div>

      {profile.destinationMode === 'known' && (
        <PlaceAutocomplete
          id="destination"
          label="Votre destination"
          placeholder="Ex. Costa Rica, Lisbonne, Japon…"
          value={profile.destination?.label ?? ''}
          onChange={(label) =>
            update({ destination: { ...profile.destination, label } })
          }
          onSelect={(place) =>
            update({
              destination: {
                label: place.label,
                lat: place.lat,
                lng: place.lng,
                city: place.city,
                country: place.country,
              },
            })
          }
        />
      )}
    </div>
  )
}
