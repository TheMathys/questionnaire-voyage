interface Props {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'left' }: Props) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold tracking-wide text-trib-red uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-trib-ink sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base text-trib-muted sm:text-lg">{subtitle}</p>}
    </div>
  )
}
