import { ApiStatus } from './ApiStatus'
import type { AccommodationItem, PoiItem } from '../../types/trip'

export function PoiCard({ item }: { item: PoiItem | AccommodationItem }) {
  const subtitle =
    'type' in item
      ? item.type
      : item.category.replace(/\./g, ' · ')
  return (
    <article className="trib-card flex flex-col gap-2 p-4">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-trib-ink">{item.name}</h4>
        <ApiStatus mode={item.mode} />
      </div>
      <p className="text-sm text-trib-muted">{subtitle}</p>
      {item.address && <p className="text-sm text-trib-muted">{item.address}</p>}
      {item.distance != null && (
        <p className="text-xs text-trib-muted">≈ {Math.round(item.distance)} m du centre</p>
      )}
    </article>
  )
}
