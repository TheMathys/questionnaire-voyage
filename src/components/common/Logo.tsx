/** Remplacer par le fichier logo officiel dès qu’il est disponible (ex. /tribtravel-logo.png). */
export const LOGO_SRC: string | null = null

export const SLOGAN = 'À vous le voyage, à nous l’organisation.'

export function Logo({
  className = '',
  size = 'md',
  onDark = false,
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  onDark?: boolean
}) {
  const text = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  }

  if (LOGO_SRC) {
    const heights = { sm: 'h-8', md: 'h-10', lg: 'h-14' }
    return (
      <img
        src={LOGO_SRC}
        alt="TribTravel"
        className={`${heights[size]} w-auto ${className}`}
      />
    )
  }

  return (
    <span
      className={`inline-flex items-baseline gap-0 font-bold tracking-tight ${text[size]} ${
        onDark ? 'text-white' : 'text-trib-ink'
      } ${className}`}
      aria-label="TribTravel"
    >
      <span className="text-trib-red">Trib</span>
      <span>Travel</span>
    </span>
  )
}
