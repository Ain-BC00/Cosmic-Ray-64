import { useMemo, useState } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useLanguage } from './i18n'
import type { MetricKey, Day, MissionEvent } from './App'

type ChartRow = Day & { baseline: number; movingAverage: number }
const dimensions = [
  { key: 'sleep', label: 'Sueño', unit: 'h', max: 14 },
  { key: 'mood', label: 'Ánimo', unit: '/10', max: 10 },
  { key: 'stress', label: 'Estrés', unit: '/10', max: 10 },
  { key: 'fatigue', label: 'Cansancio', unit: '/10', max: 10 },
] as const

export default function TrendExplorer({ source, period, setPeriod, data }: { source: 'personal' | 'example'; setSource: (source: 'personal' | 'example') => void; metric: MetricKey; setMetric: (metric: MetricKey) => void; period: '7' | '30' | 'all'; setPeriod: (period: '7' | '30' | 'all') => void; data: ChartRow[]; selectedEvent: MissionEvent | null; setSelectedEvent: (event: MissionEvent | null) => void }) {
  const { view } = useLanguage()
  const [firstDate, setFirstDate] = useState('')
  const [secondDate, setSecondDate] = useState('')
  const dates = useMemo(() => data.filter(row => dimensions.some(d => Number.isFinite(row[d.key]))).map(row => row.day), [data])
  const dateA = dates.includes(firstDate) ? firstDate : dates[dates.length - 1] ?? ''
  const dateB = dates.includes(secondDate) ? secondDate : dates.length > 1 ? dates[dates.length - 2] : ''
  const toRadar = (date: string, key: string) => {
    const row = data.find(item => item.day === date)
    if (!row) return []
    return dimensions.map(dimension => {
      const raw = row[dimension.key]
      return { dimension: dimension.label, value: Number.isFinite(raw) ? Math.round(raw / dimension.max * 100) / 10 : null, actual: Number.isFinite(raw) ? `${raw} ${dimension.unit}` : 'Sin medición', series: key }
    })
  }
  const chartRows = dimensions.map((d, i) => ({ dimension: d.label, actualA: toRadar(dateA, 'A')[i]?.value ?? null, actualB: dateB ? toRadar(dateB, 'B')[i]?.value ?? null : null, valueA: toRadar(dateA, 'A')[i]?.actual ?? 'Sin medición', valueB: toRadar(dateB, 'B')[i]?.actual ?? 'Sin medición' }))
  return view(<div className="panel chart-panel">
    <div className="panel-head trend-heading"><div><span className="eyebrow">{source === 'example' ? 'HISTORIAL DEL PERFIL' : 'REGISTROS PERSONALES · RADAR'}</span><h2>Dimensiones del chequeo diario</h2></div><div className="trend-controls"><label>Periodo<select aria-label="Periodo" value={period} onChange={e => setPeriod(e.target.value as typeof period)}><option value="7">7 días</option><option value="30">30 días</option><option value="all">Toda la misión</option></select></label></div></div>
    <p className="chart-source-note">{source === 'example' ? 'Registros del perfil seleccionado. Este historial no incluye fecha de calendario ni procedencia de sensor.' : 'Vista normalizada de cada indicador (valor ÷ rango de captura × 100). El número original y sus unidades se muestran al pasar el cursor. No es una puntuación de salud. Sin datos, el eje queda vacío.'}</p>
    {!dates.length ? <div className="empty-state" role="status"><strong>No hay mediciones para comparar</strong><p>Guarda un chequeo diario para ver sus dimensiones aquí.</p></div> : <>
      <div className="trend-controls radar-date-controls"><label>Fecha A<select value={dateA} onChange={e => setFirstDate(e.target.value)}>{dates.map(date => <option key={date}>{date}</option>)}</select></label><label>Fecha B<select value={dateB} onChange={e => setSecondDate(e.target.value)}><option value="">Sin comparación</option>{dates.filter(date => date !== dateA).map(date => <option key={date}>{date}</option>)}</select></label></div>
      <div className="chart-wrap"><ResponsiveContainer width="100%" height={300}><RadarChart data={chartRows}><PolarGrid stroke="#526174"/><PolarAngleAxis dataKey="dimension" tick={{ fill: '#c6d0dc', fontSize: 12 }}/><PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#8492a3', fontSize: 10 }}/><Tooltip formatter={(_value, _name, item) => { const payload = item.payload as typeof chartRows[number]; return [`A: ${payload.valueA} · B: ${payload.valueB}`, 'Medición original'] }} contentStyle={{ background: '#172438', border: '1px solid #334860', color: '#fff' }}/><Radar name={dateA} dataKey="actualA" stroke="#74e0c3" fill="#74e0c3" fillOpacity={0.25} connectNulls={false}/>{dateB && <Radar name={dateB} dataKey="actualB" stroke="#ffb86b" fill="#ffb86b" fillOpacity={0.12} connectNulls={false}/>}</RadarChart></ResponsiveContainer></div>
      <div className="history-scroll"><table className="history-table"><caption>Valores sin normalizar; fechas y unidades de entrada</caption><thead><tr><th>Dimensión</th><th>{dateA}</th>{dateB && <th>{dateB}</th>}</tr></thead><tbody>{dimensions.map((d, i) => <tr key={d.key}><th scope="row">{d.label}</th><td>{chartRows[i].valueA}</td>{dateB && <td>{chartRows[i].valueB}</td>}</tr>)}</tbody></table></div>
    </>}
  </div>)
}
