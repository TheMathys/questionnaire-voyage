import type { BudgetBreakdown } from '../../types/trip'

const rows: { key: keyof Omit<BudgetBreakdown, 'total' | 'note' | 'underBudget'>; label: string }[] = [
  { key: 'transport', label: 'Transport' },
  { key: 'accommodation', label: 'Hébergement' },
  { key: 'activities', label: 'Activités' },
  { key: 'meals', label: 'Repas' },
  { key: 'contingency', label: 'Marge / imprévus' },
]

function formatEuro(n: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n)
}

export function BudgetBreakdownView({ budget }: { budget: BudgetBreakdown }) {
  return (
    <div className="trib-card p-6">
      <div className="mb-1 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-trib-red">Estimation indicative</p>
          <h3 className="text-2xl font-bold">Budget TribTravel</h3>
        </div>
        <p className="text-3xl font-bold text-trib-red">{formatEuro(budget.total)}</p>
      </div>
      <p className="mb-5 text-sm text-trib-muted">
        Cette estimation est fournie à titre indicatif pour la démonstration et ne constitue pas une offre commerciale.
      </p>
      <ul className="space-y-3">
        {rows.map((row) => {
          const value = budget[row.key]
          const pct = Math.round((value / budget.total) * 100)
          return (
            <li key={row.key}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{row.label}</span>
                <span className="font-medium">{formatEuro(value)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-trib-coral to-trib-yellow"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
      {budget.note && (
        <p className="mt-4 rounded-2xl bg-[color-mix(in_srgb,var(--color-trib-yellow)_25%,white)] p-3 text-sm">
          {budget.note}
        </p>
      )}
    </div>
  )
}
