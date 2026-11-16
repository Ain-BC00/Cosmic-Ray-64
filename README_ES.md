# Cosmic Ray 64

[Read this guide in English](./README_EN.md)

Cosmic Ray 64 es una aplicación web local para registrar y revisar información de bienestar de una tripulación espacial, organizar actividades de misión y apoyar la coordinación ante emergencias. El proyecto apunta a misiones de larga duración y autonomía durante demoras de comunicación con la Tierra.

Es un prototipo de apoyo y registro. No diagnostica, no determina aptitud para el servicio, no autoriza actividades extravehiculares y no sustituye el juicio de la tripulación ni del personal médico. Las referencias de NASA y NOAA aportan contexto científico y ambiental; no constituyen certificación, respaldo ni protocolos clínicos para esta aplicación.

## Qué incluye actualmente

- **Resumen e historial por tripulante:** perfiles seleccionables, registros diarios, indicadores explicables y estados pendientes. Los historiales incorporados conservan sus valores y la interfaz los identifica por perfil. No hay un sensor conectado que permita atribuirlos automáticamente a telemetría.
- **Chequeo diario:** entrada de sueño, ánimo, estrés, cansancio y síntomas, con persistencia por perfil y fecha local.
- **Cognición:** prueba de reacción medida desde la señal visual hasta el clic; una respuesta anticipada no se guarda como resultado.
- **Signos vitales:** captura manual opcional de mediciones tomadas externamente, con validación de formato y unidades.
- **Tendencias radar:** comparación de registros diarios para sueño, ánimo, estrés y cansancio. Cada eje se normaliza según el rango de captura; la tabla conserva los valores y unidades originales. No se calcula una puntuación clínica a partir del radar.
- **Riesgos de misión:** contexto para órbita terrestre, misión lunar, tránsito a Marte y actividad extravehicular, organizado alrededor de los cinco peligros de los vuelos espaciales humanos.
- **Asistencia de emergencia local:** categoría, descripción, temporizador, roles, lista de coordinación, notas y preparación de un informe. La interfaz indica cuando no hay un procedimiento médico aprobado disponible; el informe permanece en una cola local y no se transmite.
- **Modo Marte:** ejercicio de demora de comunicación, bitácora y coordinación. La demora y la respuesta son parte de una demostración local, no una conexión con Tierra.
- **Preparación de salida:** consulta de escalas observadas de clima espacial de NOAA y planes editables. Las escalas describen el entorno observado; no estiman dosis personal ni autorizan una EVA.
- **Relevo de turno:** resumen local descargable de registros y pendientes.
- **Español e inglés:** cambio de idioma desde la interfaz.

## Flujo de uso

1. Selecciona un perfil de tripulante y revisa el resumen y los registros disponibles.
2. Guarda el chequeo diario y, si corresponde, completa la prueba de reacción o captura manual de signos vitales.
3. Revisa el radar, elige el periodo y compara fechas. Los valores ausentes se dejan sin medición.
4. Consulta los riesgos del escenario de misión y la preparación de salida cuando sea pertinente.
5. Ante una emergencia, elige la categoría, registra observaciones y responsables, consulta el procedimiento controlado de la misión y documenta el progreso. La aplicación no genera tratamiento clínico.
6. Prepara un informe local para Tierra. Se mantiene como pendiente hasta que exista una integración real de comunicaciones; ponerlo en cola no equivale a transmitirlo ni a recibir confirmación.
7. Prepara el relevo de turno y descarga el informe si se necesita compartirlo fuera del navegador.

## Instalación y ejecución

Requisitos: Node.js 20 o posterior y npm.

```bash
npm install
npm run dev
```

Abre la dirección local indicada por Vite. Para validar el proyecto y previsualizar el build:

```bash
npm test
npm run build
npm run preview
```

## Flujo de trabajo de desarrollo

1. Revisa `git status` y conserva los cambios locales existentes.
2. Inspecciona el componente, el modelo de datos y las pruebas relacionadas antes de cambiar una función.
3. Implementa el cambio dentro de React, TypeScript y Vite; conserva registros históricos y evita rellenar mediciones ausentes.
4. Para datos de salud, registra perfil, fecha/hora, unidad y procedencia cuando estén disponibles. No presentes una entrada manual como telemetría de sensor.
5. Para procedimientos de emergencia, exige texto controlado, versión, fuente y aprobación de la autoridad médica de la misión. Las páginas de riesgos e investigación no son protocolos de tratamiento.
6. Ejecuta `npm test` y `npm run build`, revisa el diff y documenta cualquier integración pendiente.
7. El workflow de GitHub Actions despliega al hacer push a `main`; confirma que la ejecución de Azure Static Web Apps termine correctamente antes de considerar el cambio publicado.

## Arquitectura y límites actuales

- Frontend: React, TypeScript, Vite y Recharts.
- Persistencia: `localStorage` del navegador, separada por origen y dispositivo. No hay backend, cuenta de usuario, sincronización entre dispositivos ni cifrado administrado por la aplicación.
- Adquisición: los chequeos son entradas de usuario; los signos vitales son manuales. No hay integración de dispositivos biomédicos ni telemetría de la nave.
- Comunicaciones: no hay transporte con Tierra. El informe de emergencia en cola permanece local y no tiene estados de transmisión, entrega o acuse provenientes de una red.
- Operación sin conexión: el procedimiento controlado debe integrarse antes de poder ofrecer guía autónoma validada. La aplicación web actual no instala una copia offline completa.
- Procedimientos médicos e inventario: no hay biblioteca de procedimientos aprobados ni inventario de nave integrado. El prototipo avisa cuando no hay guía disponible y no debe usarse para decidir tratamientos.
- Autenticación y autorización: los perfiles de interfaz no son identidades autenticadas ni controles de acceso.

## Próximos pasos del proyecto

1. **Procedimientos y seguridad médica:** incorporar protocolos de misión aprobados con identificador, versión, fuente, fecha de vigencia, aprobadores y uso offline.
2. **Inventario de misión:** integrar cantidades, ubicación, expiración, estado y restricciones; relacionar recursos con procedimientos aprobados.
3. **Comunicaciones tolerantes a demoras:** añadir un servicio autenticado de cola y sincronización con estados distintos para creado, pendiente, transmitido, entregado, confirmado y respondido.
4. **Datos y seguridad:** definir identidad y autorización, persistencia segura, auditoría, respaldo y sincronización sin duplicados.
5. **Sensores y trazabilidad:** conectar dispositivos solo mediante interfaces documentadas; conservar fuente, unidad, sello temporal, calidad y estado de conexión.
6. **NASA HRP:** ampliar el mapa de los cinco peligros y mantener un catálogo de investigaciones separado de recomendaciones clínicas.
7. **Visualización e investigación:** validar dimensiones, rangos y resúmenes semanales/mensuales con especialistas antes de usarlos operacionalmente.
8. **Validación:** añadir pruebas de interfaz y casos de error para operación sin conexión, registros incompletos, inventario vencido y sincronización interrumpida.

## Referencias

- [NASA Human Research Program: riesgos de vuelos espaciales](https://www.nasa.gov/hrp/risks/)
- [NASA: los cinco peligros de los vuelos espaciales humanos](https://www.nasa.gov/hrp/hazards/)
- [NASA HRP: investigaciones en curso](https://www.nasa.gov/hrp/ongoing-hrp-research/)
- [NASA Open Science Data Repository](https://science.nasa.gov/biological-physical/data/osdr/) — repositorio de datos; un enlace no significa que esta app haya incorporado o validado un dataset.
- [Reto 2026: software de monitoreo de salud para astronautas](https://youtu.be/RERG3gEmdC8) — no se obtuvo una transcripción verificable; no se atribuyen requisitos específicos al video.
- [NOAA SWPC: escalas observadas](https://services.swpc.noaa.gov/products/noaa-scales.json)
- [NASA: investigación sobre demoras de comunicación](https://ntrs.nasa.gov/citations/20250000703)

Los datos, protocolos, enlaces y requisitos de misión deben revisarse por sus responsables científicos, médicos y operacionales antes de cualquier uso en vuelo.
