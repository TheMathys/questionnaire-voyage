import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { STORAGE_KEY } from '../data/questionnaire'
import {
  defaultProfile,
  getDemoProfile,
  loadStoredProfile,
} from './tripDefaults'
import type { TravelProfile, TripResult } from '../types/trip'

interface TripContextValue {
  profile: TravelProfile
  update: (patch: Partial<TravelProfile>) => void
  setProfile: (p: TravelProfile) => void
  step: number
  setStep: (n: number) => void
  reset: () => void
  fillDemo: () => void
  hydrated: boolean
  result: TripResult | null
  setResult: (r: TripResult | null) => void
}

const TripContext = createContext<TripContextValue | null>(null)

function readInitialResult(): TripResult | null {
  try {
    const stored = sessionStorage.getItem('tribtravel-result')
    return stored ? (JSON.parse(stored) as TripResult) : null
  } catch {
    return null
  }
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<TravelProfile>(() =>
    typeof window !== 'undefined' ? loadStoredProfile() : defaultProfile(),
  )
  const [step, setStep] = useState(0)
  const [hydrated] = useState(true)
  const [result, setResultState] = useState<TripResult | null>(() =>
    typeof window !== 'undefined' ? readInitialResult() : null,
  )

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    } catch {
      // ignore
    }
  }, [profile])

  const update = useCallback((patch: Partial<TravelProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }))
  }, [])

  const reset = useCallback(() => {
    setProfile(defaultProfile())
    setStep(0)
    setResultState(null)
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem('tribtravel-result')
  }, [])

  const fillDemo = useCallback(() => {
    if (!import.meta.env.DEV) return
    setProfile(getDemoProfile())
  }, [])

  const setResult = useCallback((r: TripResult | null) => {
    setResultState(r)
    if (r) sessionStorage.setItem('tribtravel-result', JSON.stringify(r))
    else sessionStorage.removeItem('tribtravel-result')
  }, [])

  const value = useMemo(
    () => ({
      profile,
      update,
      setProfile,
      step,
      setStep,
      reset,
      fillDemo,
      hydrated,
      result,
      setResult,
    }),
    [profile, update, step, reset, fillDemo, hydrated, result, setResult],
  )

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

// Hook colocalisé avec le Provider (pattern React Context)
// eslint-disable-next-line react-refresh/only-export-components
export function useTrip() {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrip must be used within TripProvider')
  return ctx
}
