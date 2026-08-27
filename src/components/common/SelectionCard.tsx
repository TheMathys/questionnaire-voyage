import type { ReactNode } from 'react'
import { Check } from 'lucide-react'

interface Props {
  selected?: boolean
  onClick?: () => void
  title: string
  description?: string
  icon?: ReactNode
  multi?: boolean
  disabled?: boolean
  className?: string
}

export function SelectionCard({
  selected,
  onClick,
  title,
  description,
  icon,
  disabled,
  className = '',
}: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
      className={`trib-card relative w-full p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-trib-yellow disabled:opacity-40 ${
        selected
          ? 'border-2 border-trib-red bg-[color-mix(in_srgb,var(--color-trib-coral)_12%,white)]'
          : 'border border-trib-border'
      } ${className}`}
    >
      {selected && (
        <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-trib-red text-white">
          <Check className="h-3.5 w-3.5" aria-hidden />
        </span>
      )}
      <div className="flex items-start gap-3">
        {icon && (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-trib-yellow)_45%,white)] text-trib-red">
            {icon}
          </span>
        )}
        <div>
          <p className="font-semibold text-trib-ink">{title}</p>
          {description && <p className="mt-1 text-sm text-trib-muted">{description}</p>}
        </div>
      </div>
    </button>
  )
}
