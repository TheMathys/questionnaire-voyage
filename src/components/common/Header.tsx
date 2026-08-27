import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo'
import { Button } from './Button'

const links = [
  { href: '/#comment-ca-marche', label: 'Comment ça marche' },
  { href: '/#univers', label: 'Nos univers' },
  { href: '/#inspiration', label: 'Inspiration' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header className="no-print sticky top-0 z-40 border-b border-trib-border/80 bg-[color-mix(in_srgb,var(--color-trib-background)_88%,transparent)] backdrop-blur-md">
      <div className="trib-container flex h-[4.5rem] items-center justify-between gap-4 sm:h-20">
        <Link to="/" aria-label="Accueil TribTravel">
          <Logo size="lg" />
        </Link>

        {isHome && (
          <nav className="hidden items-center gap-6 md:flex" aria-label="Navigation principale">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-trib-muted transition hover:text-trib-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/questionnaire">
            <Button>Créer mon road book</Button>
          </Link>
        </div>

        <button
          type="button"
          className="rounded-full p-2 md:hidden"
          aria-expanded={open}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-trib-border bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Navigation mobile">
            {isHome &&
              links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-black/5"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              ))}
            <Link to="/questionnaire" onClick={() => setOpen(false)}>
              <Button className="w-full">Créer mon road book</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
