import { Link } from 'react-router-dom'
import { ArrowLeft, Plane } from 'lucide-react'
import { Logo } from '../common/Logo'
import { Button } from '../common/Button'
import { ProgressBar } from '../common/ProgressBar'
import { TOTAL_STEPS } from '../../data/questionnaire'
import { validateStep } from '../../hooks/useTripForm'
import type { TravelProfile } from '../../types/trip'
import { StepTribe } from './steps/StepTribe'
import { StepDeparture } from './steps/StepDeparture'
import { StepDestination } from './steps/StepDestination'
import { StepThemes } from './steps/StepThemes'
import { StepPace } from './steps/StepPace'
import { StepTransport } from './steps/StepTransport'
import { StepAccommodation } from './steps/StepAccommodation'
import { StepExperiences } from './steps/StepExperiences'
import { StepConstraints } from './steps/StepConstraints'
import { StepBudget } from './steps/StepBudget'
import { useState } from 'react'

interface Props {
  profile: TravelProfile
  update: (patch: Partial<TravelProfile>) => void
  step: number
  setStep: (n: number) => void
  onComplete: () => void
  onReset: () => void
  fillDemo?: () => void
}

export function Questionnaire({
  profile,
  update,
  step,
  setStep,
  onComplete,
  onReset,
  fillDemo,
}: Props) {
  const [error, setError] = useState<string | null>(null)

  const goNext = () => {
    const msg = validateStep(step, profile)
    if (msg) {
      setError(msg)
      return
    }
    setError(null)
    if (step >= TOTAL_STEPS - 1) {
      onComplete()
      return
    }
    setStep(step + 1)
  }

  const goBack = () => {
    setError(null)
    if (step === 0) return
    setStep(step - 1)
  }

  const steps = [
    <StepTribe key={0} profile={profile} update={update} />,
    <StepDeparture key={1} profile={profile} update={update} />,
    <StepDestination key={2} profile={profile} update={update} />,
    <StepThemes key={3} profile={profile} update={update} />,
    <StepPace key={4} profile={profile} update={update} />,
    <StepTransport key={5} profile={profile} update={update} />,
    <StepAccommodation key={6} profile={profile} update={update} />,
    <StepExperiences key={7} profile={profile} update={update} />,
    <StepConstraints key={8} profile={profile} update={update} />,
    <StepBudget key={9} profile={profile} update={update} />,
  ]

  return (
    <div className="flex min-h-screen flex-col bg-trib-background">
      <div className="sticky top-0 z-30 border-b border-trib-border bg-[color-mix(in_srgb,var(--color-trib-background)_92%,transparent)] backdrop-blur-md">
        <div className="trib-container flex items-center justify-between gap-3 py-3">
          <Link to="/" aria-label="Accueil">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            {import.meta.env.DEV && fillDemo && (
              <button
                type="button"
                onClick={fillDemo}
                className="hidden text-xs text-trib-muted underline sm:inline"
              >
                Profil démo
              </button>
            )}
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-trib-muted underline"
            >
              Recommencer
            </button>
          </div>
        </div>
        <div className="trib-container pb-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">
              Étape {step + 1} sur {TOTAL_STEPS}
            </span>
            <span className="text-trib-muted">{Math.round(((step + 1) / TOTAL_STEPS) * 100)} %</span>
          </div>
          <ProgressBar value={step + 1} max={TOTAL_STEPS} />
        </div>
      </div>

      <div className="trib-container flex flex-1 flex-col py-8">
        <div key={step} className="trib-fade-in flex-1">
          {steps[step]}
        </div>

        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <div className="no-print mt-8 flex items-center justify-between gap-3 border-t border-trib-border pt-6">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Retour
          </Button>
          <Button onClick={goNext} className="min-w-[10rem] gap-2">
            {step === TOTAL_STEPS - 1 ? (
              <>
                Imaginer mon voyage
                <Plane className="h-4 w-4" aria-hidden />
              </>
            ) : (
              'Suivant'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
