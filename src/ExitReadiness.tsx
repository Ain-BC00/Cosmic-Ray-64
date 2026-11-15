import { useLanguage } from './i18n'
import { useEffect, useState } from 'react'
import { DailyRecord, downloadText } from './mission'
import { destinations, ExitPlan, freshWeather, historicalEvents, NOAA_URL, parseWeather, planReview, SCALES_URL, validPlan, Weather } from './spaceWeather'

const checklist = ['Equipo y soporte vital revisados según procedimiento.', 'Compañero y responsable de coordinación identificados.', 'Enlace de comunicación y alternativa revisados.', 'Procedimiento y recursos de contingencia disponibles.']
const initialPlans: ExitPlan[] = [
  { name: 'Plan A · salida breve', destination: 'leo', duration: 60, departure: '', responsible: '', comms: 0, checks: [false, false, false, false], decision: '' },
  { name: 'Plan B · salida extendida', destination: 'leo', duration: 120, departure: '', responsible: '', comms: 0, checks: [false, false, false, false], decision: '' },
]
const defaultPlanNames = {
  es: ['Plan A · salida breve', 'Plan B · salida extendida'],
  en: ['Plan A · short EVA', 'Plan B · extended EVA'],
} as const
const defaultChecklist = {
  es: checklist,
  en: ['Equipment and life support checked according to procedure.', 'Partner and coordination lead identified.', 'Primary and backup communication links reviewed.', 'Procedure and contingency resources available.'],
} as const
const destinationLabels = {
  es: destinations,
  en: { leo: 'Earth orbit', moon: 'Lunar surface', mars: 'Mars surface' },
} as const
function displayedPlanName(name: string, index: number, language: 'es' | 'en') {
  return name === defaultPlanNames.es[index] || name === defaultPlanNames.en[index] ? defaultPlanNames[language][index] : name || `Plan ${index + 1}`
}
function loadPlans(key: string): ExitPlan[] {
  try { const data: unknown = JSON.parse(localStorage.getItem(key) || 'null'); return Array.isArray(data) && data.length === 2 && data.every(validPlan) ? data : initialPlans } catch { return initialPlans }
}
function readCache(): Weather | null {
  try {
    const w = JSON.parse(localStorage.getItem('cosmic-weather-v1') || 'null')
    return w && Number.isFinite(Date.parse(w.observedAt)) && Number.isFinite(Date.parse(w.fetchedAt)) && ['s', 'r', 'g'].every(k => w[k] === null || (Number.isInteger(w[k]) && w[k] >= 0 && w[k] <= 5)) ? w : null
  } catch { return null }
}
const formatUTC = (date: string) => `${new Date(date).toLocaleString('es-MX', { timeZone: 'UTC' })} UTC`
export function ExitReadiness({ profileId, profileName, record, personalAlerts, onCheckin, onReaction }: { profileId: string; profileName: string; record?: DailyRecord; personalAlerts: string[]; onCheckin: () => void; onReaction: () => void }) {
  const { language, view, reportText, userText } = useLanguage()
  const key = `cosmic-exit-plans-v1-${profileId}`
  const [plans, setPlans] = useState(() => loadPlans(key))
  const [storageError, setStorageError] = useState('')
  const [weather, setWeather] = useState<Weather | null>(readCache)
  const [verified, setVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [refresh, setRefresh] = useState(0)
  const [mode, setMode] = useState<'live' | 'history'>('live')
  const [frame, setFrame] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    if (!plans.every(validPlan)) { setStorageError('Corrige los campos numéricos para guardar los planes y exportar el informe.'); return }
    try { localStorage.setItem(key, JSON.stringify(plans)); setStorageError('') }
    catch { setStorageError('No se pudieron guardar los planes. Descarga el informe para conservarlos.') }
  }, [key, plans])
  useEffect(() => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 12000)
    let active = true
    setLoading(true); setError(''); setVerified(false)
    fetch(NOAA_URL, { signal: controller.signal, cache: 'no-store' })
      .then(r => { if (!r.ok) throw new Error(`NOAA respondió HTTP ${r.status}`); return r.json() })
      .then(data => {
        const parsed = parseWeather(data)
        if (!active) return
        setWeather(parsed); setVerified(true)
        try { localStorage.setItem('cosmic-weather-v1', JSON.stringify(parsed)) } catch { /* La consulta puede mostrarse sin caché. */ }
      })
      .catch(() => { if (active) setError('No se pudo verificar NOAA. Si hay una copia anterior, se muestra solo como referencia. Reintenta la consulta.') })
      .finally(() => { clearTimeout(timeout); if (active) setLoading(false) })
    return () => { active = false; clearTimeout(timeout); controller.abort() }
  }, [refresh])
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer) }, [])
  useEffect(() => {
    if (!playing || mode !== 'history') return
    if (frame === historicalEvents.length - 1) { setPlaying(false); return }
    const timer = window.setTimeout(() => setFrame(previous => previous + 1), 4000)
    return () => clearTimeout(timer)
  }, [playing, mode, frame])
  const historical = mode === 'history'
  const event = historicalEvents[frame]
  const activeWeather: Weather | null = historical ? { observedAt: event.observedAt, fetchedAt: event.observedAt, s: event.s, r: null, g: null } : weather
  const fresh = verified && freshWeather(weather, now)
  const usable = historical || fresh
  const weatherState = historical ? 'ARCHIVO HISTÓRICO · ENERO 2026' : loading ? 'CONSULTANDO NOAA' : fresh ? 'OBSERVACIÓN RECIENTE · NOAA' : weather ? 'REFERENCIA SIN VIGENCIA VERIFICADA' : 'DATOS NO DISPONIBLES'
  const updatePlan = (index: number, patch: Partial<ExitPlan>) => setPlans(old => old.map((p, i) => i === index ? { ...p, ...patch } : p))
  const reasons = plans.map(p => planReview(p, activeWeather, usable, !!record?.checkin, record?.reaction !== undefined, historical))
  const exportReport = () => {
    const report = reportText([
      'COSMIC RAY 64 · PREPARACIÓN DE SALIDA · APOYO EDUCATIVO', `Generado: ${new Date().toISOString()}`, `Tripulante: ${userText(profileName)}`,
      `Modo: ${weatherState}`, `Fuente: ${historical ? event.source : NOAA_URL}`,
      `Observación: ${activeWeather?.observedAt ?? 'No disponible'}`, `Consulta: ${historical ? 'Archivo de avisos, sin consulta actual' : weather?.fetchedAt ?? 'No disponible'}`,
      `Escalas: S ${activeWeather?.s ?? 'sin datos'}, R ${activeWeather?.r ?? 'sin datos'}, G ${activeWeather?.g ?? 'sin datos'}`,
      `Chequeo: ${record?.checkin ? userText(JSON.stringify(record.checkin)) : 'Pendiente'}`, `Reacción: ${record?.reaction !== undefined ? `${record.reaction} ms` : 'Pendiente'}`,
      `Señales personales contra referencia personal: ${record ? personalAlerts.join('; ') || 'Sin señales destacadas en los datos disponibles' : 'Sin registros personales de hoy'}`,
      ...plans.flatMap((p, i) => [`\n${userText(displayedPlanName(p.name, i, language))}`, `Destino: ${destinationLabels[language][p.destination]}; duración: ${p.duration} min; salida local: ${p.departure || 'Pendiente'}; demora por trayecto: ${p.comms} min`, `Responsable: ${p.responsible || 'Pendiente'}`, ...defaultChecklist[language].map((text, j) => `${p.checks[j] ? '[x]' : '[ ]'} ${text}`), ...reasons[i], `Decisión o notas registradas por el usuario: ${p.decision || 'Pendiente'}`]),
      '\nNo es un pronóstico para la salida, cálculo de dosis ni autorización médica u operativa. No existe envío real ni respaldo de NASA/NOAA.',
    ].join('\n'))
    downloadText(`preparacion-salida-${profileId}.txt`, report)
  }
  return view(<section className="exit-layout">
    <div className="panel exit-hero"><span className="eyebrow">EVA BRIEFING · CLIMA ESPACIAL Y PREPARACIÓN</span><h2>Antes de abrir la escotilla</h2><p>Compara dos planes, revisa el contexto solar y documenta qué falta confirmar. Las observaciones ambientales y tus registros se presentan por separado.</p><div className="exit-switch" role="group" aria-label="Fuente de clima espacial"><button className={mode === 'live' ? 'primary-button' : 'outline-button'} aria-pressed={!historical} onClick={() => { setMode('live'); setPlaying(false) }}>Observación actual</button><button className={historical ? 'primary-button' : 'outline-button'} aria-pressed={historical} onClick={() => setMode('history')}>Reproducir evento histórico</button></div></div>
    <div className="panel exit-weather"><div className="panel-head"><div><span className="eyebrow">{weatherState}</span><h3>{historical ? 'Tormenta solar · 19–20 enero 2026' : 'Entorno espacial observado cerca de la Tierra'}</h3></div>{!historical && <button className="outline-button" disabled={loading} onClick={() => setRefresh(n => n + 1)}>{loading ? 'Consultando…' : 'Actualizar NOAA'}</button>}</div>
      {!historical && error && <p role="alert" className="exit-warning">{error}</p>}
      <div className="weather-scales">{([['s', 'S', 'Radiación solar'], ['r', 'R', 'Perturbaciones de radio'], ['g', 'G', 'Actividad geomagnética']] as const).map(([key, letter, title]) => <article key={key}><span>{title}</span><strong>{activeWeather?.[key] == null ? '—' : `${letter}${activeWeather[key]}`}</strong><small>{activeWeather?.[key] == null ? 'No disponible en esta fuente' : activeWeather[key] === 0 ? 'Sin tormenta en esta escala' : 'Evento observado · revisar contexto'}</small></article>)}</div>
      {historical ? <div className="history-player"><div className="exit-actions"><button className="outline-button" onClick={() => { if (frame === historicalEvents.length - 1) setFrame(0); setPlaying(v => !v) }}>{playing ? 'Pausar reproducción' : 'Reproducir secuencia'}</button><span>Ficha {frame + 1} de {historicalEvents.length} · 4 s por aviso</span></div><label>Avanzar por avisos históricos<input type="range" min={0} max={historicalEvents.length - 1} step={1} value={frame} onChange={e => { setFrame(Number(e.target.value)); setPlaying(false) }}/></label><div className="weather-timeline">{historicalEvents.map((item, i) => <button key={item.label} className={frame === i ? 'selected' : ''} aria-pressed={frame === i} onClick={() => { setFrame(i); setPlaying(false) }}><span>{item.label}</span><strong>S{item.s}</strong></button>)}</div><h4>{event.title}</h4><p>{event.detail}</p><a href={event.source} target="_blank" rel="noreferrer">Abrir aviso original de NOAA ↗</a><p className="mars-caption">Reproducción de tres avisos documentados, sin interpolación. R y G se omiten: estas fichas no contienen observaciones equivalentes. No son las condiciones de hoy.</p></div> : <div className="weather-meta"><p>Observación: <b>{weather ? formatUTC(weather.observedAt) : 'Pendiente'}</b> · Consulta: {weather ? formatUTC(weather.fetchedAt) : 'Pendiente'}</p><p className="mars-caption">Se considera reciente una observación de hasta 30 minutos, como criterio de interfaz. No es una garantía operativa. Pulsa Actualizar para volver a consultar.</p><a href={NOAA_URL} target="_blank" rel="noreferrer">Ver datos originales NOAA ↗</a></div>}
      <p className="exit-warning">S0 no equivale a “espacio seguro”. Las escalas no calculan dosis personal y no describen por sí solas el entorno de la Luna o Marte. R y G tienen significados distintos de S. <a href={SCALES_URL} target="_blank" rel="noreferrer">Consultar las escalas NOAA.</a></p>
    </div>
    <div className="panel mars-card"><span className="eyebrow">TRIPULANTE · {profileName}</span><h3>Preparación personal de hoy</h3><p>{record?.checkin ? `Sueño: ${record.checkin.sleep} h · ánimo: ${record.checkin.mood}/10 · estrés: ${record.checkin.stress}/10 · cansancio: ${record.checkin.fatigue}/10.` : 'Falta guardar el chequeo de hoy.'} {record?.reaction !== undefined ? `Reacción medida: ${record.reaction} ms.` : 'Falta la prueba de reacción de hoy.'}</p>{record && personalAlerts.length > 0 && <ul>{personalAlerts.map(a => <li key={a}>{a}</li>)}</ul>}<p className="mars-caption">Las señales requieren tres fechas previas por indicador para formar una referencia personal. No determinan aptitud médica ni se convierten en una probabilidad de daño.</p><div className="exit-actions"><button className="outline-button" onClick={onCheckin}>Abrir chequeo diario</button><button className="outline-button" onClick={onReaction}>Abrir prueba cognitiva</button></div></div>
    {storageError && <p role="alert">{storageError}</p>}
    <div className="exit-plan-grid">{plans.map((plan, i) => <article className="panel mars-card" key={i}><span className="eyebrow">ALTERNATIVA {i === 0 ? 'A' : 'B'}</span><h3 data-user-content>{displayedPlanName(plan.name, i, language)}</h3><label>Nombre del plan<input maxLength={80} value={displayedPlanName(plan.name, i, language)} onChange={e => updatePlan(i, { name: e.target.value })}/></label><div className="mars-controls"><label>Destino<select value={plan.destination} onChange={e => updatePlan(i, { destination: e.target.value as ExitPlan['destination'] })}>{Object.entries(destinationLabels[language]).map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select></label><label>Duración prevista (min)<input type="number" min={10} max={480} value={Number.isNaN(plan.duration) ? '' : plan.duration} onChange={e => updatePlan(i, { duration: e.target.value === '' ? NaN : Number(e.target.value) })}/></label></div><label>Salida prevista (hora local)<input type="datetime-local" value={plan.departure} onChange={e => updatePlan(i, { departure: e.target.value })}/></label><label>Responsable de revisión<input maxLength={100} value={plan.responsible} onChange={e => updatePlan(i, { responsible: e.target.value })} placeholder="Nombre del responsable"/></label><label>Demora de comunicación por trayecto (min)<input type="number" min={0} max={60} step={0.1} value={Number.isNaN(plan.comms) ? '' : plan.comms} onChange={e => updatePlan(i, { comms: e.target.value === '' ? NaN : Number(e.target.value) })}/></label><h4>Checklist declarado por el usuario</h4>{defaultChecklist[language].map((item, j) => <label className="check-row" key={item}><input type="checkbox" checked={plan.checks[j]} onChange={() => updatePlan(i, { checks: plan.checks.map((v, n) => n === j ? !v : v) })}/><span>{item}</span></label>)}<details className="plan-review"><summary>Qué requiere revisión</summary><ul>{reasons[i].map(reason => <li key={reason}>{reason}</li>)}</ul></details><label>Decisión y observaciones del responsable<textarea maxLength={2000} value={plan.decision} onChange={e => updatePlan(i, { decision: e.target.value })} placeholder="Documenta la revisión humana y los pendientes…"/></label></article>)}</div>
    <div className="panel mars-card"><span className="eyebrow">COMPARACIÓN · MISMA FUENTE AMBIENTAL PARA AMBOS PLANES</span><h3>Qué cambia entre las alternativas</h3><div className="history-scroll"><table className="history-table"><caption>Comparación descriptiva. Una duración menor no demuestra por sí sola menor dosis ni mayor seguridad.</caption><thead><tr><th>Criterio</th>{plans.map((p, i) => <th key={i}>{displayedPlanName(p.name, i, language)}</th>)}</tr></thead><tbody>{[
      ['Destino', ...plans.map(p => destinationLabels[language][p.destination])], ['Duración', ...plans.map(p => `${Number.isFinite(p.duration) ? p.duration : '—'} min`)], ['Salida local', ...plans.map(p => p.departure.replace('T', ' ') || 'Sin definir')], ['Responsable', ...plans.map(p => p.responsible || 'Pendiente')], ['Verificaciones', ...plans.map(p => `${p.checks.filter(Boolean).length}/4 declaradas`)], ['Comunicación ida/vuelta', ...plans.map(p => `${Number.isFinite(p.comms) ? p.comms * 2 : '—'} min (sin tiempo de respuesta humana)`)], ['Aplicabilidad ambiental', ...plans.map(p => p.destination === 'leo' ? 'Contexto terrestre; faltan posición y protección' : 'No extrapolable desde NOAA a este destino')], ['Estado', 'Requiere revisión humana', 'Requiere revisión humana'],
    ].map(([title, a, b]) => <tr key={title}><th scope="row">{title}</th><td>{a}</td><td>{b}</td></tr>)}</tbody></table></div><div className="exit-actions"><button className="primary-button" disabled={!plans.every(validPlan)} onClick={exportReport}>Descargar comparación e informe</button><span className="mars-caption">Guardado por tripulante en este navegador. No se envía a Tierra.</span></div></div>
    <details className="source-details"><summary>Fuente y límites</summary><p>NOAA aporta escalas observadas y los avisos históricos. NASA DONKI permite explorar eventos solares como referencia adicional; en esta versión no se consulta su API.</p><a href="https://ccmc.gsfc.nasa.gov/tools/DONKI/" target="_blank" rel="noreferrer">Explorar NASA DONKI ↗</a><p className="mars-caption">No se pronostica una ventana segura ni se estima una dosis. La salida prevista, la duración, el equipo y las decisiones son entradas del usuario.</p></details>
  </section>)
}
