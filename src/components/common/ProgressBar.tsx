interface Props {
  value: number
  max?: number
  label?: string
}

export function ProgressBar({ value, max = 10, label }: Props) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="w-full" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label ?? 'Progression'}>
      <div className="h-2 overflow-hidden rounded-full bg-black/5">
        <div
          className="trib-progress-fill h-full rounded-full bg-gradient-to-r from-trib-red to-trib-coral transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
