import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
const source = readFileSync(new URL('../src/spaceWeather.ts', import.meta.url), 'utf8')
const moduleText = stripTypeScriptTypes(source)
const { parseWeather, freshWeather, validPlan, planReview, historicalEvents } = await import(`data:text/javascript;base64,${Buffer.from(moduleText).toString('base64')}`)
const now = Date.parse('2026-11-15T04:10:00Z')
const payload = { '0': { DateStamp: '2026-11-15', TimeStamp: '04:00:00', S: { Scale: '0' }, R: { Scale: '2' }, G: { Scale: '1' } } }
const plan = { name: 'A', destination: 'leo', duration: 60, departure: '', responsible: '', comms: 0, checks: [false, false, false, false], decision: '' }
test('NOAA zero is an observation, missing scale is not zero', () => {
  const weather = parseWeather(payload, now)
  assert.equal(weather.s, 0)
  assert.equal(weather.r, 2)
  const missing = structuredClone(payload); missing['0'].S.Scale = ''
  assert.equal(parseWeather(missing, now).s, null)
  assert.throws(() => parseWeather({}))
  assert.throws(() => parseWeather({ '0': { DateStamp: '2026-11-15', TimeStamp: '04:00:00', S: { Scale: null } } }))
})
test('rejects old, invalid and future-dated observations', () => {
  const weather = parseWeather(payload, now)
  assert.equal(freshWeather(weather, now), true)
  assert.equal(freshWeather(weather, now + 31 * 60000), false)
  assert.equal(freshWeather({ ...weather, observedAt: 'invalid' }, now), false)
  assert.equal(freshWeather({ ...weather, observedAt: new Date(now + 10 * 60000).toISOString() }, now), false)
})
test('plan review identifies missing preparation and preserves uncertainty at S0', () => {
  const review = planReview(plan, parseWeather(payload, now), true, false, false)
  assert.ok(review.some(s => s.includes('4 verificaciones')))
  assert.ok(review.some(s => s.includes('Falta el chequeo')))
  assert.ok(review.some(s => s.includes('no significa ausencia de radiación')))
  assert.ok(review.some(s => s.includes('No se calcula dosis')))
})
test('history, stale weather and non-Earth plans cannot imply current local conditions', () => {
  const weather = { ...parseWeather(payload, now), s: 4 }
  assert.ok(planReview({ ...plan, destination: 'mars' }, weather, true, true, true, true).some(s => s.includes('no describen la exposición')))
  assert.ok(planReview(plan, weather, true, true, true, true).some(s => s.includes('Reproducción histórica')))
  const stale = planReview(plan, weather, false, true, true)
  assert.ok(stale.some(s => s.includes('No hay una observación')))
  assert.ok(!stale.some(s => s.startsWith('Evento S4')))
  assert.equal(historicalEvents.length, 3)
  assert.ok(historicalEvents.every(e => e.source.startsWith('https://www.') && e.s >= 1))
})
test('plan validation accepts declared values and rejects blank/out-of-range numbers', () => {
  assert.equal(validPlan(plan), true)
  for (const patch of [{ duration: NaN }, { duration: 0 }, { duration: 481 }, { comms: -1 }, { checks: [] }]) assert.equal(validPlan({ ...plan, ...patch }), false)
})
