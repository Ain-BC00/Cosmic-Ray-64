import { useEffect, useState } from 'react'
import { downloadText } from './mission'
import { emptyEmergency, eventSeconds, readEmergency, EmergencyRecord } from './records'
import { useLanguage } from './i18n'

const categories = ['Cardiovascular', 'Respiratory / hypoxia', 'Decompression sickness', 'Neurological', 'Injury / fracture', 'Infection / immune symptoms', 'Eye / vision', 'Acute psychological distress', 'Radiation exposure', 'Pressure / oxygen / CO₂', 'Temperature / contamination', 'Sleep / cognitive impairment', 'Other / unclassified']
const steps = ['Mantén la comunicación con la tripulación y asigna quién coordina.', 'Registra el inicio y describe signos observados, sin interpretarlos.', 'Consulta el procedimiento local aprobado para esta categoría.', 'Confirma los recursos requeridos en el inventario oficial de la misión.', 'Registra observaciones, cambios y hora de cada acción.', 'Prepara el informe para transmisión y conserva la guía local mientras esperas.']
type LocaleText = { es: string; en: string }
type EmergencyGuide = { title: LocaleText; detail: LocaleText; focus: 'chest' | 'head' | 'limb' | 'body' | 'eye' | 'mind' | 'suit' | 'temperature' | 'sleep' }
const focusLabels: Record<EmergencyGuide['focus'], LocaleText> = {
  chest: { es: 'pecho / soporte vital', en: 'chest / life support' },
  head: { es: 'cabeza', en: 'head' },
  limb: { es: 'extremidad', en: 'limb' },
  body: { es: 'cuerpo completo', en: 'full body' },
  eye: { es: 'área ocular', en: 'eye area' },
  mind: { es: 'cabeza / coordinación', en: 'head / coordination' },
  suit: { es: 'traje / entorno', en: 'suit / environment' },
  temperature: { es: 'entorno térmico', en: 'thermal environment' },
  sleep: { es: 'cabeza / rendimiento', en: 'head / performance' },
}
const categoryLabels: Record<string, LocaleText> = {
  'Cardiovascular': { es: 'Cardiovascular', en: 'Cardiovascular' },
  'Respiratory / hypoxia': { es: 'Respiratoria / hipoxia', en: 'Respiratory / hypoxia' },
  'Decompression sickness': { es: 'Enfermedad por descompresión', en: 'Decompression sickness' },
  'Neurological': { es: 'Neurológica', en: 'Neurological' },
  'Injury / fracture': { es: 'Lesión / fractura', en: 'Injury / fracture' },
  'Infection / immune symptoms': { es: 'Infección / síntomas inmunitarios', en: 'Infection / immune symptoms' },
  'Eye / vision': { es: 'Ojos / visión', en: 'Eye / vision' },
  'Acute psychological distress': { es: 'Malestar psicológico agudo', en: 'Acute psychological distress' },
  'Radiation exposure': { es: 'Exposición a radiación', en: 'Radiation exposure' },
  'Pressure / oxygen / CO₂': { es: 'Presión / oxígeno / CO₂', en: 'Pressure / oxygen / CO₂' },
  'Temperature / contamination': { es: 'Temperatura / contaminación', en: 'Temperature / contamination' },
  'Sleep / cognitive impairment': { es: 'Sueño / alteración cognitiva', en: 'Sleep / cognitive impairment' },
  'Other / unclassified': { es: 'Otro / sin clasificar', en: 'Other / unclassified' },
}
const emergencyGuides: Record<string, EmergencyGuide> = {
  'Cardiovascular': { title: { es: 'Observación cardiovascular', en: 'Cardiovascular observation' }, detail: { es: 'El foco en el pecho ayuda a ubicar lo observado y mantener la coordinación, sin diagnosticar.', en: 'The chest focus helps locate what was observed and maintain coordination, without diagnosing.' }, focus: 'chest' },
  'Respiratory / hypoxia': { title: { es: 'Observación respiratoria', en: 'Respiratory observation' }, detail: { es: 'El foco en pecho y soporte vital orienta el registro del entorno y de los signos observados.', en: 'The chest and life-support focus guides recording the environment and observed signs.' }, focus: 'chest' },
  'Decompression sickness': { title: { es: 'Contexto de descompresión', en: 'Decompression context' }, detail: { es: 'El cuerpo completo recuerda conservar la trazabilidad del evento, el tiempo y el entorno.', en: 'The full-body focus helps preserve the event, timing, and environment trace.' }, focus: 'body' },
  'Neurological': { title: { es: 'Observación neurológica', en: 'Neurological observation' }, detail: { es: 'El foco en la cabeza señala la zona de observación, sin interpretar los signos.', en: 'The head focus marks the observation area without interpreting signs.' }, focus: 'head' },
  'Injury / fracture': { title: { es: 'Observación de lesión', en: 'Injury observation' }, detail: { es: 'El foco en la extremidad ayuda a describir ubicación, hora y cambios observados.', en: 'The limb focus helps describe location, timing, and observed changes.' }, focus: 'limb' },
  'Infection / immune symptoms': { title: { es: 'Observación de síntomas', en: 'Symptom observation' }, detail: { es: 'El cuerpo funciona como referencia para registrar evolución y contexto, sin diagnosticar.', en: 'The body is a reference for recording progression and context, without diagnosing.' }, focus: 'body' },
  'Eye / vision': { title: { es: 'Observación visual', en: 'Visual observation' }, detail: { es: 'El foco ocular ayuda a registrar lo observado sin convertirlo en un diagnóstico.', en: 'The eye focus helps record what was observed without turning it into a diagnosis.' }, focus: 'eye' },
  'Acute psychological distress': { title: { es: 'Apoyo y coordinación', en: 'Support and coordination' }, detail: { es: 'El foco en la cabeza recuerda mantener comunicación y asignar acompañamiento.', en: 'The head focus reminds the crew to maintain communication and assign support.' }, focus: 'mind' },
  'Radiation exposure': { title: { es: 'Registro de exposición', en: 'Exposure record' }, detail: { es: 'El traje completo ayuda a conservar hora, contexto y procedencia del evento.', en: 'The full suit helps preserve the event time, context, and source.' }, focus: 'suit' },
  'Pressure / oxygen / CO₂': { title: { es: 'Entorno de soporte vital', en: 'Life-support environment' }, detail: { es: 'El casco y el traje destacan el contexto ambiental que debe quedar registrado.', en: 'The helmet and suit highlight the environmental context to be recorded.' }, focus: 'suit' },
  'Temperature / contamination': { title: { es: 'Entorno y contaminación', en: 'Environment and contamination' }, detail: { es: 'El traje y las líneas de temperatura ayudan a registrar entorno y recursos requeridos.', en: 'The suit and temperature lines help record the environment and required resources.' }, focus: 'temperature' },
  'Sleep / cognitive impairment': { title: { es: 'Observación del rendimiento', en: 'Performance observation' }, detail: { es: 'El foco en la cabeza relaciona el registro con descanso, rendimiento y coordinación.', en: 'The head focus connects the record with rest, performance, and coordination.' }, focus: 'sleep' },
  'Other / unclassified': { title: { es: 'Evento sin clasificar', en: 'Unclassified event' }, detail: { es: 'El cuerpo completo permite documentar el evento sin interpretarlo.', en: 'The full-body view supports documenting the event without interpreting it.' }, focus: 'body' },
}
const outboxKey = 'cosmic-emergency-outbox-v1'
type QueuedReport = { id: string; profileId: string; createdAt: string; status: 'waiting_for_transmission'; report: string }

export function EmergencyMode({ profileId, profileName, scenarioName, crew, onNotice }: { profileId: string; profileName: string; scenarioName: string; crew: { id: string; name: string }[]; onNotice: (message: string) => void }) {
  const { language, view, reportText, userText } = useLanguage()
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
  const reportDescription = record.event ? userText(record.event) : 'Sin descripción'
  const makeReport = () => reportText(['COSMIC RAY 64 · INFORME DE EMERGENCIA', `Tripulante: ${userText(profileName)}`, `Categoría: ${record.category ? categoryLabels[record.category][language] : language === 'en' ? 'Unclassified' : 'Sin clasificar'}`, `Referencia visual: ${guide.title[language]}`, `Zona de observación ilustrada: ${focusLabels[guide.focus][language]}`, `Contexto visual: ${guide.detail[language]}`, `Escenario: ${record.scenarioName}`, `Inicio: ${record.startedAt ? new Date(record.startedAt).toISOString() : 'Pendiente'}`, `Preparado: ${new Date().toISOString()}`, `Descripción: ${reportDescription}`, `Tiempo registrado: ${seconds} s`, ...steps.map((text, i) => `${record.steps[i] ? '[x]' : '[ ]'} ${text}`), ...Object.entries(record.roles).map(([key, id]) => `${key}: ${crew.find(person => person.id === id)?.name ?? 'Sin asignar'}`), `Observaciones: ${userText(record.notes || 'Sin notas')}`, 'Estado: preparado localmente; no transmitido ni entregado.', 'No hay procedimiento clínico aprobado configurado en esta aplicación.'].join('\n'))
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
  const guide = record.category ? emergencyGuides[record.category] ?? emergencyGuides['Other / unclassified'] : emergencyGuides['Other / unclassified']
  return view(<section className="emergency-layout">
    <div className="panel emergency-header"><div><span className="eyebrow">ASISTENCIA LOCAL · {profileName}</span><h2>EMERGENCY ASSISTANCE</h2><p>La guía local no espera una respuesta de Tierra. Esta aplicación no sustituye los protocolos de misión ni al personal médico.</p><span role="status">{active ? 'Registro activo' : record.endedAt ? 'Evento finalizado' : 'Sin iniciar'} · {record.scenarioName}</span></div><div className="event-timer"><span>TIEMPO DEL EVENTO</span><strong>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</strong></div></div>
    <div className="panel emergency-main"><div className="emergency-protocol-warning" role="alert"><strong>Procedimiento aprobado no disponible</strong><p>No hay protocolos clínicos autorizados ni inventario de misión cargados. No se mostrarán instrucciones de tratamiento o dosis. Consulta la documentación médica controlada de la misión y a la autoridad médica disponible.</p></div>
      <label>Categoría<select value={record.category ?? ''} disabled={!!record.endedAt} onChange={e => save({ ...record, category: e.target.value })}><option value="">Selecciona categoría</option>{categories.map(category => <option key={category} value={category}>{categoryLabels[category][language]}</option>)}</select></label>
      {record.category && <EmergencyIllustration guide={guide} language={language} />}
      <label>Signos u observaciones<input placeholder="Describe lo observado, sin diagnosticar" maxLength={500} value={record.event} onChange={e => save({ ...record, event: e.target.value })} disabled={!!record.endedAt}/></label>
      <div className="emergency-actions">{record.startedAt === null && <button className="danger-button" disabled={!record.category} onClick={begin}>Iniciar emergencia</button>}{active && <button className="danger-button" onClick={finish}>Finalizar registro</button>}<button className="outline-button" onClick={queueReport} disabled={!record.startedAt}>Preparar informe para Tierra</button><button className="outline-button" onClick={exportEvent}>Descargar informe</button>{!!record.endedAt && <button className="outline-button" onClick={newEvent}>Archivar y preparar otro evento</button>}</div>
      <p role="status">Mensajes pendientes en este dispositivo: {queueCount}. Estado: esperando transmisión. No existe enlace de comunicaciones configurado.</p>
      <h3>Registro de coordinación</h3>{steps.map((step, i) => <label className="check-row" key={step}><input type="checkbox" checked={record.steps[i]} disabled={!!record.endedAt} onChange={() => save({ ...record, steps: record.steps.map((value, j) => i === j ? !value : value) })}/><span>{step}</span></label>)}
      <label>Notas y tiempos<textarea maxLength={4000} value={record.notes} disabled={!!record.endedAt} onChange={e => save({ ...record, notes: e.target.value })} placeholder="Observaciones registradas por la tripulación"/></label>
    </div><div className="panel emergency-side"><span className="eyebrow">ASIGNACIÓN DE ROLES</span>{([['care', 'Coordinación'], ['comms', 'Comunicaciones'], ['log', 'Registro']] as const).map(([key, label]) => <label key={key}>{label}<select value={record.roles[key]} disabled={!!record.endedAt} onChange={e => save({ ...record, roles: { ...record.roles, [key]: e.target.value } })}><option value="">Sin asignar</option>{crew.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>)}<p>Usa el procedimiento de misión guardado y autorizado. Esta pantalla no inventa acciones clínicas.</p></div><p role="alert" className="form-error">{error}</p>
  </section>)
}

function EmergencyIllustration({ guide, language }: { guide: EmergencyGuide; language: 'es' | 'en' }) {
  const copy = guide.title[language]
  const focus = focusLabels[guide.focus][language]
  return <section className="emergency-illustration" aria-label={`${language === 'en' ? 'Illustrative visual guide' : 'Guía visual ilustrativa'}: ${copy}`}>
    <div className="illustration-copy"><span className="eyebrow">{language === 'en' ? 'VISUAL GUIDE · ILLUSTRATIVE' : 'GUÍA VISUAL · ILUSTRATIVA'}</span><h3>{copy}</h3><p>{guide.detail[language]}</p><div className="illustration-steps"><span><b>1</b> {language === 'en' ? 'Observe' : 'Observar'}</span><span><b>2</b> {language === 'en' ? 'Record' : 'Registrar'}</span><span><b>3</b> {language === 'en' ? 'Coordinate' : 'Coordinar'}</span></div><small>{language === 'en' ? 'Always follow the mission-approved protocol.' : 'Seguir siempre el protocolo autorizado de la misión.'}</small></div>
    <div className={`human-visual focus-${guide.focus}`} aria-hidden="true"><svg viewBox="0 0 220 280" role="presentation"><defs><linearGradient id="suit-fill" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#c7dbef"/></linearGradient><radialGradient id="visor-glow"><stop offset="0" stopColor="#65d9ff" stopOpacity=".8"/><stop offset="1" stopColor="#0a3f92" stopOpacity=".2"/></radialGradient><filter id="holo-glow"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g className="body-orbit"><ellipse cx="110" cy="141" rx="83" ry="123"/><ellipse cx="110" cy="141" rx="92" ry="47" transform="rotate(-18 110 141)"/></g><g className="human-silhouette"><circle className="human-head" cx="110" cy="48" r="27"/><path className="human-neck" d="M96 70h28v17H96z"/><path className="human-body" d="M73 83 Q110 69 147 83 L158 174 Q139 190 110 187 Q81 190 62 174Z"/><path className="human-shoulder" d="M77 88 Q52 91 39 117 L51 126 77 108M143 88 Q168 91 181 117 L169 126 143 108"/><path className="human-arm" d="M51 119 L31 184 Q28 194 35 198 Q42 201 47 190 L73 130"/><path className="human-arm" d="M169 119 L189 184 Q192 194 185 198 Q178 201 173 190 L147 130"/><path className="human-leg" d="M83 178 L76 258 Q75 267 84 268 Q92 268 94 258 L110 190"/><path className="human-leg" d="M137 178 L144 258 Q145 267 136 268 Q128 268 126 258 L110 190"/><path className="suit-panel" d="M85 107 Q110 96 135 107 L139 159 Q110 173 81 159Z"/><path className="suit-panel" d="M96 116h28v31H96z"/><path className="suit-line" d="M110 86v88M78 151h64M69 96l-15 22M151 96l15 22"/><circle className="visor-ring" cx="110" cy="48" r="21"/><ellipse className="visor" cx="110" cy="48" rx="16" ry="12"/><circle className="human-eye" cx="104" cy="48" r="2"/><circle className="human-eye" cx="116" cy="48" r="2"/><circle className="suit-node" cx="110" cy="132" r="4"/><path className="suit-node-line" d="M110 132h17l8-12"/></g><path className="focus-mark focus-chest" d="M80 108 Q110 93 140 108 L134 151 Q110 166 86 151Z"/><circle className="focus-mark focus-head" cx="110" cy="48" r="34"/><path className="focus-mark focus-limb" d="M29 177 Q31 162 41 158 L52 166 44 195 34 199Z"/><ellipse className="focus-mark focus-eye" cx="104" cy="48" rx="14" ry="10"/><circle className="focus-mark focus-mind" cx="110" cy="48" r="34"/><path className="focus-mark focus-suit" d="M66 88 Q110 68 154 88 L164 173 Q140 198 110 193 Q80 198 56 173Z"/><path className="focus-mark focus-body" d="M62 84 Q110 66 158 84 L149 181 Q110 204 71 181Z"/><path className="focus-mark focus-temperature" d="M166 126h28M169 139h25M172 152h22"/><circle className="focus-mark focus-sleep" cx="110" cy="48" r="34"/></svg><span className="visual-scan" /><span className="visual-pulse" /><span className="visual-focus-label">{language === 'en' ? 'OBSERVATION ZONE' : 'ZONA DE OBSERVACIÓN'} · {focus}</span></div>
  </section>
}
