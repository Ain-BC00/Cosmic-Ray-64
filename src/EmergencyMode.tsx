import { useEffect, useState } from 'react'
import { downloadText } from './mission'
import { emptyEmergency, eventSeconds, readEmergency, EmergencyRecord } from './records'
import { useLanguage } from './i18n'

const categories = ['Cardiovascular', 'Respiratory / hypoxia', 'Decompression sickness', 'Neurological', 'Injury / fracture', 'Infection / immune symptoms', 'Eye / vision', 'Acute psychological distress', 'Radiation exposure', 'Pressure / oxygen / CO₂', 'Temperature / contamination', 'Sleep / cognitive impairment', 'Other / unclassified']
const steps = ['Mantén la comunicación con la tripulación y asigna quién coordina.', 'Registra el inicio y describe signos observados, sin interpretarlos.', 'Consulta el procedimiento local aprobado para esta categoría.', 'Confirma los recursos requeridos en el inventario oficial de la misión.', 'Registra observaciones, cambios y hora de cada acción.', 'Prepara el informe para transmisión y conserva la guía local mientras esperas.']
const outboxKey = 'cosmic-emergency-outbox-v1'
type QueuedReport = { id: string; profileId: string; createdAt: string; status: 'waiting_for_transmission'; report: string }

export function EmergencyMode({ profileId, profileName, scenarioName, crew, onNotice }: { profileId: string; profileName: string; scenarioName: string; crew: { id: string; name: string }[]; onNotice: (message: string) => void }) {
  const { view, reportText, userText } = useLanguage()
  const [record, setRecord] = useState(() => readEmergency(profileId, scenarioName))
  const [now, setNow] = useState(Date.now)
  const [error, setError] = useState('')
  const [queueCount, setQueueCount] = useState(() => { try { const q = JSON.parse(localStorage.getItem(outboxKey) || '[]'); return Array.isArray(q) ? q.filter(item => item?.profileId === profileId).length : 0 } catch { return 0 } })
  const active = record.startedAt !== null && record.endedAt === null
  const seconds = eventSeconds(record, now)
  useEffect(() => { if (!active) return; const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer) }, [active])
  const save = (next: EmergencyRecord) => { setRecord(next); try { localStorage.setItem(`cosmic-emergency-v2-${profileId}`, JSON.stringify(next)); setError('') } catch { setError('No se pudo guardar localmente. Descarga el informe antes de salir.') } }
  const begin = () => { const time = Date.now(); setNow(time); save({ ...record, scenarioName, startedAt: time, endedAt: null }); onNotice('Registro local iniciado. No se envió una alerta externa.') }
  const finish = () => { save({ ...record, endedAt: Date.now() }); onNotice('Evento cerrado y guardado localmente') }
  const makeReport = () => reportText(['COSMIC RAY 64 · INFORME DE EMERGENCIA', `Tripulante: ${userText(profileName)}`, `Categoría: ${record.category || 'Sin clasificar'}`, `Escenario: ${record.scenarioName}`, `Inicio: ${record.startedAt ? new Date(record.startedAt).toISOString() : 'Pendiente'}`, `Preparado: ${new Date().toISOString()}`, `Descripción: ${userText(record.event || 'Sin descripción')}`, `Tiempo registrado: ${seconds} s`, ...steps.map((text, i) => `${record.steps[i] ? '[x]' : '[ ]'} ${text}`), ...Object.entries(record.roles).map(([key, id]) => `${key}: ${crew.find(person => person.id === id)?.name ?? 'Sin asignar'}`), `Observaciones: ${userText(record.notes || 'Sin notas')}`, 'Estado: preparado localmente; no transmitido ni entregado.', 'No hay procedimiento clínico aprobado configurado en esta aplicación.'].join('\n'))
  const exportEvent = () => downloadText(`evento-${profileId}-${new Date(record.startedAt ?? now).toISOString().slice(0, 10)}.txt`, makeReport())
  const queueReport = () => {
    if (!record.startedAt) { setError('Inicia el registro antes de preparar el informe.'); return }
    try {
      const report = makeReport()
      const old = JSON.parse(localStorage.getItem(outboxKey) || '[]')
      const queue: QueuedReport[] = Array.isArray(old) ? old : []
      const id = `${profileId}-${record.startedAt}`
      if (!queue.some(item => item.id === id)) queue.push({ id, profileId, createdAt: new Date().toISOString(), status: 'waiting_for_transmission', report })
      localStorage.setItem(outboxKey, JSON.stringify(queue)); setQueueCount(queue.filter(item => item.profileId === profileId).length); onNotice('Informe guardado en cola local; sigue sin transmitirse.')
    } catch { setError('No se pudo guardar el informe en la cola local.') }
  }
  const newEvent = () => { try { if (record.startedAt !== null) { const key = `cosmic-emergency-archive-v2-${profileId}`; let old: unknown; try { old = JSON.parse(localStorage.getItem(key) || '[]') } catch { old = [] } localStorage.setItem(key, JSON.stringify([...(Array.isArray(old) ? old : []), record])) } save(emptyEmergency(profileId, scenarioName)) } catch { setError('No se pudo archivar el evento anterior.') } }
  return view(<section className="emergency-layout">
    <div className="panel emergency-header"><div><span className="eyebrow">ASISTENCIA LOCAL · {profileName}</span><h2>EMERGENCY ASSISTANCE</h2><p>La guía local no espera una respuesta de Tierra. Esta aplicación no sustituye los protocolos de misión ni al personal médico.</p><span role="status">{active ? 'Registro activo' : record.endedAt ? 'Evento finalizado' : 'Sin iniciar'} · {record.scenarioName}</span></div><div className="event-timer"><span>TIEMPO DEL EVENTO</span><strong>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</strong></div></div>
    <div className="panel emergency-main"><div className="emergency-protocol-warning" role="alert"><strong>Procedimiento aprobado no disponible</strong><p>No hay protocolos clínicos autorizados ni inventario de misión cargados. No se mostrarán instrucciones de tratamiento o dosis. Consulta la documentación médica controlada de la misión y a la autoridad médica disponible.</p></div>
      <label>Categoría<select value={record.category ?? ''} disabled={!!record.endedAt} onChange={e => save({ ...record, category: e.target.value })}><option value="">Selecciona categoría</option>{categories.map(category => <option key={category}>{category}</option>)}</select></label>
      <label>Signos u observaciones<input placeholder="Describe lo observado, sin diagnosticar" maxLength={500} value={record.event} onChange={e => save({ ...record, event: e.target.value })} disabled={!!record.endedAt}/></label>
      <div className="emergency-actions">{record.startedAt === null && <button className="danger-button" disabled={!record.category} onClick={begin}>Iniciar emergencia</button>}{active && <button className="danger-button" onClick={finish}>Finalizar registro</button>}<button className="outline-button" onClick={queueReport} disabled={!record.startedAt}>Preparar informe para Tierra</button><button className="outline-button" onClick={exportEvent}>Descargar informe</button>{!!record.endedAt && <button className="outline-button" onClick={newEvent}>Archivar y preparar otro evento</button>}</div>
      <p role="status">Mensajes pendientes en este dispositivo: {queueCount}. Estado: esperando transmisión. No existe enlace de comunicaciones configurado.</p>
      <h3>Registro de coordinación</h3>{steps.map((step, i) => <label className="check-row" key={step}><input type="checkbox" checked={record.steps[i]} disabled={!!record.endedAt} onChange={() => save({ ...record, steps: record.steps.map((value, j) => i === j ? !value : value) })}/><span>{step}</span></label>)}
      <label>Notas y tiempos<textarea maxLength={4000} value={record.notes} disabled={!!record.endedAt} onChange={e => save({ ...record, notes: e.target.value })} placeholder="Observaciones registradas por la tripulación"/></label>
    </div><div className="panel emergency-side"><span className="eyebrow">ASIGNACIÓN DE ROLES</span>{([['care', 'Coordinación'], ['comms', 'Comunicaciones'], ['log', 'Registro']] as const).map(([key, label]) => <label key={key}>{label}<select value={record.roles[key]} disabled={!!record.endedAt} onChange={e => save({ ...record, roles: { ...record.roles, [key]: e.target.value } })}><option value="">Sin asignar</option>{crew.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>)}<p>Usa el procedimiento de misión guardado y autorizado. Esta pantalla no inventa acciones clínicas.</p></div><p role="alert" className="form-error">{error}</p>
  </section>)
}
