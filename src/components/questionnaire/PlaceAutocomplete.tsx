import { useEffect, useId, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { autocompletePlace, type GeoSuggestion } from '../../lib/geo'

interface Props {
  value: string
  onChange: (value: string) => void
  onSelect: (place: GeoSuggestion) => void
  placeholder?: string
  id?: string
  label: string
}

export function PlaceAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  id,
  label,
}: Props) {
  const autoId = useId()
  const inputId = id ?? autoId
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const requestId = useRef(0)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    const q = value.trim()
    if (q.length < 3) {
      return
    }

    const handle = window.setTimeout(() => {
      const current = ++requestId.current
      setLoading(true)
      void autocompletePlace(q).then(({ results }) => {
        if (current !== requestId.current) return
        setSuggestions(results)
        setOpen(results.length > 0)
        setLoading(false)
      })
    }, 350)

    return () => window.clearTimeout(handle)
  }, [value])

  const showList = open && value.trim().length >= 3 && suggestions.length > 0

  return (
    <div ref={wrapRef} className="relative">
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <MapPin
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-trib-muted"
          aria-hidden
        />
        <input
          id={inputId}
          type="text"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value)
            if (e.target.value.trim().length < 3) {
              setSuggestions([])
              setOpen(false)
            }
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          className="w-full rounded-2xl border border-trib-border bg-white py-3 pr-3 pl-10 text-sm outline-none focus:border-trib-coral"
          aria-autocomplete="list"
          aria-expanded={showList}
        />
      </div>
      {loading && <p className="mt-1 text-xs text-trib-muted">Recherche…</p>}
      {showList && (
        <ul
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-2xl border border-trib-border bg-white shadow-lg"
          role="listbox"
        >
          {suggestions.map((s) => (
            <li key={`${s.label}-${s.lat}`}>
              <button
                type="button"
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[color-mix(in_srgb,var(--color-trib-coral)_12%,white)]"
                onClick={() => {
                  onSelect(s)
                  setOpen(false)
                }}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
