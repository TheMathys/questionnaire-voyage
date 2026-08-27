import { Link } from 'react-router-dom'
import { Logo, SLOGAN } from './Logo'

export function Footer() {
  return (
    <footer className="no-print mt-auto border-t border-trib-border bg-white">
      <div className="trib-container grid gap-8 py-12 md:grid-cols-[1.2fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-trib-muted">{SLOGAN}</p>
        </div>
        <div className="text-sm text-trib-muted">
          <p className="font-semibold text-trib-ink">Données & attributions</p>
          <ul className="mt-2 space-y-1">
            <li>Météo : Open-Meteo</li>
            <li>Cartes : © OpenStreetMap contributors</li>
            <li>Photos : Pexels (lorsque disponible) ou images de démonstration</li>
            <li>Lieux : Geoapify (lorsque disponible)</li>
          </ul>
          <p className="mt-4">
            <Link to="/questionnaire" className="font-medium text-trib-red hover:underline">
              Créer mon road book
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
