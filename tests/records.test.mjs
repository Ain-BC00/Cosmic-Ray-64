import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
const load = async file => import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(readFileSync(new URL(file, import.meta.url), 'utf8'))).toString('base64')}`)
const { validVitals, readVital, emptyEmergency, readEmergency, eventSeconds, filterDates } = await load('../src/records.ts')
const { english, userText, restoreUserText } = await load('../src/translations.ts')
test('manual vital signs reject invalid values without inventing clinical thresholds', () => {
  const input = { pulse: '70', oxygen: '98', temperature: '36.5', pressure: '120/80', glucose: '' }
  assert.equal(validVitals(input), true)
  for (const patch of [{ oxygen: '101' }, { pulse: '-5' }, { glucose: 'abc' }, { pressure: '120' }]) assert.equal(validVitals({ ...input, ...patch }), false)
})
test('vital records are isolated by person and date and tolerate malformed storage', () => {
  const map = new Map([['cosmic-vitals-v2-luna-2026-11-14', JSON.stringify({ profileId: 'luna', date: '2026-11-14', savedAt: '2026-11-14T12:00:00Z', values: { pulse: '72', oxygen: '', temperature: '', pressure: '', glucose: '' } })]])
  globalThis.localStorage = { getItem: key => map.get(key) ?? null }
  assert.equal(readVital('luna', '2026-11-14').values.pulse, '72')
  assert.equal(readVital('marco', '2026-11-14'), null)
  assert.equal(readVital('luna', '2026-11-15'), null)
  map.set('cosmic-vitals-v2-luna-2026-11-14', '{broken')
  assert.equal(readVital('luna', '2026-11-14'), null)
})
test('emergency recovers roles, steps and wall-clock time after remount', () => {
  const record = { ...emptyEmergency('luna', 'Mars'), startedAt: 100000, steps: [true, false, false, false, false, false], roles: { care: 'marco', comms: '', log: '' }, notes: 'Observed event' }
  globalThis.localStorage = { getItem: () => JSON.stringify(record) }
  const restored = readEmergency('luna', 'Earth')
  assert.equal(restored.scenarioName, 'Mars')
  assert.equal(restored.roles.care, 'marco')
  assert.equal(restored.steps[0], true)
  assert.equal(eventSeconds(restored, 112000), 12)
  assert.equal(eventSeconds({ ...restored, endedAt: 105000 }, 120000), 5)
  assert.equal(readEmergency('marco', 'Earth').startedAt, null)
})
test('calendar periods use date boundaries rather than the last N entries', () => {
  const records = ['2026-09-01', '2026-10-31', '2026-11-08', '2026-11-14', '2026-11-15'].map(date => ({ date }))
  assert.deepEqual(filterDates(records, '7', '2026-11-14').map(r => r.date), ['2026-11-08', '2026-11-14'])
  assert.equal(filterDates(records, '30', '2026-11-14').length, 3)
  assert.equal(filterDates(records, 'all', '2026-11-14').length, 4)
})
test('English copy covers navigation, notices and missing-data states', () => {
  assert.equal(english('Signos vitales'), 'Vital signs')
  assert.equal(english('HISTORIAL DEL PERFIL'), 'PROFILE HISTORY')
  assert.equal(english('LOCAL · REGISTROS PROPIOS'), 'LOCAL · PERSONAL RECORDS')
  assert.equal(english('Navegación principal'), 'Main navigation')
  assert.equal(english('Dimensiones del chequeo diario'), 'Daily check-in dimensions')
  assert.equal(english('ÍNDICE DEL PERFIL'), 'PROFILE INDEX')
  assert.equal(english('Señales del perfil'), 'Profile signals')
  assert.equal(english('Sin descripción'), 'No description')
  assert.equal(english('Descripción: Sin descripción'), 'Description: No description')
  assert.equal(english('Sin clasificar'), 'Unclassified')
  assert.equal(english('No hay procedimiento clínico aprobado configurado en esta aplicación.'), 'No approved clinical procedure is configured in this application.')
  assert.equal(english('Estado: preparado localmente; no transmitido ni entregado.'), 'Status: prepared locally; not transmitted or delivered.')
  assert.equal(english('Falta la prueba de reacción de hoy.'), "Today's reaction test is missing.")
  assert.equal(english('4 verificaciones de equipo o coordinación pendientes.'), '4 equipment or coordination checks pending.')
  assert.equal(english('No hay registros para este periodo.'), 'No records for this period.')
})

test('English reports preserve short notes, accents and emoji exactly', () => {
  const note = 'Sueño a 🎯'
  const translated = restoreUserText(english('Notas para el relevo: ' + userText(note)))
  assert.equal(translated, 'Handover notes: ' + note)
})
