export type VitalValues = { pulse: string; oxygen: string; temperature: string; pressure: string; glucose: string }
export type VitalRecord = { profileId: string; date: string; savedAt: string; values: VitalValues }
export type EmergencyRecord = { profileId: string; scenarioName: string; event: string; category?: string; startedAt: number | null; endedAt: number | null; steps: boolean[]; roles: { care: string; comms: string; log: string }; notes: string }
export function readJSON(key: string): unknown { try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null } }
export function validVitals(v: unknown): v is VitalValues {
  if (!v || typeof v !== 'object') return false
  const values = v as VitalValues
  if (!['pulse', 'oxygen', 'temperature', 'pressure', 'glucose'].every(key => typeof values[key as keyof VitalValues] === 'string')) return false
  const positive = (s: string) => s === '' || (s.trim() !== '' && Number.isFinite(Number(s)) && Number(s) > 0)
  return positive(values.pulse) && positive(values.temperature) && positive(values.glucose) && (values.oxygen === '' || (positive(values.oxygen) && Number(values.oxygen) <= 100)) && (values.pressure === '' || /^\d{1,3}\s*\/\s*\d{1,3}$/.test(values.pressure) && values.pressure.split('/').every(n => Number(n) > 0))
}
export function readVital(profileId: string, date: string): VitalRecord | null {
  const data = readJSON(`cosmic-vitals-v2-${profileId}-${date}`) as VitalRecord | null
  return data && data.profileId === profileId && data.date === date && typeof data.savedAt === 'string' && validVitals(data.values) ? data : null
}
export function emptyEmergency(profileId: string, scenarioName: string): EmergencyRecord {
  return { profileId, scenarioName, event: '', category: '', startedAt: null, endedAt: null, steps: [false, false, false, false, false, false], roles: { care: '', comms: '', log: '' }, notes: '' }
}
export function validEmergency(value: unknown, profileId: string): value is EmergencyRecord {
  if (!value || typeof value !== 'object') return false
  const r = value as EmergencyRecord
  return r.profileId === profileId && typeof r.scenarioName === 'string' && typeof r.event === 'string' && (r.category === undefined || typeof r.category === 'string') && typeof r.notes === 'string' && (r.startedAt === null || Number.isFinite(r.startedAt) && r.startedAt > 0) && (r.endedAt === null || Number.isFinite(r.endedAt) && r.startedAt !== null && r.endedAt >= r.startedAt) && Array.isArray(r.steps) && r.steps.length === 6 && r.steps.every(v => typeof v === 'boolean') && !!r.roles && ['care', 'comms', 'log'].every(key => typeof r.roles[key as keyof typeof r.roles] === 'string')
}
export function readEmergency(profileId: string, scenarioName: string): EmergencyRecord {
  const r = readJSON(`cosmic-emergency-v2-${profileId}`)
  return validEmergency(r, profileId) ? r : emptyEmergency(profileId, scenarioName)
}
export function eventSeconds(r: EmergencyRecord, now: number): number {
  return r.startedAt === null ? 0 : Math.max(0, Math.floor(((r.endedAt ?? now) - r.startedAt) / 1000))
}
export function filterDates<T extends { date: string }>(records: T[], period: '7' | '30' | 'all', today: string): T[] {
  const end = new Date(`${today}T12:00:00`)
  const start = new Date(end)
  start.setDate(start.getDate() - (period === '7' ? 6 : 29))
  const first = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`
  return records.filter(r => r.date <= today && (period === 'all' || r.date >= first)).sort((a, b) => a.date.localeCompare(b.date))
}
