# Cosmic Ray 64

Cosmic Ray 64 is an educational prototype for recording crew wellbeing, organizing mission tasks and exploring the effects of delayed communications and space weather. It runs in the browser with React, TypeScript, Vite and Recharts.

[Guía en español](./README.md)

## What it does

- **Overview:** opens with today's personal records and a suggested next step. Selecting **Fictional examples** switches the cards, illustrative index, signals and chart together to a clearly labelled example history. Switching back restores personal readings without changing stored records. Reports and other screens continue to use personal data.
- **Daily check-in:** sleep, mood, stress, fatigue and optional notes, saved by crew member and local calendar date.
- **Cognition:** a click-based reaction test with early-response detection.
- **Vital signs:** optional manual entries from an external device, saved by crew member and date. The app does not measure vital signs itself.
- **Personal trends:** actual date filters for the last 7 or 30 calendar days, or all records. Fictional examples use their own history and baseline, separate from personal records.
- **Mission risks:** educational context for Earth orbit, lunar missions, Mars transit and spacewalks.
- **Mars mode:** a simulated communication delay, coordination checklist, shift log, and downloadable reports. Replies are fixed scripts; no real message is sent to Earth.
- **EVA preparation:** observed NOAA space-weather scales with timestamps, three documented historical notices, two editable plans and a descriptive comparison.
- **Emergency coordination:** persistent event timer, assigned roles, checklist, observations and an event report. Starting another event archives the previous one locally.
- **Shift handover:** personal records, manual vital signs, plans, outstanding items and the latest event, with recipient and handover notes.

Use the header selector to switch between English and Spanish without reloading. User-entered notes and names remain in their original language.

## Personal data and limitations

Data stays in this browser and website origin. Localhost, the Azure address and a custom domain have separate storage; no account sync or backend is provided. Clearing browser storage removes local records. Legacy records without reliable profile/date attribution are retained without automatically assigning them to a person.

Each metric's baseline requires three previous dates for that crew member. The illustrative wellbeing index appears only when current records and the complete baseline are available. The rules are not a clinically validated model, diagnosis or assessment of fitness for duty.

NOAA observations describe the near-Earth environment. They are not dose measurements, forecasts for a planned departure, or observations of lunar or Martian exposure. The interface treats a successfully verified observation no more than 30 minutes old as recent; this is an interface rule, not an operational safety threshold. A cached response is clearly marked when it cannot be verified. S0 does not mean that space is safe or free of radiation.

The app does not authorize EVAs, prescribe care, contact emergency services, connect sensors or implement real spacecraft communications. It does not yet install an offline copy of the website. External sources and fresh weather queries require a connection.

## Run and validate

```sh
npm install
npm run dev
```

Open the local address printed by Vite. Tests use Node.js's TypeScript stripping support (Node.js 22.13 or newer); development was validated with Node.js 26.13.1.

```sh
npm test
npm run build
npm run preview
```

## Presentation walkthrough

1. Select a crew member and complete a daily check-in.
2. Run the cognitive test and inspect the updated overview.
3. Show personal trends and explicitly switch to fictional examples if needed.
4. Open Mars mode and simulate the communication delay while documenting coordination tasks.
5. Open EVA preparation, compare plans, and replay the historical notices. Explain the distinction between environmental observations and personal exposure.
6. Prepare a shift handover and download the report.

## Sources and identity

Scientific references provide context, not NASA/NOAA endorsement or clinical validation. No NASA logos, flags, mission patches or mission identifiers are included. Cosmic Ray 64 uses its own visual identity. There is no additional general demonstration mode.

- [NASA: communication-delay research](https://ntrs.nasa.gov/citations/20250000703)
- [NASA: human spaceflight hazards](https://www.nasa.gov/stem-content/five-hazards-of-human-spaceflight/)
- [NASA Open Science Data Repository](https://science.nasa.gov/biological-physical/data/osdr/) — context only; no OSDR dataset has been analyzed in this version.
- [NASA Assisted Medical Procedures](https://techport.nasa.gov/projects/18874) — system-design reference only.
- [NOAA observed scales feed](https://services.swpc.noaa.gov/products/noaa-scales.json)
- [NOAA scale definitions](https://www.spaceweather.gov/noaa-scales-explanation)
- [NOAA historical notice: January 19, 2026, 11:36 UTC](https://www.ospo.noaa.gov/data/messages/2026/01/MSG_20260119_1136.html)
- [NOAA historical S4 notice: January 19, 2026](https://www.spaceweather.gov/news/s4-severe-solar-radiation-storm-progress-january-19th-2026)
- [NOAA historical notice: January 20, 2026, 23:13 UTC](https://www.ospo.noaa.gov/data/messages/2026/01/MSG_20260120_2313.html)
- [NASA DONKI](https://ccmc.gsfc.nasa.gov/tools/DONKI/) — an additional reference; its API is not queried in this version.

Code dependencies are listed in [package.json](./package.json). They include React, React DOM, Vite, the Vite React plugin, TypeScript, Recharts and React type declarations.
