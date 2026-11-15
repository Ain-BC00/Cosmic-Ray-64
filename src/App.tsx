import { useLanguage, LanguagePicker } from './i18n'
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { CheckinValues, DailyRecord, localDate, readHistory, upsertRecord, validCheckin, nextStep, assessWellbeing } from './mission'
import { TurnBrief, readTurnContext, reviewedPlan } from './TurnBrief'
import { Vitals } from './Vitals'
import { EmergencyMode } from './EmergencyMode'
import { filterDates } from './records'
import { MarsMode } from './MarsMode'
import { ExitReadiness } from './ExitReadiness'
const TrendExplorer = lazy(() => import('./TrendExplorer'))

export type MetricKey = 'sleep' | 'mood' | 'stress' | 'fatigue' | 'reaction'
export type Day = { day: string; sleep: number; mood: number; stress: number; fatigue: number; reaction: number; pulse: number; oxygen: number; temperature: number }
type Profile = { id: string; name: string; role: string; initials: string; status: string; accent: string; days: Day[] }

const makeDays = (values: Omit<Day, 'day'>[]): Day[] => values.map((item, index) => ({ ...item, day: `Día ${index + 1}` }))
const profiles: Profile[] = [
  { id: 'luna', name: 'Luna García', role: 'Comandante · Registro local', initials: 'LG', status: 'En observación', accent: '#74e0c3', days: makeDays([
    { sleep: 8.1, mood: 8, stress: 2, fatigue: 2, reaction: 284, pulse: 62, oxygen: 98, temperature: 36.6 },
    { sleep: 7.7, mood: 8, stress: 3, fatigue: 3, reaction: 291, pulse: 64, oxygen: 98, temperature: 36.5 },
    { sleep: 7.3, mood: 7, stress: 4, fatigue: 4, reaction: 305, pulse: 66, oxygen: 97, temperature: 36.7 },
    { sleep: 6.2, mood: 6, stress: 6, fatigue: 6, reaction: 342, pulse: 72, oxygen: 97, temperature: 36.8 },
    { sleep: 6.5, mood: 6, stress: 6, fatigue: 7, reaction: 359, pulse: 75, oxygen: 96, temperature: 36.9 },
    { sleep: 7.0, mood: 7, stress: 5, fatigue: 5, reaction: 331, pulse: 70, oxygen: 97, temperature: 36.7 },
    { sleep: 7.4, mood: 7, stress: 4, fatigue: 4, reaction: 312, pulse: 67, oxygen: 98, temperature: 36.6 },
  ]) },
  { id: 'marco', name: 'Marco Chen', role: 'Especialista · Registro local', initials: 'MC', status: 'Estable', accent: '#ffb86b', days: makeDays([
    { sleep: 7.8, mood: 8, stress: 3, fatigue: 2, reaction: 276, pulse: 60, oxygen: 99, temperature: 36.5 },
    { sleep: 8.0, mood: 8, stress: 2, fatigue: 2, reaction: 270, pulse: 61, oxygen: 99, temperature: 36.5 },
    { sleep: 7.6, mood: 7, stress: 3, fatigue: 3, reaction: 282, pulse: 63, oxygen: 98, temperature: 36.6 },
    { sleep: 7.9, mood: 8, stress: 2, fatigue: 2, reaction: 275, pulse: 61, oxygen: 99, temperature: 36.5 },
    { sleep: 8.2, mood: 9, stress: 2, fatigue: 2, reaction: 268, pulse: 60, oxygen: 99, temperature: 36.4 },
    { sleep: 7.5, mood: 8, stress: 3, fatigue: 3, reaction: 280, pulse: 62, oxygen: 98, temperature: 36.5 },
    { sleep: 7.7, mood: 8, stress: 3, fatigue: 3, reaction: 278, pulse: 62, oxygen: 98, temperature: 36.5 },
  ]) },
  { id: 'amina', name: 'Amina Okafor', role: 'Ingeniera de vuelo', initials: 'AO', status: 'Estable', accent: '#c3a0ff', days: makeDays([
    { sleep: 7.4, mood: 8, stress: 3, fatigue: 3, reaction: 289, pulse: 63, oxygen: 98, temperature: 36.6 },
    { sleep: 7.1, mood: 7, stress: 4, fatigue: 4, reaction: 297, pulse: 65, oxygen: 98, temperature: 36.6 },
    { sleep: 7.6, mood: 8, stress: 3, fatigue: 3, reaction: 286, pulse: 64, oxygen: 99, temperature: 36.5 },
    { sleep: 7.8, mood: 8, stress: 2, fatigue: 2, reaction: 280, pulse: 62, oxygen: 99, temperature: 36.5 },
    { sleep: 7.3, mood: 7, stress: 4, fatigue: 4, reaction: 294, pulse: 66, oxygen: 98, temperature: 36.6 },
    { sleep: 7.5, mood: 8, stress: 3, fatigue: 3, reaction: 288, pulse: 63, oxygen: 98, temperature: 36.5 },
    { sleep: 7.7, mood: 8, stress: 3, fatigue: 3, reaction: 284, pulse: 62, oxygen: 99, temperature: 36.5 },
  ]) },
  { id: 'diego', name: 'Diego Morales', role: 'Médico de misión', initials: 'DM', status: 'Estable', accent: '#79b9ed', days: makeDays([
    { sleep: 8.0, mood: 8, stress: 2, fatigue: 2, reaction: 272, pulse: 59, oxygen: 99, temperature: 36.4 },
    { sleep: 7.8, mood: 8, stress: 3, fatigue: 2, reaction: 279, pulse: 61, oxygen: 99, temperature: 36.5 },
    { sleep: 7.9, mood: 9, stress: 2, fatigue: 2, reaction: 268, pulse: 60, oxygen: 99, temperature: 36.4 },
    { sleep: 7.6, mood: 8, stress: 3, fatigue: 3, reaction: 281, pulse: 62, oxygen: 98, temperature: 36.5 },
    { sleep: 8.1, mood: 8, stress: 2, fatigue: 2, reaction: 270, pulse: 59, oxygen: 99, temperature: 36.4 },
    { sleep: 7.7, mood: 8, stress: 3, fatigue: 3, reaction: 276, pulse: 61, oxygen: 98, temperature: 36.5 },
    { sleep: 7.9, mood: 8, stress: 2, fatigue: 2, reaction: 273, pulse: 60, oxygen: 99, temperature: 36.4 },
  ]) },
  { id: 'sofia', name: 'Sofía Petrov', role: 'Científica de misión', initials: 'SP', status: 'En observación', accent: '#f58fa8', days: makeDays([
    { sleep: 7.2, mood: 7, stress: 4, fatigue: 4, reaction: 301, pulse: 66, oxygen: 98, temperature: 36.6 },
    { sleep: 6.8, mood: 6, stress: 5, fatigue: 5, reaction: 315, pulse: 69, oxygen: 97, temperature: 36.7 },
    { sleep: 6.5, mood: 6, stress: 6, fatigue: 6, reaction: 328, pulse: 71, oxygen: 97, temperature: 36.8 },
    { sleep: 7.0, mood: 7, stress: 5, fatigue: 5, reaction: 317, pulse: 69, oxygen: 98, temperature: 36.7 },
    { sleep: 7.4, mood: 7, stress: 4, fatigue: 4, reaction: 306, pulse: 66, oxygen: 98, temperature: 36.6 },
    { sleep: 7.6, mood: 8, stress: 3, fatigue: 3, reaction: 294, pulse: 64, oxygen: 98, temperature: 36.5 },
    { sleep: 7.5, mood: 8, stress: 3, fatigue: 3, reaction: 290, pulse: 63, oxygen: 99, temperature: 36.5 },
  ]) },
  { id: 'local', name: 'Tripulante local', role: 'Perfil personal local', initials: 'TL', status: 'Sin estado clínico', accent: '#74e0c3', days: [] },
]

const avg = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length
export type MissionEvent = { day: string; label: string; detail: string }
type Scenario = { id: string; name: string; phase: string; comms: string; evacuation: string; autonomy: string; focus: string; hazards: { name: string; level: 'Alto' | 'Medio' | 'Base'; detail: string; signals: string }[] }
const scenarios: Scenario[] = [
  { id: 'leo', name: 'Órbita terrestre', phase: 'Operación cercana a la Tierra', comms: 'Casi inmediata', evacuation: 'Disponible en horas', autonomy: 'Baja', focus: 'Monitoreo rutinario', hazards: [{ name: 'Radiación espacial', level: 'Medio', detail: 'Registrar exposición y eventos solares cuando existan datos.', signals: 'Exposición, procedencia del dato' }, { name: 'Aislamiento y confinamiento', level: 'Medio', detail: 'Observar sueño, ánimo y cooperación.', signals: 'Sueño, ánimo, estrés' }, { name: 'Distancia de la Tierra', level: 'Base', detail: 'El apoyo de Tierra está disponible con poca demora.', signals: 'Estado de comunicación' }, { name: 'Campos de gravedad', level: 'Medio', detail: 'Observar adaptación, equilibrio y ejercicio.', signals: 'Mareo, coordinación, ejercicio' }, { name: 'Entorno hostil/cerrado', level: 'Medio', detail: 'Revisar ambiente y calidad del descanso.', signals: 'CO₂, ruido, luz, temperatura' }] },
  { id: 'lunar', name: 'Tránsito y superficie lunar', phase: 'Misión lunar', comms: 'Corta, con posibles interrupciones', evacuation: 'Limitada; depende de la fase', autonomy: 'Media', focus: 'Preparación para EVA y retorno', hazards: [{ name: 'Radiación espacial', level: 'Alto', detail: 'El escenario requiere registrar exposición y refugio disponible.', signals: 'Exposición, refugio, evento solar' }, { name: 'Aislamiento y confinamiento', level: 'Medio', detail: 'El descanso y la coordinación sostienen tareas de superficie.', signals: 'Sueño, ánimo, comunicación' }, { name: 'Distancia de la Tierra', level: 'Medio', detail: 'Mantener procedimientos y resúmenes locales.', signals: 'Latencia, mensajes pendientes' }, { name: 'Campos de gravedad', level: 'Alto', detail: 'La gravedad parcial puede afectar equilibrio y carga física.', signals: 'Coordinación, fatiga, ejercicio' }, { name: 'Entorno hostil/cerrado', level: 'Alto', detail: 'Traje, polvo, presión y soporte vital requieren seguimiento.', signals: 'EVA, presión, oxígeno, CO₂' }] },
  { id: 'mars', name: 'Tránsito a Marte', phase: 'Misión profunda · mitad de trayecto', comms: 'Retraso prolongado', evacuation: 'No disponible', autonomy: 'Alta', focus: 'Respuesta independiente de la Tierra', hazards: [{ name: 'Radiación espacial', level: 'Alto', detail: 'Registrar contexto de exposición y mantener trazabilidad del dato.', signals: 'Exposición, evento solar, refugio' }, { name: 'Aislamiento y confinamiento', level: 'Alto', detail: 'Vigilar sueño, estrés, ánimo y coordinación del equipo.', signals: 'Sueño, estrés, ánimo, equipo' }, { name: 'Distancia de la Tierra', level: 'Alto', detail: 'La tripulación debe poder actuar mientras llega una respuesta.', signals: 'Latencia, autonomía, procedimientos' }, { name: 'Campos de gravedad', level: 'Medio', detail: 'Mantener preparación física y observar coordinación.', signals: 'Ejercicio, equilibrio, fatiga' }, { name: 'Entorno hostil/cerrado', level: 'Alto', detail: 'Los recursos son limitados y el ambiente afecta la habitabilidad.', signals: 'CO₂, oxígeno, temperatura, ruido' }] },
  { id: 'eva', name: 'Caminata espacial', phase: 'Actividad extravehicular', comms: 'Dependiente del enlace y del traje', evacuation: 'Retorno al vehículo', autonomy: 'Alta', focus: 'Seguridad de tarea y compañero', hazards: [{ name: 'Radiación espacial', level: 'Alto', detail: 'Registrar exposición durante la actividad.', signals: 'Exposición y duración' }, { name: 'Aislamiento y confinamiento', level: 'Medio', detail: 'La coordinación entre dos personas es crítica.', signals: 'Comunicación, carga de trabajo' }, { name: 'Distancia de la Tierra', level: 'Medio', detail: 'Usar el procedimiento local si el enlace falla.', signals: 'Estado del enlace, checklist' }, { name: 'Campos de gravedad', level: 'Alto', detail: 'El traje aumenta la carga física y reduce la movilidad.', signals: 'Fatiga, esfuerzo, coordinación' }, { name: 'Entorno hostil/cerrado', level: 'Alto', detail: 'La presión, oxígeno y soporte vital son esenciales.', signals: 'Presión, oxígeno, alarmas del traje' }] },
]

function App() {
  const { view } = useLanguage()
  const [profileId, setProfileId] = useState('local')
  const [tab, setTab] = useState<'resumen' | 'checkin' | 'cognicion' | 'signos' | 'riesgos' | 'emergencia' | 'marte' | 'salida'>('resumen')
  const [scenarioId, setScenarioId] = useState('mars')
  const [metric, setMetric] = useState<MetricKey>('sleep')
  const [chartSource, setChartSource] = useState<'personal' | 'example'>('personal')
  const [chartPeriod, setChartPeriod] = useState<'7' | '30' | 'all'>('7')
  const [selectedEvent, setSelectedEvent] = useState<MissionEvent | null>(null)
  const [showTurn, setShowTurn] = useState(false)
  const [notice, setNotice] = useState('')
  const [history, setHistory] = useState<DailyRecord[]>(readHistory)
  const [today, setToday] = useState(localDate)
  const persistRecord = (patch: Partial<Pick<DailyRecord, 'checkin' | 'reaction'>>) => {
    if (profileId !== 'local') { setNotice('Modo simulación: no se guardaron datos personales.'); return false }
    try {
      const next = upsertRecord(readHistory(), profileId, localDate(), patch)
      localStorage.setItem('cosmic-daily-v1', JSON.stringify(next))
      setHistory(next); setToday(localDate()); setNotice('Registro guardado por tripulante y fecha'); return true
    } catch { setNotice('No se pudo guardar: revisa el almacenamiento del navegador'); return false }
  }
  const [reactionRunning, setReactionRunning] = useState(false)
  const [reactionReady, setReactionReady] = useState(false)
  const [reactionFalseStart, setReactionFalseStart] = useState(false)
  const [reactionResult, setReactionResult] = useState<number | null>(null)
  const reactionStartRef = useRef<number | null>(null)
  const reactionTimerRef = useRef<number | null>(null)
  const profile = profiles.find((item) => item.id === profileId) ?? profiles[0]
  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[2]
  const ownRecords = profile.id === 'local' ? history.filter(r => r.profileId === profile.id) : []
  const todayRecord = ownRecords.find(r => r.date === today)
  const demoCurrent: Day = profile.days[profile.days.length - 1] ?? { day: today, sleep: NaN, mood: NaN, stress: NaN, fatigue: NaN, reaction: NaN, pulse: NaN, oxygen: NaN, temperature: NaN }
  const current = { ...demoCurrent, ...todayRecord?.checkin, reaction: todayRecord?.reaction ?? demoCurrent.reaction }
  const turnContext = readTurnContext(profileId)
  const nextAction = nextStep(!!todayRecord?.checkin, todayRecord?.reaction !== undefined, turnContext.plans.some(plan => reviewedPlan(plan, today)))
  const hasReaction = todayRecord?.reaction !== undefined
  useEffect(() => {
    const timer = window.setInterval(() => setToday(localDate()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    if (reactionTimerRef.current) window.clearTimeout(reactionTimerRef.current)
    setReactionRunning(false); setReactionReady(false); setReactionFalseStart(false); setReactionResult(null)
  }, [profileId])
  const baseline = useMemo(() => {
    const prior = ownRecords.filter(r => r.date < today)
    return Object.fromEntries((['sleep', 'mood', 'stress', 'fatigue', 'reaction'] as MetricKey[]).map(key => {
      const values = prior.map(r => key === 'reaction' ? r.reaction : r.checkin?.[key]).filter((v): v is number => typeof v === 'number' && Number.isFinite(v))
      return [key, values.length >= 3 ? avg(values.slice(0, 3)) : NaN]
    })) as Record<MetricKey, number>
  }, [history, profileId, today])
  const hasBaseline = Object.values(baseline).every(Number.isFinite)
  const personalAssessment = assessWellbeing(current, baseline, !!todayRecord?.checkin, hasReaction)
  const alerts = personalAssessment.alerts
  const isExample = profile.id !== 'local' || chartSource === 'example'
  const exampleBaseline = Object.fromEntries((['sleep', 'mood', 'stress', 'fatigue', 'reaction'] as MetricKey[]).map(key => [key, avg(profile.days.slice(0, 3).map(day => day[key]))])) as Record<MetricKey, number>
  const summaryCurrent = isExample ? demoCurrent : current
  const summaryAssessment = isExample ? assessWellbeing(demoCurrent, exampleBaseline, true, true) : personalAssessment
  const summaryAlerts = summaryAssessment.alerts
  const summaryScore = summaryAssessment.score

  useEffect(() => { localStorage.setItem('cosmic-profile', profileId) }, [profileId])
  useEffect(() => { if (notice) { const timer = setTimeout(() => setNotice(''), 3500); return () => clearTimeout(timer) } }, [notice])
  useEffect(() => () => { if (reactionTimerRef.current) window.clearTimeout(reactionTimerRef.current) }, [])
  const recordedDays: Day[] = ownRecords.filter(r => r.checkin || r.reaction !== undefined).map(r => ({ ...demoCurrent, ...r.checkin, day: r.date, reaction: r.reaction ?? NaN, ...(!r.checkin ? { sleep: NaN, mood: NaN, stress: NaN, fatigue: NaN } : {}) }))
  const visibleDays = chartSource === 'example' ? profile.days : filterDates(ownRecords, chartPeriod, today).map(r => recordedDays.find(d => d.day === r.date)!).filter(Boolean)
  const currentBaseline = chartSource === 'example' ? avg(profile.days.slice(0, 3).map(d => d[metric])) : baseline[metric]
  const chartData = visibleDays.map((day, index, data) => ({ ...day, baseline: Number.isFinite(currentBaseline) ? currentBaseline : NaN, movingAverage: avg(data.slice(Math.max(0, index - 2), index + 1).map((item) => item[metric]).filter(Number.isFinite)) }))
  const runReaction = () => { if (reactionTimerRef.current) window.clearTimeout(reactionTimerRef.current); setReactionRunning(true); setReactionReady(false); setReactionFalseStart(false); setReactionResult(null); const delay = 2000 + Math.floor(Math.random() * 3000); reactionTimerRef.current = window.setTimeout(() => { reactionStartRef.current = performance.now(); setReactionReady(true) }, delay) }
  const handleReactionPress = () => { if (!reactionRunning) return; if (!reactionReady) { if (reactionTimerRef.current) window.clearTimeout(reactionTimerRef.current); setReactionRunning(false); setReactionFalseStart(true); setNotice('Respuesta anticipada: inicia otra vez y espera la señal verde'); return } const result = Math.round(performance.now() - (reactionStartRef.current ?? performance.now())); setReactionResult(result); setReactionRunning(false); setReactionReady(false); reactionStartRef.current = null; persistRecord({ reaction: result }) }


  return view(<div className="app-shell">
    <aside className="sidebar" inert={showTurn}>
      <div className="brand"><span className="brand-mark">✦</span><div><strong>COSMIC RAY</strong><small>HEALTH CONSOLE · 64</small></div></div>
      <div className="demo-pill"><span /> {tab === 'resumen' && isExample ? 'EJEMPLOS FICTICIOS · SIN GUARDAR' : 'LOCAL · REGISTROS PROPIOS'}</div>
      <nav>{[['resumen', '◈', 'Resumen'], ['checkin', '◷', 'Chequeo diario'], ['cognicion', '⌁', 'Cognición'], ['signos', '♢', 'Signos vitales'], ['riesgos', '△', 'Riesgos de misión'], ['marte', '↗', 'Modo Marte'], ['salida', '☀', 'Preparar salida'], ['emergencia', '＋', 'Emergencia']].map(([id, icon, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id as typeof tab)}><span>{icon}</span>{label}</button>)}</nav>
      <div className="sidebar-bottom"><div className="connection"><i /> Almacenamiento local activo</div><p>Sin conexión a comunicaciones reales. Esta interfaz apoya la conversación con la tripulación y el personal médico.</p></div>
    </aside>
    <main className="main-content" inert={showTurn}>
      <header className="topbar"><div><span className="eyebrow">MISIÓN · {scenario.name.toUpperCase()}</span><h1>{tab === 'resumen' ? 'Estado de hoy' : tab === 'checkin' ? 'Chequeo diario' : tab === 'cognicion' ? 'Rendimiento cognitivo' : tab === 'signos' ? 'Signos vitales' : tab === 'riesgos' ? 'Riesgos de misión' : tab === 'salida' ? 'Preparación de salida' : tab === 'marte' ? 'Modo Marte' : 'Modo emergencia'}</h1></div><div className="top-actions"><LanguagePicker /><label className="profile-select"><span>TRIPULANTE</span><select value={profileId} onChange={(e) => { const id = e.target.value; setProfileId(id); setChartSource(id === "local" ? "personal" : "example") }}>{profiles.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><div className="avatar" style={{ background: profile.accent }}>{profile.initials}</div></div></header>
      <section className="demo-banner"><span>◉</span><div><strong>Registro local</strong><details><summary>Uso y límites</summary><p>El chequeo y la prueba cognitiva usan tus entradas y mediciones realizadas en esta pantalla. La aplicación no diagnostica ni reemplaza una evaluación médica.</p></details></div><span className="banner-tag">REGISTROS LOCALES</span></section>
      {tab === 'resumen' && <>
        {isExample ? <section className="next-step panel example-summary" role="status"><div><span className="eyebrow">EJEMPLOS FICTICIOS · SOLO PARA MOSTRAR</span><h2>Resumen con datos ficticios</h2><p>Tarjetas, índice, señales y gráfica usan el mismo historial de ejemplo. No se guardan como registros personales. Cambia de tripulante para explorar otros ejemplos.</p></div><button className="outline-button" onClick={() => { setProfileId('local'); setChartSource('personal'); setSelectedEvent(null) }}>Volver a registros personales</button></section> : <section className="next-step panel"><div><span className="eyebrow">TU SIGUIENTE PASO · {profile.name}</span><h2>{nextAction.title}</h2><p>{nextAction.text}</p></div><div className="exit-actions"><button className="primary-button" onClick={() => setTab(nextAction.tab)}>{nextAction.action}</button><button className="outline-button" onClick={() => setShowTurn(true)}>Resumen del turno</button></div></section>}
        <section className="hero-row"><div><span className="eyebrow">{isExample ? 'EJEMPLO FICTICIO' : 'LECTURA INTEGRAL'} · {profile.name}</span><div className="status-line"><span className="status-dot" /> <strong>{!isExample && !todayRecord ? 'Sin registros de hoy' : !isExample && !hasBaseline ? 'Construyendo tu referencia' : summaryAlerts.length ? 'Observar evolución' : 'Dentro de tu rango habitual'}</strong></div><p className="hero-copy">{isExample ? `Día final del historial ficticio: ${demoCurrent.day}. Referencia: primeros tres días del ejemplo. Índice ilustrativo, no un porcentaje de salud.` : `Registros de ${today}. ${todayRecord?.checkin ? 'Chequeo personal guardado.' : 'Falta el chequeo diario.'} ${hasReaction ? 'Reacción medida hoy.' : 'Falta la prueba de reacción de hoy.'}`} {!isExample && (hasBaseline ? 'Referencia: primeros tres registros previos por indicador; índice orientativo.' : 'Referencia personal pendiente: se necesitan al menos tres fechas previas por indicador.')}</p></div><div className="score-card"><span>{isExample ? 'ÍNDICE ILUSTRATIVO · EJEMPLO' : 'ÍNDICE DE BIENESTAR'}</span><strong>{summaryScore ?? '—'}<small>/100</small></strong><div className="score-bar"><i style={{ width: `${summaryScore ?? 0}%` }} /></div><small>{summaryScore === null ? 'Faltan registros o referencia personal' : summaryAlerts.length ? `${summaryAlerts.length} señal${summaryAlerts.length === 1 ? '' : 'es'} para revisar` : 'Patrón estable hoy'}</small></div></section>
        <section className="metric-grid">{[['sleep', 'Sueño', !isExample && !todayRecord?.checkin ? '—' : `${summaryCurrent.sleep} h`, isExample ? 'Dato ficticio de ejemplo' : todayRecord?.checkin ? 'Entrada personal de hoy' : 'Pendiente de registro', 'moon'], ['mood', 'Ánimo', !isExample && !todayRecord?.checkin ? '—' : `${summaryCurrent.mood}/10`, isExample ? 'Dato ficticio de ejemplo' : todayRecord?.checkin ? 'Entrada personal de hoy' : 'Pendiente de registro', 'sun'], ['stress', 'Estrés percibido', !isExample && !todayRecord?.checkin ? '—' : `${summaryCurrent.stress}/10`, isExample ? 'Dato ficticio de ejemplo' : todayRecord?.checkin ? 'Entrada personal de hoy' : 'Pendiente de registro', 'bolt'], ['fatigue', 'Cansancio', !isExample && !todayRecord?.checkin ? '—' : `${summaryCurrent.fatigue}/10`, isExample ? 'Dato ficticio de ejemplo' : todayRecord?.checkin ? 'Entrada personal de hoy' : 'Pendiente de registro', 'battery']].map(([key, label, value, sub, icon]) => <button className="metric-card" key={key} onClick={() => { setMetric(key as MetricKey); setTab('resumen') }}><div className={`metric-icon ${icon}`}>{icon === 'moon' ? '☾' : icon === 'sun' ? '☼' : icon === 'bolt' ? 'ϟ' : '▰'}</div><span>{label}</span><strong>{value}</strong><small className={key === 'fatigue' ? 'warn-text' : ''}>{sub}</small></button>)}</section>
        <section className="content-grid"><Suspense fallback={<div className="panel loading-panel" role="status">Cargando gráfica…</div>}><TrendExplorer source={chartSource} setSource={setChartSource} metric={metric} setMetric={setMetric} period={chartPeriod} setPeriod={setChartPeriod} data={chartData} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} /></Suspense><div className="panel alerts-panel"><div className="panel-head"><div><span className="eyebrow">LECTURAS EXPLICABLES</span><h2>{isExample ? 'Señales del ejemplo' : 'Señales de hoy'} <b>{summaryAlerts.length}</b></h2></div><span className="info">i</span></div>{summaryAlerts.length ? summaryAlerts.map((alert) => <div className={`alert ${alert.tone}`} key={alert.title}><div className="alert-icon">{alert.tone === 'amber' ? '!' : 'i'}</div><div><strong>{alert.title}</strong><p>{alert.text}</p></div></div>) : <div className="empty-state"><span>✓</span><strong>Sin señales destacadas</strong><p>Las señales se muestran cuando hay registros y una referencia personal suficiente.</p></div>}<button className="text-button" onClick={() => { setProfileId('local'); setChartSource('personal'); setSelectedEvent(null); setTab('checkin') }}>{isExample ? 'Registrar mis datos personales' : 'Completar chequeo de hoy'} <span>→</span></button></div></section>
      </>}
      {tab === 'checkin' && <Checkin key={`${profileId}-${today}`} initial={todayRecord?.checkin} onDone={values => persistRecord({ checkin: values })} done={!!todayRecord?.checkin} />}
      {tab === 'marte' && <MarsMode key={profileId} profileId={profileId} profileName={profile.name} record={todayRecord} history={ownRecords} alerts={alerts.map(a => a.title)} onCheckin={() => setTab('checkin')} onReaction={() => setTab('cognicion')} onNotice={setNotice} />}
      {tab === 'salida' && <ExitReadiness key={profileId} profileId={profileId} profileName={profile.name} record={todayRecord} personalAlerts={alerts.map(a => a.title)} onCheckin={() => setTab('checkin')} onReaction={() => setTab('cognicion')} />}
      {tab === 'cognicion' && <section className="single-column"><div className="panel cognitive-card"><span className="eyebrow">PRUEBA BREVE · ATENCIÓN</span><h2>Tiempo de reacción</h2><p>Presiona “Iniciar prueba”, espera el cambio a verde y toca el círculo lo más rápido posible. Una pulsación antes de la señal se marca como respuesta anticipada.</p><button type="button" aria-label="Responder a la señal de reacción" className={`reaction-target ${reactionRunning && !reactionReady ? 'waiting' : reactionReady ? 'ready' : reactionResult ? 'result' : reactionFalseStart ? 'false-start' : ''}`} onClick={handleReactionPress}>{reactionRunning ? reactionReady ? '¡AHORA!' : 'Espera…' : reactionResult ? `${reactionResult} ms` : reactionFalseStart ? 'Anticipada' : 'Listo'}</button><button className="primary-button" onClick={runReaction} disabled={reactionRunning}>{reactionRunning ? 'Midiendo…' : reactionResult || reactionFalseStart ? 'Repetir prueba' : 'Iniciar prueba'}</button>{reactionResult && <div className="result-note">Tiempo medido con tu clic y guardado localmente. {Number.isFinite(baseline.reaction) ? `Referencia personal: ${Math.round(baseline.reaction)} ms.` : 'Referencia personal pendiente.'}</div>}{reactionFalseStart && <div className="result-note warn-text">No se guardó un resultado: espera la señal verde.</div>}</div></section>}
      {tab === 'signos' && <Vitals key={`${profileId}-${today}`} profileId={profileId} profileName={profile.name} date={today} onNotice={setNotice} />}
      {tab === 'riesgos' && <MissionRisks scenario={scenario} scenarioId={scenarioId} setScenarioId={setScenarioId} />}
      {tab === 'emergencia' && <EmergencyMode key={profileId} profileId={profileId} profileName={profile.name} scenarioName={scenario.name} crew={profiles} onNotice={setNotice} />}
    </main>
    {showTurn && <TurnBrief key={`${profileId}-${today}`} profileId={profileId} profileName={profile.name} date={today} record={todayRecord} alerts={alerts.map(a => a.title)} onClose={() => setShowTurn(false)} onNotice={setNotice} />}
    {notice && <div className="toast" role="status">✓ {notice}</div>}
  </div>)
}

function Checkin({ onDone, done, initial }: { onDone: (values: CheckinValues) => boolean; done: boolean; initial?: CheckinValues }) { const { view } = useLanguage(); const [values, setValues] = useState<CheckinValues>(initial ?? { sleep: 7, mood: 7, stress: 4, fatigue: 4, symptoms: '' }); const [dirty, setDirty] = useState(false); const [error, setError] = useState(''); const set = (key: string, value: string | number) => { setValues((old) => ({ ...old, [key]: value })); setDirty(true); setError('') }; const save = () => { if (!validCheckin(values)) { setError('Ingresa sueño de 0 a 14 horas y escalas de 0 a 10.'); return } if (onDone(values)) { setError(''); setDirty(false) } else setError('No se pudo guardar. Revisa el almacenamiento del navegador.') }; return view(<section className="single-column"><form className="panel form-panel" onSubmit={e => { e.preventDefault(); save() }} noValidate><div className="panel-head"><div><span className="eyebrow">3 MINUTOS · REGISTRO LOCAL</span><h2>¿Cómo estás hoy?</h2></div><span className="saved-badge" role="status">{dirty ? 'Cambios sin guardar' : done ? '✓ Guardado' : 'Sin registro de hoy'}</span></div><p className="form-intro">Responde según cómo te sientes ahora. No hay respuestas correctas.</p><div className="form-grid"><label>Horas de sueño<input type="number" min="0" max="14" step="0.5" value={Number.isNaN(values.sleep) ? '' : values.sleep} onChange={(e) => set('sleep', e.target.value === '' ? NaN : Number(e.target.value))} /><small>Incluye despertares largos.</small></label><Range label="Ánimo" value={values.mood} onChange={(v) => set('mood', v)} low="Bajo" high="Muy bien" /><Range label="Estrés" value={values.stress} onChange={(v) => set('stress', v)} low="Bajo" high="Alto" /><Range label="Cansancio" value={values.fatigue} onChange={(v) => set('fatigue', v)} low="Nada" high="Mucho" /></div><label className="full-label">Síntomas o notas opcionales<textarea value={values.symptoms} onChange={(e) => set('symptoms', e.target.value)} placeholder="Escribe algo que quieras comentar con la tripulación…" /></label><p role="alert">{error}</p><button type="submit" className="primary-button">Guardar chequeo local</button></form></section>) }
function Range({ label, value, onChange, low, high }: { label: string; value: number; onChange: (v: number) => void; low: string; high: string }) { const { view } = useLanguage(); return view(<label>{label}<div className="range-value"><strong>{value}</strong><span>/10</span></div><input type="range" min="0" max="10" value={value} onChange={(e) => onChange(Number(e.target.value))} /><small>{low}<span>{high}</span></small></label>) }
function MissionRisks({ scenario, scenarioId, setScenarioId }: { scenario: Scenario; scenarioId: string; setScenarioId: (id: string) => void }) { const { view } = useLanguage(); return view(<section className="mission-space"><div className="panel scenario-hero"><div><span className="eyebrow">MISSION SCENARIO LAB · CONTEXTO, NO DIAGNÓSTICO</span><h2>¿Qué cambia en este entorno?</h2><p>Selecciona una fase de misión para ver qué riesgos requieren más observación y qué datos pueden ayudar a la tripulación.</p></div><select value={scenarioId} onChange={(e) => setScenarioId(e.target.value)}>{scenarios.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></div><div className="mission-context"><div><span>FASE</span><strong>{scenario.phase}</strong></div><div><span>COMUNICACIÓN</span><strong>{scenario.comms}</strong></div><div><span>EVACUACIÓN</span><strong>{scenario.evacuation}</strong></div><div><span>AUTONOMÍA</span><strong>{scenario.autonomy}</strong></div></div><div className="mission-focus"><span className="eyebrow">PRIORIDAD DE ESTE ESCENARIO</span><strong>{scenario.focus}</strong><p>Estos niveles son una guía educativa de contexto. No representan el riesgo médico individual de ningún tripulante.</p></div><div className="risk-grid">{scenario.hazards.map((hazard) => <article className="risk-card" key={hazard.name}><div className="risk-card-top"><span className={`risk-level ${hazard.level.toLowerCase()}`}>{hazard.level}</span><span>↗</span></div><h3>{hazard.name}</h3><p>{hazard.detail}</p><div className="risk-signals"><span>OBSERVAR</span><strong>{hazard.signals}</strong></div></article>)}</div><details className="source-details"><summary>Fuente y límites</summary><p>Los escenarios son una guía educativa, no una evaluación individual ni una autorización de salida.</p><a href="https://www.nasa.gov/stem-content/five-hazards-of-human-spaceflight/" target="_blank" rel="noreferrer">Marco de peligros de NASA ↗ · requiere conexión</a></details></section>) }

export default App
