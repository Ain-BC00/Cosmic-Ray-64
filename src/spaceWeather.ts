export const NOAA_URL = 'https://services.swpc.noaa.gov/products/noaa-scales.json'
export const SCALES_URL = 'https://www.spaceweather.gov/noaa-scales-explanation'
export type Weather = { observedAt: string; fetchedAt: string; s: number | null; r: number | null; g: number | null }
export type ExitPlan = { name: string; destination: 'leo' | 'moon' | 'mars'; duration: number; departure: string; responsible: string; comms: number; checks: boolean[]; decision: string }
export const destinations = { leo: 'Órbita terrestre', moon: 'Superficie lunar', mars: 'Superficie de Marte' }
export function parseWeather(input: unknown, now = Date.now()): Weather {
  const current = (input as Record<string, unknown>)?.['0'] as Record<string, unknown> | undefined
  if (!current || typeof current.DateStamp !== 'string' || typeof current.TimeStamp !== 'string') throw new Error('NOAA no entregó una fecha de observación válida.')
  const observedAt = `${current.DateStamp}T${current.TimeStamp}Z`
  if (!Number.isFinite(Date.parse(observedAt))) throw new Error('Fecha de observación no válida.')
  const scale = (key: string) => {
    const raw = (current[key] as { Scale?: unknown } | undefined)?.Scale
    if (!(typeof raw === 'number' || (typeof raw === 'string' && /^[0-5]$/.test(raw)))) return null
    const n = Number(raw)
    return Number.isInteger(n) && n >= 0 && n <= 5 ? n : null
  }
  const result = { observedAt, fetchedAt: new Date(now).toISOString(), s: scale('S'), r: scale('R'), g: scale('G') }
  if (result.s === null && result.r === null && result.g === null) throw new Error('NOAA no entregó escalas observadas disponibles.')
  return result
}
export function freshWeather(weather: Weather | null, now = Date.now()) {
  if (!weather) return false
  const age = now - Date.parse(weather.observedAt)
  return Number.isFinite(age) && age >= -5 * 60000 && age <= 30 * 60000
}
export function validPlan(p: unknown): p is ExitPlan {
  if (!p || typeof p !== 'object') return false
  const v = p as ExitPlan
  return ['leo', 'moon', 'mars'].includes(v.destination) && typeof v.name === 'string' && v.name.length <= 80 && Number.isFinite(v.duration) && v.duration >= 10 && v.duration <= 480 && typeof v.departure === 'string' && (v.departure === '' || Number.isFinite(new Date(v.departure).getTime())) && typeof v.responsible === 'string' && v.responsible.length <= 100 && Number.isFinite(v.comms) && v.comms >= 0 && v.comms <= 60 && Array.isArray(v.checks) && v.checks.length === 4 && v.checks.every(v => typeof v === 'boolean') && typeof v.decision === 'string' && v.decision.length <= 2000
}
export function planReview(plan: ExitPlan, weather: Weather | null, usable: boolean, hasCheckin: boolean, hasReaction: boolean, historical = false) {
  const reasons: string[] = []
  if (!validPlan(plan)) reasons.push('Corrige los campos del plan: duración de 10 a 480 min y demora de 0 a 60 min.')
  if (!plan.departure) reasons.push('Falta la fecha y hora de salida; no se evalúa una ventana futura.')
  else reasons.push('La observación ambiental no es un pronóstico para la fecha y duración de esta salida.')
  if (!plan.responsible.trim()) reasons.push('Falta identificar al responsable de revisión.')
  const pending = plan.checks.filter(v => !v).length
  if (pending) reasons.push(`${pending} verificaciones de equipo o coordinación pendientes.`)
  if (!hasCheckin) reasons.push('Falta el chequeo personal de hoy.')
  if (!hasReaction) reasons.push('Falta la prueba de reacción de hoy.')
  if (!usable || weather?.s == null) reasons.push('No hay una observación de radiación solar vigente y verificable para esta revisión.')
  else if (weather.s >= 3) reasons.push(`Evento S${weather.s}: NOAA describe peligro de radiación para astronautas en EVA. Requiere revisión especializada.`)
  else if (weather.s > 0) reasons.push(`Evento S${weather.s}: revisar el contexto de radiación solar y los procedimientos de misión.`)
  else reasons.push('S0 indica ausencia de tormenta en esta escala; no significa ausencia de radiación espacial.')
  if (weather?.r && usable) reasons.push(`R${weather.r}: perturbación de radio en el entorno terrestre; revisar la aplicabilidad al enlace.`)
  if (weather?.g && usable) reasons.push(`G${weather.g}: perturbación geomagnética terrestre; no equivale a dosis personal.`)
  if (plan.destination !== 'leo') reasons.push('Las observaciones de NOAA corresponden al entorno terrestre; no describen la exposición en Luna o Marte.')
  if (historical) reasons.push('Reproducción histórica: no representa las condiciones de la salida planificada.')
  reasons.push('Faltan dosimetría, posición y protección del traje/vehículo. No se calcula dosis, aptitud médica ni autorización de salida.')
  return reasons
}
export const historicalEvents = [
  { label: '19 ene · 11:36 UTC', s: 3, observedAt: '2026-01-19T11:36:00Z', title: 'Tormenta fuerte observada', detail: 'Un boletín operativo de NOAA informó condiciones de radiación solar S3.', source: 'https://www.ospo.noaa.gov/data/messages/2026/01/MSG_20260119_1136.html' },
  { label: '19 ene · aviso S4', s: 4, observedAt: '2026-01-19', title: 'Intensificación a severa', detail: 'NOAA publicó que las mediciones GOES-19 alcanzaron S4. Esta ficha no asigna una hora exacta al cambio.', source: 'https://www.spaceweather.gov/news/s4-severe-solar-radiation-storm-progress-january-19th-2026' },
  { label: '20 ene · 23:13 UTC', s: 3, observedAt: '2026-01-20T23:13:00Z', title: 'Boletín posterior con S3', detail: 'Un boletín operativo posterior informó S3. Las fichas son avisos publicados, no una serie continua ni el máximo de cada día.', source: 'https://www.ospo.noaa.gov/data/messages/2026/01/MSG_20260120_2313.html' },
]
