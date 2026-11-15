# Cosmic Ray 64

[Lee esta guía en español](./README.md)

Cosmic Ray 64 is a local web application for recording and reviewing crew wellbeing information, organizing mission activities, and supporting emergency coordination. The project is intended for long-duration space missions and crew autonomy during communication delays with Earth.

This is a support and record-keeping prototype. It does not diagnose conditions, determine fitness for duty, authorize extravehicular activities, or replace crew or medical judgment. NASA and NOAA references provide scientific and environmental context; they do not certify, endorse, or provide clinical protocols for this application.

## What the application currently includes

- **Crew overview and history:** selectable crew profiles, daily records, explainable indicators, and pending states. Included profile histories retain their values and are identified by profile. No connected sensor automatically attributes them to spacecraft telemetry.
- **Daily check-in:** sleep, mood, stress, fatigue, and symptom entry, stored by profile and local date.
- **Cognition:** a reaction test measured from the visual cue to the user's click; an early response is not stored as a result.
- **Vital signs:** optional manual entry of measurements taken with external equipment, with format and unit validation.
- **Radar trends:** comparison of daily records for sleep, mood, stress, and fatigue. Each axis is normalized to its entry range; a table preserves original values and units. The radar does not calculate a clinical score.
- **Mission risks:** context for Earth orbit, lunar missions, Mars transit, and extravehicular activity, organized around NASA's five human spaceflight hazards.
- **Local emergency assistance:** category, description, timer, roles, coordination checklist, notes, and report preparation. The interface states when no approved medical procedure is available; reports stay in a local queue and are not transmitted.
- **Mars mode:** a communication-delay exercise, logbook, and coordination flow. The delay and response are a local demonstration, not a connection to Earth.
- **EVA preparation:** NOAA observed space-weather scales and editable plans. The scales describe observed conditions; they do not estimate personal dose or authorize an EVA.
- **Shift handover:** a downloadable local summary of records and outstanding items.
- **English and Spanish:** language switching from the interface.

## User workflow

1. Select a crew profile and review its overview and available records.
2. Save the daily check-in and, if needed, complete the reaction test or enter vital signs manually.
3. Review the radar, choose a period, and compare dates. Missing values remain unmeasured.
4. Review risks for the mission scenario and EVA preparation when applicable.
5. During an emergency, select a category, record observations and assigned roles, consult the mission's controlled procedure, and document progress. The application does not generate clinical treatment instructions.
6. Prepare a local report for Earth. It remains pending until a real communication integration exists; queuing a report does not mean it was transmitted or acknowledged.
7. Prepare a shift handover and download the report if it needs to be shared outside the browser.

## Install and run

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local address printed by Vite. To validate the project and preview a production build:

```bash
npm test
npm run build
npm run preview
```

## Development workflow

1. Check `git status` and preserve existing local changes.
2. Inspect the relevant component, data model, and tests before changing a feature.
3. Implement within the existing React, TypeScript, and Vite stack; preserve history and never fill missing measurements with invented values.
4. For health data, record profile, timestamp, unit, and provenance when available. Do not present manual entry as sensor telemetry.
5. Emergency procedures require controlled text, version, source, effective date, and approval from the mission medical authority. Risk and research pages are not treatment protocols.
6. Run `npm test` and `npm run build`, inspect the diff, and document any missing integrations.
7. The GitHub Actions workflow deploys on pushes to `main`; confirm that the Azure Static Web Apps run succeeds before considering a change published.

## Architecture and current limitations

- Frontend: React, TypeScript, Vite, and Recharts.
- Persistence: browser `localStorage`, separated by origin and device. There is no backend, user account, cross-device sync, or application-managed encryption.
- Acquisition: check-ins are user-entered; vital signs are manual. No biomedical device or spacecraft telemetry integration is connected.
- Communications: there is no transport to Earth. The queued emergency report stays local and does not receive network-based transmitted, delivered, or acknowledged states.
- Offline operation: controlled procedures must be integrated before validated autonomous guidance is available. The current web app does not install a complete offline copy.
- Medical procedures and inventory: no approved procedure library or spacecraft inventory is integrated. The prototype warns when guidance is unavailable and must not be used to choose treatment.
- Authentication and authorization: interface profiles are not authenticated identities or access controls.

## Project roadmap

1. **Medical procedure safety:** integrate mission-approved procedures with IDs, versions, sources, effective dates, approvals, and offline access.
2. **Mission inventory:** integrate quantities, locations, expirations, operational status, and restrictions; link resources to approved procedures.
3. **Delay-tolerant communications:** add an authenticated queue and synchronization service with separate created, pending, transmitted, delivered, acknowledged, and responded states.
4. **Data and security:** define identity and authorization, secure persistence, audit, backup, and duplicate-safe synchronization.
5. **Sensors and provenance:** connect devices only through documented interfaces; preserve source, unit, timestamp, quality, and connection state.
6. **NASA HRP:** expand the five-hazard map and maintain a research catalog separate from clinical recommendations.
7. **Visualization and research:** validate dimensions, ranges, and weekly/monthly summaries with specialists before operational use.
8. **Validation:** add interface tests and failure cases for offline operation, incomplete records, expired inventory, and interrupted synchronization.

## References

- [NASA Human Research Program: human spaceflight risks](https://www.nasa.gov/hrp/risks/)
- [NASA: the five hazards of human spaceflight](https://www.nasa.gov/hrp/hazards/)
- [NASA HRP: ongoing research](https://www.nasa.gov/hrp/ongoing-hrp-research/)
- [NASA Open Science Data Repository](https://science.nasa.gov/biological-physical/data/osdr/) — a data repository; linking to it does not mean this app has incorporated or validated a dataset.
- [2026 challenge: health monitoring software for astronauts](https://youtu.be/RERG3gEmdC8) — no verifiable transcript was available, so no specific requirements are attributed to the video.
- [NOAA SWPC: observed scales](https://services.swpc.noaa.gov/products/noaa-scales.json)
- [NASA: communication-delay research](https://ntrs.nasa.gov/citations/20250000703)

Mission data, procedures, references, and requirements must be reviewed by the responsible scientific, medical, and operational authorities before any flight use.
