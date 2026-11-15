import { useLanguage } from './i18n'
import { useState } from 'react'
import { readVital, validVitals, VitalValues } from './records'
const empty: VitalValues = { pulse: '', oxygen: '', temperature: '', pressure: '', glucose: '' }
export function Vitals({ profileId, profileName, date, onNotice }: { profileId: string; profileName: string; date: string; onNotice: (message: string) => void }) {
  const { view } = useLanguage()
  const [saved, setSaved] = useState(() => readVital(profileId, date))
  const [values, setValues] = useState<VitalValues>(() => saved?.values ?? empty)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState('')
  const set = (key: keyof VitalValues, value: string) => { setValues(old => ({ ...old, [key]: value })); setDirty(true); setError('') }
  const save = () => {
    if (!validVitals(values) || Object.values(values).every(v => !v.trim())) { setError('Introduce al menos un valor válido. Usa números positivos, oxígeno de hasta 100% y presión como 120/80.'); return }
    const record = { profileId, date, savedAt: new Date().toISOString(), values }
    try { localStorage.setItem(`cosmic-vitals-v2-${profileId}-${date}`, JSON.stringify(record)); setSaved(record); setDirty(false); onNotice('Registro guardado en este dispositivo') }
    catch { setError('No se pudo guardar. Revisa el almacenamiento del navegador.'); }
  }
  return view(<section className="single-column"><form className="panel form-panel" onSubmit={e => { e.preventDefault(); save() }} noValidate><span className="eyebrow">ENTRADA MANUAL · {profileName} · {date}</span><h2>Signos vitales</h2><p className="form-intro">Introduce únicamente valores que hayas medido con un dispositivo externo. Estos campos no se rellenan con ejemplos ni generan un diagnóstico.</p><div className="vitals-grid">{([['Pulso', 'pulse', 'lpm'], ['Saturación', 'oxygen', '%'], ['Temperatura', 'temperature', '°C'], ['Glucosa', 'glucose', 'mg/dL']] as const).map(([label, key, unit]) => <label key={key}>{label}<div className="input-unit"><input type="number" min="0" max={key === 'oxygen' ? 100 : undefined} step="any" value={values[key]} onChange={e => set(key, e.target.value)} placeholder="Opcional"/><span>{unit}</span></div><small>Entrada manual</small></label>)}<label>Presión arterial<div className="input-unit"><input value={values.pressure} onChange={e => set('pressure', e.target.value)} placeholder="120/80" inputMode="text"/><span>mmHg</span></div><small>Entrada manual · sistólica/diastólica</small></label></div><p role="alert" className="form-error">{error}</p><div className="form-footer"><button type="submit" className="primary-button">Guardar registro local</button><span role="status">{dirty ? 'Cambios sin guardar' : saved ? '✓ Guardado' : 'Sin registro de hoy'}</span></div>{saved && <p className="mars-caption">{saved.savedAt} · {profileName} · {date}</p>}<details className="source-details"><summary>Cómo se guardan los datos</summary><p>Cada tripulante tiene su registro por fecha en este navegador. Guardar de nuevo actualiza los valores del mismo día. Los registros antiguos sin perfil se conservan sin atribuirlos a una persona.</p></details></form></section>)
}
