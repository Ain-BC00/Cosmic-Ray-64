export type CheckinValues = { sleep: number; mood: number; stress: number; fatigue: number; symptoms: string }
export type DailyRecord = { profileId: string; date: string; checkin?: CheckinValues; reaction?: number; updatedAt: string }
export const localDate = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
export function validCheckin(v: CheckinValues) {
  return Number.isFinite(v.sleep) && v.sleep >= 0 && v.sleep <= 14 && [v.mood, v.stress, v.fatigue].every(n => Number.isInteger(n) && n >= 0 && n <= 10) && typeof v.symptoms === 'string'
}
export function readHistory(): DailyRecord[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem('cosmic-daily-v1') || '[]')
    return Array.isArray(data) ? data.filter((r): r is DailyRecord => !!r && typeof r.profileId === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.date) && typeof r.updatedAt === 'string' && (!r.checkin || validCheckin(r.checkin)) && (r.reaction === undefined || (Number.isFinite(r.reaction) && r.reaction >= 0))) : []
  } catch { return [] }
}
export function upsertRecord(records: DailyRecord[], profileId: string, date: string, patch: Partial<Pick<DailyRecord, 'checkin' | 'reaction'>>): DailyRecord[] {
  const existing = records.find(r => r.profileId === profileId && r.date === date)
  return [...records.filter(r => r !== existing), { ...existing, profileId, date, ...patch, updatedAt: new Date().toISOString() }].sort((a, b) => a.date.localeCompare(b.date))
}
export function downloadText(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }))
  const link = document.createElement('a'); link.href = url; link.download = name; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export function transmissionStage(sentAt: number, now: number, oneWayMinutes: number, speed: number) {
  const elapsed = Math.max(0, (now - sentAt) / 1000 * speed)
  const leg = oneWayMinutes * 60
  return { stage: elapsed < leg ? 'En camino a Tierra' : elapsed < leg * 2 ? 'Respuesta de guion en camino' : 'Respuesta simulada recibida', remaining: Math.max(0, Math.ceil((leg * 2 - elapsed) / speed)), progress: Math.min(100, elapsed / (leg * 2) * 100), complete: elapsed >= leg * 2 }
}
export function nextStep(hasCheckin: boolean, hasReaction: boolean, hasReviewedPlan: boolean) {
  if (!hasCheckin) return { tab: 'checkin' as const, title: 'Completa tu chequeo de hoy', text: 'Registra sueño, ánimo, estrés y cansancio para actualizar tu resumen.', action: 'Abrir chequeo' }
  if (!hasReaction) return { tab: 'cognicion' as const, title: 'Registra tu tiempo de reacción', text: 'La prueba de hoy todavía está pendiente para este tripulante.', action: 'Abrir prueba' }
  if (!hasReviewedPlan) return { tab: 'salida' as const, title: 'Revisa un plan de salida', text: 'Completa responsable, fecha, checklist y observaciones en una de las alternativas. El registro no autoriza una salida.', action: 'Revisar planes' }
  return { tab: 'salida' as const, title: 'Preparación registrada', text: 'Tus registros de hoy están completos y hay un plan documentado. Puedes revisar pendientes y preparar el relevo de turno.', action: 'Ver planes' }
}
type WellbeingValues = { sleep: number; mood: number; stress: number; fatigue: number; reaction: number }
export function assessWellbeing(current: WellbeingValues, baseline: WellbeingValues, hasCheckin: boolean, hasReaction: boolean) {
  const alerts: { tone: 'amber' | 'blue'; title: string; text: string }[] = []
  if (hasCheckin && current.sleep < baseline.sleep - 0.5) alerts.push({ tone: 'amber', title: 'Sueño por debajo de tu línea base', text: `Registraste ${current.sleep} h frente a ${baseline.sleep.toFixed(1)} h habituales. Considera repetir el chequeo en reposo.` })
  if (hasReaction && current.reaction > baseline.reaction + 15) alerts.push({ tone: 'amber', title: 'Tiempo de reacción más lento', text: `El resultado está ${Math.round(current.reaction - baseline.reaction)} ms por encima de tu referencia. Repite la prueba cuando estés descansado.` })
  if (hasCheckin && current.stress > baseline.stress + 0.8) alerts.push({ tone: 'blue', title: 'Estrés por encima de tu referencia', text: `Registraste ${current.stress}/10 frente a ${baseline.stress.toFixed(1)}/10 en tu línea base. Observa si se mantiene.` })
  if (hasCheckin && current.fatigue > baseline.fatigue + 0.8) alerts.push({ tone: 'blue', title: 'Cansancio por encima de tu referencia', text: `Registraste ${current.fatigue}/10 frente a ${baseline.fatigue.toFixed(1)}/10 habituales. Considera revisar descanso y carga de trabajo.` })
  if (hasCheckin && current.mood < baseline.mood - 0.8) alerts.push({ tone: 'blue', title: 'Ánimo por debajo de tu referencia', text: `Registraste ${current.mood}/10 frente a ${baseline.mood.toFixed(1)}/10 en tu línea base. Coméntalo con la tripulación si continúa.` })
  const keys = ['sleep', 'mood', 'stress', 'fatigue', 'reaction'] as const
  if (!hasCheckin || !hasReaction || !keys.every(key => Number.isFinite(current[key]) && Number.isFinite(baseline[key]))) return { alerts, score: null }
  const penalty = Math.max(0, baseline.sleep - current.sleep) * 8 + Math.max(0, current.reaction - baseline.reaction) / 4 + Math.max(0, current.stress - baseline.stress) * 6 + Math.max(0, current.fatigue - baseline.fatigue) * 5 + Math.max(0, baseline.mood - current.mood) * 5
  return { alerts, score: Math.max(0, Math.min(100, Math.round(100 - penalty))) }
}
