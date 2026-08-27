import { Cloud, CloudRain, CloudSun, Sun, Wind } from 'lucide-react'
import type { WeatherInfo } from '../../types/trip'
import { ApiStatus } from './ApiStatus'

function WeatherGlyph({ code }: { code?: number }) {
  const className = 'h-7 w-7'
  if (code === 0 || code === 1) return <Sun className={className} aria-hidden />
  if (code !== undefined && code >= 61) return <CloudRain className={className} aria-hidden />
  if (code !== undefined && code >= 2) return <Cloud className={className} aria-hidden />
  return <CloudSun className={className} aria-hidden />
}

export function WeatherCard({ weather }: { weather: WeatherInfo }) {
  return (
    <div className="trib-card p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold">
          {weather.isForecast ? 'Météo prévue pour votre départ' : 'En ce moment à destination'}
        </h3>
        <ApiStatus mode={weather.mode} />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-trib-yellow)_40%,white)] text-trib-red">
          <WeatherGlyph code={weather.weatherCode} />
        </div>
        <div>
          <p className="text-2xl font-bold">
            {weather.temperature != null
              ? `${Math.round(weather.temperature)}°C`
              : weather.temperatureMax != null
                ? `${Math.round(weather.temperatureMin ?? weather.temperatureMax)}° / ${Math.round(weather.temperatureMax)}°`
                : '—'}
          </p>
          <p className="text-trib-muted">{weather.description}</p>
          {weather.windSpeed != null && (
            <p className="mt-1 flex items-center gap-1 text-sm text-trib-muted">
              <Wind className="h-3.5 w-3.5" aria-hidden />
              Vent {Math.round(weather.windSpeed)} km/h
            </p>
          )}
        </div>
      </div>
      {!weather.isForecast && (
        <p className="mt-4 text-sm text-trib-muted">
          Les prévisions pour votre séjour seront disponibles à l’approche du départ.
        </p>
      )}
      <p className="mt-3 text-xs text-trib-muted">{weather.attribution}</p>
    </div>
  )
}
