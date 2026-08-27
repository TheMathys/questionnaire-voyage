import { Plane } from 'lucide-react'
import { Logo } from '../common/Logo'

const MESSAGES = [
  'Analyse de votre profil',
  'Recherche de destinations',
  'Sélection d’expériences',
  'Création de votre road book',
]

interface Props {
  ready: boolean
}

export function AnalysisScreen({ ready }: Props) {
  // Affiche progressivement les étapes ; si prêt, toutes sont cochées
  const visibleCount = ready ? MESSAGES.length : Math.min(MESSAGES.length, 3)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center trib-gradient-hero px-4 text-center">
      <Logo size="lg" />
      <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
        On prépare vos valises…
      </h1>
      <p className="mt-3 max-w-md text-trib-muted">
        TribTravel assemble une proposition à votre image.
      </p>

      <div className="trib-plane mt-10 text-trib-red" aria-hidden>
        <Plane className="h-10 w-10" />
      </div>

      <ul className="mt-10 w-full max-w-sm space-y-3 text-left">
        {MESSAGES.map((msg, i) => {
          const done = ready || i < visibleCount - 1
          const active = i < visibleCount
          return (
            <li
              key={msg}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                active ? 'bg-white font-medium text-trib-ink shadow-sm' : 'text-trib-muted'
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  done || ready ? 'bg-trib-red text-white' : active ? 'bg-trib-coral text-white' : 'bg-black/10'
                }`}
              >
                {done || ready ? '✓' : i + 1}
              </span>
              {msg}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
