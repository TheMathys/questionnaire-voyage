import type { WeatherInfo } from '../types/trip'

const WMO: Record<number, string> = {
  0: 'Ciel dégagé',
  1: 'Principalement dégagé',
  2: 'Partiellement nuageux',
  3: 'Couvert',
  45: 'Brouillard',
  48: 'Brouillard givrant',
  51: 'Bruine légère',
  53: 'Bruine',
  55: 'Bruine dense',
  61: 'Pluie légère',
  63: 'Pluie',
  65: 'Forte pluie',
  71: 'Neige légère',
  73: 'Neige',
  75: 'Forte neige',
  80: 'Averses',
  81: 'Averses modérées',
  82: 'Fortes averses',
  95: 'Orage',
}

function describe(code?: number): string {
  if (code === undefined) return 'Conditions variables'
  return WMO[code] ?? 'Conditions variables'
}

/** Open-Meteo couvre typiquement ~16 jours de prévision. */
export function canForecast(departure?: string): boolean {
  if (!departure) return false
  const dep = new Date(departure)
  const now = new Date()
  const diffDays = (dep.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays >= 0 && diffDays <= 15
}

export async function fetchWeather(
  lat: number,
  lng: number,
  departure?: string,
): Promise<WeatherInfo> {
  const attribution = 'Données météo : Open-Meteo.com'
  const wantForecast = canForecast(departure)

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const url = wantForecast
      ? `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max&timezone=auto&forecast_days=16`
      : `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`

    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)
    if (!res.ok) throw new Error('weather http')

    const data = await res.json()

    if (wantForecast && departure && data.daily) {
      const idx = data.daily.time?.indexOf(departure) ?? -1
      const i = idx >= 0 ? idx : 0
      return {
        mode: 'live',
        temperatureMax: data.daily.temperature_2m_max?.[i],
        temperatureMin: data.daily.temperature_2m_min?.[i],
        weatherCode: data.daily.weathercode?.[i],
        windSpeed: data.daily.windspeed_10m_max?.[i],
        description: describe(data.daily.weathercode?.[i]),
        isForecast: true,
        attribution,
      }
    }

    return {
      mode: 'live',
      temperature: data.current?.temperature_2m,
      temperatureMax: data.daily?.temperature_2m_max?.[0],
      temperatureMin: data.daily?.temperature_2m_min?.[0],
      weatherCode: data.current?.weather_code,
      windSpeed: data.current?.wind_speed_10m,
      description: describe(data.current?.weather_code),
      isForecast: false,
      attribution,
    }
  } catch {
    return {
      mode: 'fallback',
      description: 'Météo temporairement indisponible',
      isForecast: false,
      attribution,
    }
  }
}
