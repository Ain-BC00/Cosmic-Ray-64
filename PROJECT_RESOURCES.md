# Cosmic Ray 64 · Project resources

This file documents the public demo, the scientific references, the data sources, and the external tools used by the project. It distinguishes sources that are actively queried by the application from contextual references that are only linked for consultation.

## Demo and project links

- **Live project:** https://cosmic-ray-64.earth/
- **Source repository:** https://github.com/Ain-BC00/Cosmic-Ray-64
- **Demo video:** To be added — replace this line with the public YouTube URL when the video is available.

The demo video must be public and accessible without a password, account, or registration.

## NASA resources used as context

### Human spaceflight hazards

- [NASA Human Research Program: human spaceflight risks](https://www.nasa.gov/hrp/risks/)
- [NASA: the five hazards of human spaceflight](https://www.nasa.gov/hrp/hazards/)
- [NASA STEM: five hazards of human spaceflight](https://www.nasa.gov/stem-content/five-hazards-of-human-spaceflight/)

These references informed the mission-risk scenarios shown in the application: space radiation, isolation and confinement, distance from Earth, gravity fields, and the hostile or closed environment. They are educational context only; they are not medical protocols or an individual risk calculation.

### Communication delay and Mars operations

- [NASA NTRS: communication-delay research](https://ntrs.nasa.gov/citations/20250000703)

This reference informs the Mars-mode communication-delay exercise. The application uses an illustrative local delay selected by the user; it does not calculate the current position of the planets, connect to Earth, or reproduce spacecraft telemetry.

### NASA repositories and additional references

- [NASA Open Science Data Repository](https://science.nasa.gov/biological-physical/data/osdr/) — linked as a repository reference. No OSDR dataset is downloaded, incorporated, or analyzed by this version.
- [NASA DONKI](https://ccmc.gsfc.nasa.gov/tools/DONKI/) — linked as an additional solar-event exploration resource in the EVA section. This version does not query the DONKI API.
- [NASA HRP: ongoing research](https://www.nasa.gov/hrp/ongoing-hrp-research/) — general research context.

NASA resources are not presented as certification, endorsement, clinical guidance, or operational authorization for Cosmic Ray 64.

## NOAA data used directly

The EVA preparation section uses NOAA space-weather observations. These are environmental observations, not a personal radiation dose, medical assessment, or EVA authorization.

- [NOAA SWPC observed scales JSON](https://services.swpc.noaa.gov/products/noaa-scales.json) — live S, R, and G values used by the application.
- [NOAA scales explanation](https://www.spaceweather.gov/noaa-scales-explanation) — explanation of the scales shown in the interface.
- [NOAA OSPO message: January 19, 2026, S3](https://www.ospo.noaa.gov/data/messages/2026/01/MSG_20260119_1136.html) — historical reference shown in the event player.
- [NOAA/SWPC: January 19, 2026, S4 event](https://www.spaceweather.gov/news/s4-severe-solar-radiation-storm-progress-january-19th-2026) — historical reference shown in the event player.
- [NOAA OSPO message: January 20, 2026, S3](https://www.ospo.noaa.gov/data/messages/2026/01/MSG_20260120_2313.html) — historical reference shown in the event player.

## Software and external libraries

- [React](https://react.dev/) and [React DOM](https://react.dev/) — interface rendering.
- [TypeScript](https://www.typescriptlang.org/) — type-safe application code.
- [Vite](https://vite.dev/) — local development server and production build.
- [Recharts](https://recharts.org/) — radar-trend visualization.
- Browser `localStorage` — local persistence for profiles, records, plans, and reports. No backend or remote health-data store is connected.

## NASA Space Apps Global Collaborators used

The following collaborators from the NASA Space Apps Global Offers page correspond to resources actually used in this project:

- [Microsoft Azure](https://azure.microsoft.com/) — cloud deployment and hosting of the public web application through Azure Static Web Apps. Azure is connected to the GitHub repository and publishes the application after successful changes to the `main` branch.
- [GitHub](https://github.com/) — public source-code repository, version control, commits, collaboration, and the GitHub Actions workflow used to build and deploy the project.
- [Microsoft Copilot](https://copilot.microsoft.com/) — development support used for selected ideation, wording, documentation, and project-development tasks. It is not integrated into the application and is not part of its runtime.
- [GoDaddy](https://www.godaddy.com/domains) — domain registration/management used for the public project address `cosmic-ray-64.earth/`. The domain is connected to the Azure-hosted application.

GitHub and GitHub Copilot are different resources. GitHub is used here for repository hosting and deployment workflow. GitHub Copilot should only be listed if the team actually used that separate coding assistant.

The Global Offers page also lists Microsoft Planetary Computer, Google Cloud, Meteomatics, Miro, and Microsoft Teams. They are not listed as project resources because this version does not use their APIs, datasets, hosting, collaboration boards, or communication services.

## Development tools disclosure

Microsoft Copilot and OpenAI Codex were used only as development tools to support selected parts of the source code, documentation, wording, and interface iteration. Cosmic Ray 64 does not contain or call an AI model at runtime, does not generate medical recommendations, and does not use AI-generated NASA logos, NASA identifiers, or official NASA design elements. The visual emergency guide is code-native SVG/CSS, not an AI-generated raster image or video. GitHub itself was used for repository hosting and deployment automation, not as a synonym for GitHub Copilot.

## Scope and limitations

Cosmic Ray 64 is an educational support and record-keeping prototype. It does not diagnose conditions, determine fitness for duty, authorize an EVA, replace medical judgment, or transmit reports to Earth. All procedures, datasets, and operational decisions would require review and approval by the responsible scientific, medical, and mission authorities before real flight use.

