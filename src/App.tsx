import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { Header } from './components/common/Header'
import { Footer } from './components/common/Footer'
import { LandingPage } from './components/landing/LandingPage'
import { Questionnaire } from './components/questionnaire/Questionnaire'
import { AnalysisScreen } from './components/analysis/AnalysisScreen'
import { ResultPage } from './components/result/ResultPage'
import { TripProvider, useTrip } from './hooks/useTripContext'
import { buildTripResult } from './lib/buildTrip'

function Home() {
  return (
    <>
      <Header />
      <LandingPage />
      <Footer />
    </>
  )
}

function QuestionnaireRoute() {
  const navigate = useNavigate()
  const { profile, update, step, setStep, reset, fillDemo } = useTrip()

  return (
    <Questionnaire
      profile={profile}
      update={update}
      step={step}
      setStep={setStep}
      onReset={reset}
      fillDemo={fillDemo}
      onComplete={() => navigate('/analyse')}
    />
  )
}

function AnalysisRoute() {
  const navigate = useNavigate()
  const { profile, hydrated, setResult } = useTrip()
  const [ready, setReady] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (!hydrated || started.current) return
    started.current = true

    const minDelay = new Promise((r) => setTimeout(r, 1800))

    void (async () => {
      try {
        const [trip] = await Promise.all([buildTripResult(profile), minDelay])
        setResult(trip)
        setReady(true)
        window.setTimeout(() => navigate('/resultat'), 400)
      } catch {
        try {
          const trip = await buildTripResult(profile)
          setResult(trip)
          setReady(true)
          navigate('/resultat')
        } catch {
          navigate('/questionnaire')
        }
      }
    })()
  }, [hydrated, navigate, profile, setResult])

  if (!hydrated) return null
  return <AnalysisScreen ready={ready} />
}

function ResultRoute() {
  const navigate = useNavigate()
  const { result, setResult, reset, setStep, profile } = useTrip()
  const [loading, setLoading] = useState(false)

  if (!result) return <Navigate to="/questionnaire" replace />

  const selectAlternative = async (id: string) => {
    setLoading(true)
    try {
      const next = await buildTripResult(result.profile ?? profile, id)
      setResult(next)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      {loading && (
        <div className="bg-trib-yellow/40 px-4 py-2 text-center text-sm font-medium">
          Mise à jour de votre proposition…
        </div>
      )}
      <ResultPage
        result={result}
        onRestart={() => {
          reset()
          navigate('/questionnaire')
        }}
        onEdit={() => {
          setStep(0)
          navigate('/questionnaire')
        }}
        onSelectAlternative={selectAlternative}
      />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <TripProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questionnaire" element={<QuestionnaireRoute />} />
        <Route path="/analyse" element={<AnalysisRoute />} />
        <Route path="/resultat" element={<ResultRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </TripProvider>
  )
}
