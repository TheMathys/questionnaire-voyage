import { Radio } from 'lucide-react'
import type { DataMode } from '../../types/trip'

export function ApiStatus({ mode, label }: { mode: DataMode; label?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        mode === 'live'
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-amber-50 text-amber-800'
      }`}
    >
      <Radio className="h-3 w-3" aria-hidden />
      {label ?? (mode === 'live' ? 'Données en direct' : 'Données de démonstration')}
    </span>
  )
}
