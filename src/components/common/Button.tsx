import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'

const styles: Record<Variant, string> = {
  primary:
    'bg-trib-red text-white hover:bg-[#c93725] shadow-sm shadow-trib-red/20',
  secondary:
    'bg-trib-yellow text-trib-ink hover:bg-[#f5c63d]',
  ghost: 'bg-transparent text-trib-ink hover:bg-black/5',
  outline:
    'bg-white text-trib-ink border border-trib-border hover:border-trib-coral',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

export function Button({ variant = 'primary', className = '', children, ...props }: Props) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
