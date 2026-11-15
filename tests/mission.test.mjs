import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'

const source = readFileSync(new URL('../src/mission.ts', import.meta.url), 'utf8')
const outputText = stripTypeScriptTypes(source)
const { validCheckin, upsertRecord, readHistory, transmissionStage, nextStep, assessWellbeing } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
const checkin = { sleep: 6, mood: 7, stress: 4, fatigue: 5, symptoms: '' }

test('combines same-day checkin and reaction, isolates profiles and dates', () => {
  let records = upsertRecord([], 'luna', '2026-11-14', { checkin })
  records = upsertRecord(records, 'luna', '2026-11-14', { reaction: 310 })
  records = upsertRecord(records, 'marco', '2026-11-14', { reaction: 280 })
  records = upsertRecord(records, 'luna', '2026-11-15', { checkin: { ...checkin, sleep: 8 } })
  assert.equal(records.length, 3)
  assert.equal(records.find(r => r.profileId === 'luna' && r.date === '2026-11-14').checkin.sleep, 6)
  assert.equal(records.find(r => r.profileId === 'luna' && r.date === '2026-11-14').reaction, 310)
  assert.equal(records.find(r => r.profileId === 'marco').checkin, undefined)
})
test('rejects invalid or missing numeric input', () => {
  assert.equal(validCheckin(checkin), true)
  for (const patch of [{ sleep: NaN }, { sleep: -1 }, { sleep: 15 }, { mood: 11 }, { fatigue: 1.5 }]) assert.equal(validCheckin({ ...checkin, ...patch }), false)
})
test('recovers from malformed storage and rejects invalid records', () => {
  globalThis.localStorage = { getItem: () => '{broken' }
  assert.deepEqual(readHistory(), [])
  globalThis.localStorage = { getItem: () => JSON.stringify([{ profileId: 'luna', date: '2026-11-14', updatedAt: 'now', checkin }, { profileId: 'luna', date: 'invalid' }]) }
  assert.equal(readHistory().length, 1)
})
test('transmission advances by wall time, including after a reload', () => {
  const start = 100000
  assert.equal(transmissionStage(start, start, 20, 120).stage, 'En camino a Tierra')
  assert.equal(transmissionStage(start, start + 10000, 20, 120).stage, 'Respuesta de guion en camino')
  assert.equal(transmissionStage(start, start + 20000, 20, 120).complete, true)
  assert.equal(transmissionStage(start, start + 20000, 20, 1).complete, false)
  assert.equal(transmissionStage(start, start - 100, 20, 120).remaining, 20)
})

test('next action follows missing records before plan review', () => {
  assert.equal(nextStep(false, false, true).tab, 'checkin')
  assert.equal(nextStep(true, false, true).tab, 'cognicion')
  assert.equal(nextStep(true, true, false).title, 'Revisa un plan de salida')
  assert.equal(nextStep(true, true, true).title, 'Preparación registrada')
})
test('a complete example computes index and signals without filling missing personal data', () => {
  const current = { day: 'Día 7', sleep: 7.4, mood: 7, stress: 4, fatigue: 4, reaction: 312 }
  const baseline = { sleep: 7.7, mood: 23 / 3, stress: 3, fatigue: 3, reaction: 880 / 3 }
  const before = JSON.stringify(current)
  const example = assessWellbeing(current, baseline, true, true)
  assert.equal(example.score, 79)
  assert.equal(example.alerts.length, 3)
  assert.equal(JSON.stringify(current), before)
  assert.equal(assessWellbeing(current, baseline, false, false).score, null)
  assert.equal(assessWellbeing(current, { ...baseline, sleep: NaN }, true, true).score, null)
})
