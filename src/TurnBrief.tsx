import { useLanguage } from './i18n'
import { useState } from 'react'
import { DailyRecord, downloadText } from './mission'
import { destinations, ExitPlan, validPlan } from './spaceWeather'
import { readEmergency, readVital, eventSeconds } from './records'

export function readTurnContext(profileId: string) {
  let plans: ExitPlan[] = []
  let notes = ''
  let tasks: boolean[] = []
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(`cosmic-exit-plans-v1-${profileId}`) || 'null')
    if (Array.isArray(saved)) plans = saved.filter(validPlan)
  } catch { /* Los planes ausentes no se consideran completos. */ }
  try {
    const saved = JSON.parse(localStorage.getItem(`cosmic-mars-v1-${profileId}`) || 'null')
    if (saved && typeof saved.notes === 'string') notes = saved.notes
    if (saved && Array.isArray(saved.tasks) && saved.tasks.length === 3 && saved.tasks.every((v: unknown) => typeof v === 'boolean')) tasks = saved.tasks
  } catch { /* El informe identifica los datos no disponibles. */ }
  return { plans, notes, tasks }
}
export const reviewedPlan = (p: ExitPlan, date: string) => p.departure.startsWith(`${date}T`) && !!p.responsible.trim() && p.checks.every(Boolean) && !!p.decision.trim()

export function TurnBrief({ profileId, profileName, date, record, alerts, onClose, onNotice }: { profileId: string; profileName: string; date: string; record?: DailyRecord; alerts: string[]; onClose: () => void; onNotice: (message: string) => void }) {
  const { view, reportText, userText } = useLanguage()
  const [context] = useState(() => readTurnContext(profileId))
  const [vitals] = useState(() => readVital(profileId, date))
  const [emergency] = useState(() => readEmergency(profileId, ''))
  const [receiver, setReceiver] = useState('')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const [lastReport, setLastReport] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem(`cosmic-turn-last-v1-${profileId}`) || 'null'); return typeof saved?.report === 'string' ? saved.report : '' } catch { return '' }
  })
  const report = reportText([
    'COSMIC RAY 64 · RESUMEN DE TURNO', `Fecha local: ${date}`, `Preparado: ${new Date().toISOString()}`, `Tripulante: ${userText(profileName)}`, `Recibe el turno: ${receiver.trim() ? userText(receiver.trim()) : 'Sin especificar'}`,
    '\nREGISTROS PERSONALES DE HOY', record?.checkin ? `Sueño ${record.checkin.sleep} h · Ánimo ${record.checkin.mood}/10 · Estrés ${record.checkin.stress}/10 · Cansancio ${record.checkin.fatigue}/10\nNotas del chequeo: ${record.checkin.symptoms ? userText(record.checkin.symptoms) : 'Sin notas'}` : 'Pendiente: chequeo diario.', `Reacción: ${record?.reaction !== undefined ? `${record.reaction} ms, medida con clic` : 'pendiente'}`,
    `Señales orientativas contra referencia personal: ${record ? alerts.join('; ') || 'Sin señales destacadas o referencia personal todavía pendiente' : 'No evaluadas: sin registros personales de hoy'}`,
    '\nSIGNOS VITALES MANUALES', vitals ? `${JSON.stringify(vitals.values)}\nGuardado: ${vitals.savedAt} · ${vitals.date}` : 'Sin registro de signos vitales de hoy.',
    '\nÚLTIMO EVENTO DE COORDINACIÓN', emergency.startedAt !== null ? `Inicio: ${new Date(emergency.startedAt).toISOString()}\nEvento observado: ${userText(emergency.event)}\nTiempo registrado: ${eventSeconds(emergency, Date.now())} s\nObservaciones: ${userText(emergency.notes)}\nEstado: ${emergency.endedAt ? 'Evento finalizado' : 'Registro activo'}` : 'Sin evento iniciado.',
    '\nPLANES GUARDADOS (NO SON AUTORIZACIONES)', ...(context.plans.length ? context.plans.flatMap(p => [`${userText(p.name)}: ${destinations[p.destination]}, ${p.duration} min; salida local ${p.departure || 'sin definir'}.`, `Responsable: ${p.responsible ? userText(p.responsible) : 'pendiente'} · Checklist: ${p.checks.filter(Boolean).length}/4 · Demora por trayecto: ${p.comms} min.`, `Decisión/observaciones del usuario: ${p.decision ? userText(p.decision) : 'pendientes'}`, `Revisión documental para hoy: ${reviewedPlan(p, date) ? 'registrada' : 'pendiente o corresponde a otra fecha'}`]) : ['Sin planes guardados.']),
    '\nCOORDINACIÓN DE MODO MARTE (ÚLTIMA SESIÓN GUARDADA)', `Tareas: ${context.tasks.length ? `${context.tasks.filter(Boolean).length}/${context.tasks.length}` : 'sin sesión disponible'}`, `Bitácora: ${context.notes ? userText(context.notes) : 'sin anotaciones'}`, 'La sesión de Marte puede corresponder a otro turno; confirmar vigencia al recibirla.',
    '\nPENDIENTES DE RELEVO', ...(!record?.checkin ? ['- Completar chequeo diario.'] : []), ...(record?.reaction === undefined ? ['- Completar prueba cognitiva.'] : []), ...(!context.plans.some(p => reviewedPlan(p, date)) ? ['- Documentar la revisión de un plan para hoy.'] : []), '- Confirmar vigencia de datos ambientales y revisión humana antes de cualquier tarea.',
    `\nNOTAS PARA QUIEN RECIBE\n${notes.trim() ? userText(notes.trim()) : 'Sin notas adicionales.'}`,
    '\nRegistro local. No se envía a Tierra ni se sincroniza entre dispositivos. No contiene una autorización médica u operativa. Los ejemplos ficticios del resumen no se incluyen como mediciones personales.',
  ].join('\n'))
  const finish = () => {
    try {
      localStorage.setItem(`cosmic-turn-last-v1-${profileId}`, JSON.stringify({ date, savedAt: new Date().toISOString(), report }))
      setSaved(true); setLastReport(report); onNotice('Resumen de turno guardado en este dispositivo')
    } catch { onNotice('No se pudo guardar el turno. Descarga el informe para conservarlo.') }
  }
  return view(<div className="modal-backdrop" onClick={onClose}><section className="modal turn-modal" role="dialog" aria-modal="true" aria-labelledby="turn-title" onClick={e => e.stopPropagation()} onKeyDown={e => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'Tab') {
      const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button, input, textarea, select, summary, a[href]')).filter(el => !el.hasAttribute('disabled') && el.getClientRects().length)
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
    }
  }}>
    <button className="close" aria-label="Cerrar resumen de turno" onClick={onClose} autoFocus>×</button><span className="eyebrow">RELEVO · {profileName}</span><h2 id="turn-title">Resumen del turno</h2><p>Revisa los registros y pendientes antes de entregar el turno. El informe conserva una copia de lo que aparece aquí.</p>
    {lastReport && <details><summary>Último cierre guardado</summary><pre className="mars-report">{lastReport}</pre><button className="outline-button" onClick={() => downloadText(`ultimo-turno-${profileId}.txt`, lastReport)}>Descargar último cierre</button></details>}
    <label>Quién recibe el turno<input maxLength={100} value={receiver} onChange={e => { setReceiver(e.target.value); setSaved(false) }} placeholder="Nombre del responsable entrante"/></label><label>Notas para el relevo<textarea maxLength={4000} value={notes} onChange={e => { setNotes(e.target.value); setSaved(false) }} placeholder="Tareas pendientes, decisiones y observaciones…"/></label>
    <details><summary>Vista previa del informe</summary><pre className="mars-report">{report}</pre></details><div className="exit-actions"><button className="primary-button" onClick={finish}>{saved ? '✓ Turno guardado' : 'Guardar cierre de turno'}</button><button className="outline-button" onClick={() => downloadText(`turno-${profileId}-${date}.txt`, report)}>Descargar resumen de turno</button></div><p className="mars-caption">Guardar el cierre conserva el último informe de este tripulante y mantiene sus chequeos y planes.</p>
  </section></div>)
}
