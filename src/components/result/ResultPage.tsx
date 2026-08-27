import { Link } from 'react-router-dom'
import {
  Calendar,
  MapPin,
  Pencil,
  Printer,
  RotateCcw,
  Users,
  Plane,
  Sparkles,
} from 'lucide-react'
import { Button } from '../common/Button'
import { DestinationCard } from '../common/DestinationCard'
import { WeatherCard } from '../common/WeatherCard'
import { BudgetBreakdownView } from '../common/BudgetBreakdown'
import { RoadBookDayCard } from '../common/RoadBookDay'
import { PoiCard } from '../common/PoiCard'
import { ApiStatus } from '../common/ApiStatus'
import { TripMap } from '../roadbook/TripMap'
import { getBudgetLabel } from '../../lib/budget'
import { PACE_OPTIONS } from '../../data/questionnaire'
import type { TripResult } from '../../types/trip'

interface Props {
  result: TripResult
  onRestart: () => void
  onEdit: () => void
  onSelectAlternative: (id: string) => void
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function ResultPage({ result, onRestart, onEdit, onSelectAlternative }: Props) {
  const dest = result.primary.destination
  const score = 'score' in result.primary ? result.primary.score : null
  const travelers =
    result.profile.travelers.adults + result.profile.travelers.children
  const paceLabel =
    PACE_OPTIONS.find((p) => p.id === result.profile.pace)?.label ?? result.profile.pace

  return (
    <main className="pb-20">
      <section className="relative min-h-[70vh] overflow-hidden">
        <img
          src={result.photo.url}
          alt={result.photo.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
        <div className="trib-container relative z-10 flex min-h-[70vh] flex-col justify-end py-12 text-white">
          <div className="trib-fade-in max-w-2xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                Votre voyage TribTravel
              </span>
              {result.isCustomDestination ? (
                <span className="rounded-full bg-trib-yellow px-3 py-1 text-xs font-semibold text-trib-ink">
                  Voyage personnalisé
                </span>
              ) : score != null ? (
                <span className="rounded-full bg-trib-yellow px-3 py-1 text-xs font-semibold text-trib-ink">
                  {score} % compatible avec votre voyage idéal
                </span>
              ) : null}
              <ApiStatus mode={result.photo.mode} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {result.copy.headline}
            </h1>
            <p className="mt-4 text-lg text-white/90">{result.copy.tagline}</p>
            <ul className="mt-6 flex flex-wrap gap-4 text-sm text-white/85">
              <li className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden />
                {dest.country || dest.city}
              </li>
              <li className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" aria-hidden />
                {result.durationDays} jours
              </li>
              <li className="flex items-center gap-1.5">
                <Users className="h-4 w-4" aria-hidden />
                {travelers} voyageur{travelers > 1 ? 's' : ''}
              </li>
              <li>
                {formatDate(result.profile.dates.departure)} →{' '}
                {formatDate(result.profile.dates.return)}
              </li>
            </ul>
            <div className="no-print mt-8 flex flex-wrap gap-3">
              <a href="#roadbook">
                <Button className="bg-white text-trib-ink hover:bg-trib-yellow">
                  Découvrir mon road book
                </Button>
              </a>
              <Button variant="outline" className="border-white/40 bg-white/10 text-white" onClick={onEdit}>
                <Pencil className="h-4 w-4" aria-hidden />
                Modifier mes réponses
              </Button>
            </div>
            {result.photo.photographer && (
              <p className="mt-6 text-xs text-white/70">
                Photo :{' '}
                {result.photo.photographerUrl ? (
                  <a href={result.photo.photographerUrl} className="underline" target="_blank" rel="noreferrer">
                    {result.photo.photographer}
                  </a>
                ) : (
                  result.photo.photographer
                )}{' '}
                / Pexels
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="trib-container py-16">
        <h2 className="text-3xl font-bold">Pourquoi {dest.country || dest.city} ?</h2>
        <p className="mt-2 max-w-2xl text-trib-muted">
          Chaque raison s’appuie sur vos réponses — pas sur une formule générique.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {result.copy.why.map((reason) => (
            <article key={reason.title} className="trib-card p-5">
              <div className="mb-2 flex items-center gap-2 text-trib-red">
                <Sparkles className="h-4 w-4" aria-hidden />
                <h3 className="font-bold text-trib-ink">{reason.title}</h3>
              </div>
              <p className="text-sm text-trib-muted">{reason.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="trib-container">
          <h2 className="text-3xl font-bold">Récapitulatif du voyage</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Voyageurs', value: `${result.profile.travelers.adults} adulte(s)${result.profile.travelers.children ? ` · ${result.profile.travelers.children} enfant(s)` : ''}` },
              { label: 'Dates', value: `${formatDate(result.profile.dates.departure)} → ${formatDate(result.profile.dates.return)}` },
              { label: 'Durée', value: `${result.durationDays} jours` },
              { label: 'Départ', value: result.profile.origin.label || '—' },
              { label: 'Destination', value: `${dest.city}${dest.country ? `, ${dest.country}` : ''}` },
              { label: 'Rythme', value: paceLabel || '—' },
              { label: 'Style', value: result.profile.themes.slice(0, 3).join(', ') || '—' },
              { label: 'Budget', value: getBudgetLabel(result.profile.budgetRange) },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-trib-border p-4">
                <p className="text-xs font-semibold tracking-wide text-trib-red uppercase">
                  {item.label}
                </p>
                <p className="mt-1 font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="trib-container grid gap-8 py-16 lg:grid-cols-2">
        <BudgetBreakdownView budget={result.budget} />
        <WeatherCard weather={result.weather} />
      </section>

      <section className="trib-container py-8">
        <h2 className="text-3xl font-bold">Comment y aller ?</h2>
        <div className="trib-card mt-6 flex flex-col gap-3 p-6 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-trib-yellow)_40%,white)] text-trib-red">
            <Plane className="h-6 w-6" aria-hidden />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold">{result.transport.route}</p>
            {result.transport.distanceKm != null && (
              <p className="text-sm text-trib-muted">
                Distance approximative : {result.transport.distanceKm.toLocaleString('fr-FR')} km
              </p>
            )}
            <p className="mt-1 text-sm text-trib-muted">{result.transport.note}</p>
          </div>
        </div>
      </section>

      <section className="trib-container py-8">
        <h2 className="text-3xl font-bold">Où dormir</h2>
        <p className="mt-2 text-trib-muted">
          {result.accommodations.some((a) => a.mode === 'live')
            ? 'Adresses réelles à proximité (sans prix ni disponibilité).'
            : 'Suggestions de types d’hébergement TribTravel — pas d’établissements inventés.'}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {result.accommodations.map((a) => (
            <PoiCard key={a.id} item={a} />
          ))}
        </div>
      </section>

      <section className="trib-container py-8">
        <h2 className="text-3xl font-bold">Expériences à vivre</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.experiences.map((e) => (
            <PoiCard key={e.id} item={e} />
          ))}
        </div>
      </section>

      <section className="trib-container py-8">
        <h2 className="mb-6 text-3xl font-bold">Sur la carte</h2>
        <TripMap
          lat={dest.lat}
          lng={dest.lng}
          label={`${dest.city}${dest.country ? `, ${dest.country}` : ''}`}
          pois={result.experiences}
          accommodations={result.accommodations}
        />
      </section>

      <section id="roadbook" className="scroll-mt-20 bg-white py-16">
        <div className="trib-container">
          <h2 className="text-3xl font-bold">Votre road book jour par jour</h2>
          <p className="mt-2 max-w-2xl text-trib-muted">
            Proposition indicative construite à partir de vos envies — aucune réservation n’est
            effectuée.
          </p>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {result.roadBook.map((day) => (
              <RoadBookDayCard key={day.day} day={day} />
            ))}
          </div>
        </div>
      </section>

      {result.alternatives.length > 0 && (
        <section className="trib-container py-16">
          <h2 className="text-3xl font-bold">Vous pourriez aussi aimer…</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {result.alternatives.map((alt, i) => (
              <DestinationCard
                key={alt.destination.id}
                name={alt.destination.city}
                country={alt.destination.country}
                score={alt.score}
                image={result.alternativePhotos[i]?.url ?? alt.destination.fallbackImage}
                reasons={alt.reasons.map((r) => r.detail)}
                onClick={() => onSelectAlternative(alt.destination.id)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="no-print trib-container flex flex-wrap justify-center gap-3 pb-8">
        <Button variant="outline" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" aria-hidden />
          Recommencer
        </Button>
        <Button variant="outline" onClick={onEdit}>
          <Pencil className="h-4 w-4" aria-hidden />
          Modifier mes réponses
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="h-4 w-4" aria-hidden />
          Imprimer mon road book
        </Button>
        <Link to="/">
          <Button variant="ghost">Retour à l’accueil</Button>
        </Link>
      </section>
    </main>
  )
}
