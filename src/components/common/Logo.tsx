/** Logo officiel TribTravel (PNG fond transparent). */
export const LOGO_SRC = '/tribtravel-logo.png'

export const SLOGAN = 'À vous le voyage, à nous l’organisation.'

export function Logo({
  className = '',
  size = 'md',
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  onDark?: boolean
}) {
  const heights = { sm: 'h-9', md: 'h-11', lg: 'h-16' }
  return (
    <img
      src={LOGO_SRC}
      alt="TribTravel"
      className={`${heights[size]} w-auto object-contain ${className}`}
      width={size === 'lg' ? 200 : size === 'md' ? 150 : 120}
      height={size === 'lg' ? 64 : size === 'md' ? 44 : 36}
      decoding="async"
    />
  )
}
