# Handoff Document

This document helps someone continue the project without losing context.

## Current status

The application builds with `npm run build` and runs locally with Vite. The prototype includes an overview, daily check-in, cognition test, vital signs, mission risks, emergency mode, interactive charts, and contextual references.

## Getting started

```bash
git clone [PASTE_REPOSITORY_URL_HERE]
cd "Cosmic Ray 64"
npm install
npm run dev
```

If the cloned folder has a different name, use that name in the `cd` command.

## What the next developer should know

- No physical sensors are connected.
- Demonstration vital signs are simulated and identified in the interface.
- There is no trained clinical model.
- Current alerts are transparent, informational rules.
- The cognition test measures the time between the visual cue and the user's click.
- Application data is stored in `localStorage`.
- Emergency mode organizes tasks and records the event; it does not prescribe treatment.
- NASA/OSDR references provide context and do not represent NASA endorsement or certification of this application.

## Priority tasks

- [x] Connect daily check-in data to the main overview.
- [x] Store history by date and profile.
- [ ] Add selected OSDR datasets with metadata, license, and source link.
- [ ] Have medical personnel review emergency mode procedures.
- [ ] Create interface tests for charts, alerts, and the cognition test.
- [ ] Improve accessibility and check the tablet layout.
- [ ] Review privacy, encryption, and export before using personal data.

## Guidance for the next developer

### Priority objective

<!-- Fill in the next feature to develop. -->

### Product decisions

<!-- Fill in what should be preserved, changed, or not implemented. -->

### Approved sources or datasets

<!-- Add links, OSDR identifiers, and terms of use. -->

### People who should review sensitive changes

<!-- Add the product, research, or medical reviewers. -->

### Notes from the last session

<!-- Add any decisions or issues discovered. -->

## Mars mode integration

Daily history is stored in `cosmic-daily-v1`; each Mars session uses `cosmic-mars-v1-{profileId}`. Older records without a profile (`cosmic-checkin` and `cosmic-reaction-history`) are retained but are not automatically attributed to anyone.

`src/mission.ts` contains validation, updates by date/profile, and clock calculations. `src/MarsMode.tsx` contains the simulator, logbook, history, and reports. Transmissions save a fixed copy of the report and the time configuration used when sending.

Data stays local to the browser and origin, with no synchronization or backend. The Mars scenario does not modify the scenarios in the Risks section. The integrated evidence is a reference to NASA research, not an analyzed dataset. The interface supports English and Spanish; selecting an appropriate OSDR dataset is still pending.

## EVA preparation integration

`src/spaceWeather.ts` validates the NOAA response, distinguishes missing data from a zero scale, calculates freshness, and generates review explanations. `src/ExitReadiness.tsx` integrates a request with cancellation/timeout, a labeled local copy, historical alert playback, A/B plans, and a downloadable report.

Current source: `https://services.swpc.noaa.gov/products/noaa-scales.json`, entry `0` (current observation). The `cosmic-weather-v1` cache retains observation and query dates, but a successful query on opening is required to mark it as current. Historical cards retain their individual NOAA links. There is no interpolation, dosimetry, or clinical risk estimate. The nine tests cover history, the clock, plan validation, and handling of missing or stale environmental data.

## Navigation and references

The standalone Evidence screen was removed. The bibliography remains in the README, and applicable references appear in “Source and limitations” dropdowns in Mission Risks, Mars Mode, and EVA Preparation. The general label indicates that records are local without promising full offline availability.

## Orientation and shift handover

`src/TurnBrief.tsx` contains the handover report and defensive reading of plans/logbook. `nextStep` in `src/mission.ts` orders pending items. Shift closeout retains a fixed local copy of the report per crew member; personal records are not replaced with fictional data. The custom palette uses teal and copper; CSS tokens no longer refer to NASA. Text citations remain, with no brand graphics or new demonstration mode.

## Status after the full polish pass

- `src/records.ts`: validation and reading of vital-sign and emergency records, elapsed time, and date filters.
- `src/Vitals.tsx`: manual entry by person/date (`cosmic-vitals-v2-{profileId}-{date}`).
- `src/EmergencyMode.tsx`: draft/event by profile (`cosmic-emergency-v2-{profileId}`) and archive before starting another event (`cosmic-emergency-archive-v2-{profileId}`). Legacy keys are not overwritten.
- `src/TrendExplorer.tsx`: lazy loading of Recharts; personal/sample selector and calendar periods without mixing in fictional data.
- `src/i18n.tsx` and `src/translations.ts`: English/Spanish interface text. Translation operates on React text before rendering, without modifying the DOM or form values. Reports explicitly mark user-entered fields so they remain unchanged. Extend the catalog when adding text.
- Each metric's reference uses the three records before the current day; the index requires a reference and complete current data. It is not presented as clinical validation.
- Emergency mode is accessible from the mobile menu. The handover dialog keeps focus and disables the background while open.
- The shift overview includes today's manually entered vital signs and the date/status of the latest event, which may belong to another shift.

Validation: `npm test` and `npm run build`, plus browser walkthroughs in both languages, profile persistence, event recovery, and mobile views. Publication to GitHub/Azure is still pending; these changes are local.

## Sample selector in the overview

The existing selector now changes the cards, index, signals, and chart together. It opens on personal records by default; selecting samples does not write records, and switching back restores personal values. Samples use the profile's first three days as the reference and the last day as the current reading. `assessWellbeing` centralizes the same illustrative rules for both sources; reports and other screens receive only the personal assessment. No general demonstration mode was added.

Verification: Luna shows 79/100 and three signals in the sample view; after switching back, the personal cards and storage remain unchanged. English/Spanish text and a 390 px mobile width were checked.
