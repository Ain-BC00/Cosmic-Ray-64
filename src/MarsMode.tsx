import { useLanguage } from './i18n'
import { useEffect, useState } from 'react'
import { DailyRecord, downloadText, transmissionStage } from './mission'

type Transmission = { sentAt: number; minutes: number; speed: number; report: string; scenario: string }
type Session = { scenario: string; minutes: number; speed: number; tasks: boolean[]; notes: string; transmission: Transmission | null }
const defaults: Session = { scenario: 'Cambio de turno', minutes: 20, speed: 120, tasks: [false, false, false], notes: '', transmission: null }
function loadSession(key: string): Session {
  try {
    const s = JSON.parse(localStorage.getItem(key) || 'null')
    if (!s || !['Jornada normal', 'Cambio de turno', 'Preparación de EVA'].includes(s.scenario) || ![4, 10, 20, 22].includes(s.minutes) || ![1, 120].includes(s.speed) || !Array.isArray(s.tasks) || s.tasks.length !== 3 || !s.tasks.every((t: unknown) => typeof t === 'boolean') || typeof s.notes !== 'string') return defaults
    if (s.transmission && (!Number.isFinite(s.transmission.sentAt) || ![4, 10, 20, 22].includes(s.transmission.minutes) || ![1, 120].includes(s.transmission.speed) || typeof s.transmission.report !== 'string' || typeof s.transmission.scenario !== 'string')) return defaults
    return s
  } catch { return defaults }
}
export function MarsMode({ profileId, profileName, record, history, alerts, onCheckin, onReaction, onNotice }: { profileId: string; profileName: string; record?: DailyRecord; history: DailyRecord[]; alerts: string[]; onCheckin: () => void; onReaction: () => void; onNotice: (message: string) => void }) {
  const { view, reportText, userText } = useLanguage()
  const key = `cosmic-mars-v1-${profileId}`
  const [session, setSession] = useState(() => loadSession(key))
  const [now, setNow] = useState(Date.now)
  const [storageError, setStorageError] = useState('')
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(session)); setStorageError('') }
    catch { setStorageError('No se pudo guardar la sesión. Exporta el informe antes de salir.') }
  }, [key, session])
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 250); return () => window.clearInterval(timer) }, [])
  const tx = session.transmission
  const status = tx ? transmissionStage(tx.sentAt, now, tx.minutes, tx.speed) : null
  const ready = !!record?.checkin && record.reaction !== undefined
  const report = reportText([
    'COSMIC RAY 64 · MODO MARTE · SIMULACIÓN EDUCATIVA',
    `Tripulante: ${userText(profileName)}`, `Escenario: ${session.scenario}`, `Fecha de registro: ${record?.date ?? 'Sin registros de hoy'}`,
    record?.checkin ? `Entrada personal: sueño ${record.checkin.sleep} h; ánimo ${record.checkin.mood}/10; estrés ${record.checkin.stress}/10; cansancio ${record.checkin.fatigue}/10.\nNotas del chequeo: ${record.checkin.symptoms ? userText(record.checkin.symptoms) : 'Sin notas'}` : 'Falta el chequeo de hoy.',
    `Prueba de reacción: ${record?.reaction !== undefined ? `${record.reaction} ms, medida con clic` : 'Pendiente'}`,
    `Señales orientativas contra referencia personal: ${ready ? alerts.join('; ') || 'Sin señales destacadas' : 'Completar registros antes de interpretar'}`,
    `Coordinación completada: ${session.tasks.filter(Boolean).length}/3`, `Bitácora: ${session.notes ? userText(session.notes) : 'Sin notas'}`,
    `Latencia elegida: ${session.minutes} min por trayecto. Velocidad: ×${session.speed}.`,
    'Sin envío real, sensores ni diagnóstico. La respuesta de Tierra es un guion fijo. No determina aptitud para EVA.',
    'Contexto NASA: https://ntrs.nasa.gov/citations/20250000703',
  ].join('\n'))
  const send = () => {
    setNow(Date.now())
    setSession(s => ({ ...s, transmission: { sentAt: Date.now(), minutes: s.minutes, speed: s.speed, report, scenario: s.scenario } }))
    onNotice('Envío simulado iniciado. No se transmitieron datos a ningún servicio.')
  }
  const patch = (value: Partial<Session>) => setSession(s => ({ ...s, ...value }))
  return view(<section className="mars-layout">
    <div className="panel mars-hero"><div><span className="eyebrow">MARS OPERATIONS · SIMULACIÓN EDUCATIVA</span><h2>La Tierra puede esperar. El registro continúa.</h2><p>Organiza el turno, observa tus registros y prepara un informe mientras simulas la demora de comunicación.</p></div><span className="mars-badge">SIN ENVÍO REAL</span></div>
    {storageError && <p role="alert">{storageError}</p>}
    <div className="mars-grid">
      <div className="panel mars-card"><span className="eyebrow">01 · PREPARAR MISIÓN</span><h3>Contexto del turno</h3><label>Escenario<select value={session.scenario} onChange={e => patch({ scenario: e.target.value })}><option>Jornada normal</option><option>Cambio de turno</option><option>Preparación de EVA</option></select></label><p>{session.scenario === 'Preparación de EVA' ? 'Documenta preparación y coordinación. Estos resultados no autorizan una caminata espacial.' : session.scenario === 'Cambio de turno' ? 'Deja un registro claro para quien recibe el siguiente turno.' : 'Completa los registros y documenta lo que cambió durante la jornada.'}</p><div className="mars-actions"><button className="outline-button" onClick={onCheckin}>{record?.checkin ? '✓ Revisar chequeo' : '1. Completar chequeo'}</button><button className="outline-button" onClick={onReaction}>{record?.reaction !== undefined ? `✓ Reacción: ${record.reaction} ms` : '2. Medir reacción'}</button></div><p className="mars-caption">Registros por tripulante y fecha, guardados en este navegador. No se sincronizan entre dispositivos.</p></div>
      <div className="panel mars-card"><span className="eyebrow">02 · ENLACE CON TIERRA</span><h3>Comunicación con demora</h3><div className="mars-controls"><label>Minutos por trayecto<select value={session.minutes} disabled={!!status && !status.complete} onChange={e => patch({ minutes: Number(e.target.value) })}>{[4, 10, 20, 22].map(n => <option key={n} value={n}>{n} minutos</option>)}</select></label><label>Reloj de simulación<select value={session.speed} disabled={!!status && !status.complete} onChange={e => patch({ speed: Number(e.target.value) })}><option value={120}>Demo acelerada ×120</option><option value={1}>Tiempo real ×1</option></select></label></div><p>{session.minutes * 2} minutos simulados de ida y vuelta{session.speed === 120 ? ` en ${session.minutes} segundos reales` : ''}. Se supone respuesta inmediata del guion al llegar a Tierra.</p><button className="primary-button" disabled={!ready || (!!status && !status.complete)} onClick={send}>{status && !status.complete ? 'Simulación en curso' : tx ? 'Simular nuevo envío' : 'Simular envío a Tierra'}</button>{!ready && <p className="mars-caption">Completa el chequeo y la prueba de hoy para habilitar el envío.</p>}
      {status && <div className="mars-link"><strong role="status">{status.stage}</strong><progress aria-label="Avance de comunicación simulada" value={status.progress} max={100}/><span>{Math.floor(status.remaining / 60)}:{String(status.remaining % 60).padStart(2, '0')} reales restantes · ×{tx!.speed}</span>{status.complete && <p><b>Respuesta de guion — {tx!.scenario}:</b> Informe recibido en esta simulación. Mantén la bitácora al día y entrega las observaciones al responsable del turno. Este mensaje no interpreta resultados ni prescribe atención.</p>}</div>}</div>
      <div className="panel mars-card"><span className="eyebrow">03 · AUTONOMÍA A BORDO</span><h3>Coordinar durante la espera</h3>{['Identificar al responsable del turno y confirmar el relevo.', 'Revisar la documentación y los recursos asignados a la tarea.', 'Registrar observaciones y preparar la siguiente actualización.'].map((task, i) => <label className="check-row" key={task}><input type="checkbox" checked={session.tasks[i]} onChange={() => patch({ tasks: session.tasks.map((v, index) => index === i ? !v : v) })}/><span>{task}</span></label>)}<label>Bitácora del turno<textarea maxLength={4000} value={session.notes} onChange={e => patch({ notes: e.target.value })} placeholder="Responsables, tareas y observaciones…"/></label></div>
      <div className="panel mars-card"><span className="eyebrow">04 · INFORME TRAZABLE</span><h3>Resumen para Tierra</h3><pre className="mars-report">{report}</pre><div className="mars-actions"><button className="outline-button" onClick={() => downloadText(`informe-marte-${profileId}.txt`, report)}>Descargar informe actual</button>{tx && <button className="outline-button" onClick={() => downloadText(`envio-simulado-${profileId}.txt`, tx.report)}>Descargar copia del envío</button>}</div></div>
    </div>
    <div className="panel mars-card"><span className="eyebrow">HISTORIAL PERSONAL · {profileName}</span><h3>Registros por fecha</h3>{history.length ? <div className="history-scroll"><table className="history-table"><caption>Entradas personales y reacción medida; “—” significa dato pendiente.</caption><thead><tr><th>Fecha</th><th>Sueño</th><th>Ánimo</th><th>Estrés</th><th>Cansancio</th><th>Reacción</th></tr></thead><tbody>{[...history].reverse().map(r => <tr key={r.date}><th scope="row">{r.date}</th><td>{r.checkin ? `${r.checkin.sleep} h` : '—'}</td><td>{r.checkin?.mood ?? '—'}</td><td>{r.checkin?.stress ?? '—'}</td><td>{r.checkin?.fatigue ?? '—'}</td><td>{r.reaction !== undefined ? `${r.reaction} ms` : '—'}</td></tr>)}</tbody></table></div> : <p>Todavía no hay registros personales para este tripulante.</p>}</div>
    <details className="source-details"><summary>Fuente y límites</summary><h3>¿Por qué simular una demora?</h3><p>NASA estudia cómo los retrasos de comunicación afectan las operaciones más allá de la órbita terrestre; su revisión describe hasta 44 minutos de ida y vuelta para Marte. Aquí eliges una latencia ilustrativa: no se calcula la posición actual de los planetas.</p><a href="https://ntrs.nasa.gov/citations/20250000703" target="_blank" rel="noreferrer">Consultar investigación de NASA ↗</a><p className="mars-caption">Referencia de investigación, no dataset integrado ni respaldo de NASA. La simulación funciona en el navegador una vez cargada; esta versión no instala una copia offline de la web.</p></details>
  </section>)
}
