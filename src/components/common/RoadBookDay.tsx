import type { RoadBookDay } from '../../types/trip'

export function RoadBookDayCard({ day }: { day: RoadBookDay }) {
  return (
    <article className="trib-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-trib-border bg-[color-mix(in_srgb,var(--color-trib-coral)_10%,white)] px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-trib-red text-sm font-bold text-white">
          J{day.day}
        </span>
        <div>
          <h4 className="font-bold text-trib-ink">{day.title}</h4>
          <p className="text-sm text-trib-muted">{day.summary}</p>
        </div>
      </div>
      <ul className="space-y-3 p-5">
        {day.slots.map((slot) => (
          <li key={`${day.day}-${slot.period}`} className="flex gap-3">
            <span className="mt-0.5 w-24 shrink-0 text-xs font-semibold tracking-wide text-trib-red uppercase">
              {slot.period}
            </span>
            <span className="text-sm text-trib-ink">{slot.text}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
