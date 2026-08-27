import { Link } from 'react-router-dom'
import {
  Compass,
  HeartHandshake,
  Map,
  Mountain,
  Palette,
  Users,
  ArrowRight,
} from 'lucide-react'
import { Button } from '../common/Button'
import { SectionHeading } from '../common/SectionHeading'
import { SLOGAN } from '../common/Logo'

const HERO_IMG =
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80'
const IMG_SPORT =
  'https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=80'
const IMG_CULTURE =
  'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=900&q=80'
const IMG_FAMILY =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80'

const examples = [
  {
    title: 'Costa Rica',
    formula: 'Formule sportive',
    detail: '2 adultes · 10 jours / 9 nuits · Paris → San José',
    budget: 'environ 4 000 € (exemple scolaire)',
    image: 'https://images.unsplash.com/photo-1518182170546-07661fd94144?w=900&q=80',
  },
  {
    title: 'Égypte',
    formula: 'Formule culturelle',
    detail: '2 adultes · 8 jours / 7 nuits · Paris → Le Caire',
    budget: 'environ 2 000 € (exemple scolaire)',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=900&q=80',
  },
  {
    title: 'Ténérife',
    formula: 'Formule familiale',
    detail: '2 adultes + 2 enfants · 7 jours / 6 nuits · Paris → Ténérife',
    budget: 'environ 2 000 € (exemple scolaire)',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=900&q=80',
  },
]

export function LandingPage() {
  return (
    <main>
      <section className="trib-gradient-hero relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -right-16 h-72 w-72 trib-organic bg-[color-mix(in_srgb,var(--color-trib-yellow)_35%,transparent)] blur-0" />
        <div className="pointer-events-none absolute bottom-10 -left-20 h-64 w-64 trib-organic bg-[color-mix(in_srgb,var(--color-trib-coral)_30%,transparent)]" />

        <div className="trib-container grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="trib-fade-in relative z-10">
            <p className="mb-3 text-sm font-semibold tracking-wide text-trib-red uppercase">
              Votre voyage. Vos envies. Votre rythme.
            </p>
            <h1 className="max-w-xl text-4xl leading-tight font-bold tracking-tight text-trib-ink sm:text-5xl">
              Le voyage qui vous ressemble commence ici.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-trib-muted">
              Répondez à quelques questions et laissez TribTravel imaginer un road book adapté à
              votre tribu, votre budget et vos envies.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/questionnaire">
                <Button className="px-7 py-3.5 text-base">
                  Créer mon road book
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <a href="#comment-ca-marche">
                <Button variant="outline">Découvrir le concept</Button>
              </a>
            </div>
            <p className="mt-4 text-sm text-trib-muted">11 questions · environ 2 à 3 minutes</p>
            <p className="mt-6 text-sm font-medium text-trib-ink/80">{SLOGAN}</p>
          </div>

          <div className="trib-fade-in trib-delay-1 relative">
            <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-trib-red/10">
              <img
                src={HERO_IMG}
                alt="Route de voyage au coucher du soleil"
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
                width={800}
                height={1000}
              />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden max-w-[220px] rounded-2xl bg-white p-4 shadow-lg sm:block">
              <p className="text-xs font-semibold text-trib-red uppercase">Road book</p>
              <p className="mt-1 text-sm font-medium">Personnalisé pour votre tribu</p>
            </div>
          </div>
        </div>
      </section>

      <section id="comment-ca-marche" className="scroll-mt-20 py-20">
        <div className="trib-container">
          <SectionHeading
            eyebrow="Le concept"
            title="Comment ça marche ?"
            subtitle="Trois étapes simples pour transformer vos envies en itinéraire concret."
            align="center"
          />
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Users,
                title: 'Parlez-nous de vous',
                text: 'Dates, tribu, budget, rythme et envies.',
              },
              {
                icon: Compass,
                title: 'Nous trouvons votre voyage',
                text: 'TribTravel compare votre profil à différentes expériences.',
              },
              {
                icon: Map,
                title: 'Découvrez votre road book',
                text: 'Destination, hébergements, expériences et itinéraire.',
              },
            ].map((step, i) => (
              <li key={step.title} className={`trib-fade-in trib-delay-${i + 1} trib-card p-6`}>
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-trib-yellow)_40%,white)] text-trib-red">
                  <step.icon className="h-6 w-6" aria-hidden />
                </span>
                <p className="text-sm font-semibold text-trib-red">Étape {i + 1}</p>
                <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-trib-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="univers" className="scroll-mt-20 bg-white py-20">
        <div className="trib-container">
          <SectionHeading
            eyebrow="Nos univers"
            title="Les univers TribTravel"
            subtitle="Trois façons de voyager, une même promesse : un road book qui vous ressemble."
            align="center"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Trib’box Sportive",
                text: 'Aventure, randonnée, activités, nature.',
                image: IMG_SPORT,
                icon: Mountain,
              },
              {
                title: "Trib’box Culturelle",
                text: 'Patrimoine, gastronomie, rencontres, histoire.',
                image: IMG_CULTURE,
                icon: Palette,
              },
              {
                title: "Trib’box Familiale",
                text: 'Expériences accessibles, détente et souvenirs en famille.',
                image: IMG_FAMILY,
                icon: HeartHandshake,
              },
            ].map((u) => (
              <article key={u.title} className="group overflow-hidden rounded-[1.5rem]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={u.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
                    <u.icon className="mb-3 h-6 w-6 text-trib-yellow" aria-hidden />
                    <h3 className="text-2xl font-bold">{u.title}</h3>
                    <p className="mt-2 text-sm text-white/85">{u.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="inspiration" className="scroll-mt-20 py-20">
        <div className="trib-container">
          <SectionHeading
            eyebrow="Inspiration"
            title="Des exemples de road books TribTravel"
            subtitle="Issus du projet scolaire — présentés à titre d’illustration, pas comme des offres disponibles."
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {examples.map((ex) => (
              <article key={ex.title} className="trib-card overflow-hidden">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={ex.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold tracking-wide text-trib-red uppercase">
                    Exemple de road book TribTravel
                  </p>
                  <h3 className="mt-1 text-xl font-bold">{ex.title}</h3>
                  <p className="mt-1 text-sm font-medium">{ex.formula}</p>
                  <p className="mt-2 text-sm text-trib-muted">{ex.detail}</p>
                  <p className="mt-2 text-sm text-trib-muted">Budget indicatif : {ex.budget}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="mb-4 text-lg font-semibold">Et vous, où partirez-vous ?</p>
            <Link to="/questionnaire">
              <Button className="px-8 py-3.5 text-base">Créer mon road book</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
