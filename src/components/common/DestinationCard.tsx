import { MapPin } from 'lucide-react'
import { ApiStatus } from './ApiStatus'
import type { DataMode } from '../../types/trip'

interface Props {
  name: string
  country?: string
  score?: number | null
  image: string
  reasons?: string[]
  badge?: string
  onClick?: () => void
  cta?: string
  mode?: DataMode
}

export function DestinationCard({
  name,
  country,
  score,
  image,
  reasons,
  badge,
  onClick,
  cta = 'Voir cette option',
  mode,
}: Props) {
  return (
    <article className="trib-card overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-black/5">
        <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
        {(badge || score != null) && (
          <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-trib-ink shadow-sm">
            {badge ?? `${score} % compatible`}
          </span>
        )}
        {mode && (
          <span className="absolute top-3 right-3">
            <ApiStatus mode={mode} />
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold">{name}</h3>
        {country && (
          <p className="mt-1 flex items-center gap-1 text-sm text-trib-muted">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {country}
          </p>
        )}
        {reasons && reasons.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-trib-muted">
            {reasons.slice(0, 2).map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
        )}
        {onClick && (
          <button
            type="button"
            onClick={onClick}
            className="mt-4 text-sm font-semibold text-trib-red hover:underline"
          >
            {cta}
          </button>
        )}
      </div>
    </article>
  )
}
