# Cosmic Ray 64

[English project guide](./README_EN.md)

Aplicación web local para apoyar el monitoreo del bienestar y el rendimiento humano durante misiones espaciales. La interfaz está disponible en español e inglés y funciona con React, Vite, TypeScript, Recharts y almacenamiento local del navegador.

## Aviso de demostración

Este proyecto es un prototipo educativo. No diagnostica enfermedades, no sustituye al personal médico y no afirma medir signos vitales sin sensores. Los perfiles y algunos historiales incluidos sirven para demostrar la interfaz. Los valores de signos vitales están marcados como simulados o ingresados manualmente.

## Requisitos

- Node.js 20 o superior.
- npm incluido con Node.js.
- Un navegador moderno.

No se necesita una cuenta de internet para ejecutar la aplicación después de instalar las dependencias. Los datos guardados por la app permanecen en `localStorage` del navegador.

## Instalación y ejecución

Desde la carpeta del proyecto:

```bash
npm install
npm run dev
```

Abre la dirección que muestre Vite, normalmente `http://127.0.0.1:5173/`.

Para validar una compilación de producción:

```bash
npm run build
npm run preview
```

## Funciones actuales

- Resumen diario con tarjetas de sueño, ánimo, estrés y cansancio.
- Índice orientativo calculado solo cuando existen registros actuales y referencia personal suficiente.
- Señales explicables basadas en reglas transparentes.
- Gráficas dinámicas con línea base, promedio móvil y periodos de misión.
- Eventos de misión sobre la gráfica: cambio de turno, EVA y comunicación retrasada.
- Prueba de tiempo de reacción real con detección de respuesta anticipada.
- Chequeo diario de sueño, ánimo, estrés, cansancio y síntomas.
- Signos vitales manuales opcionales, guardados por tripulante y fecha, sin valores ficticios precargados.
- Cinco perfiles ficticios de tripulantes.
- Escenarios de riesgo: órbita terrestre, Luna, Marte y caminata espacial.
- Modo de emergencia con temporizador, roles, checklist y resumen local.
- Fuentes y límites junto a las funciones que utilizan referencias externas.
- Registros locales; la versión web todavía no garantiza abrirse o recargarse sin internet.

## Cómo revisar la app

1. En **Resumen**, cambia el tripulante; los registros y pendientes se muestran por persona.
2. En la gráfica, cambia el indicador y el periodo.
3. Pulsa los eventos de misión debajo de la gráfica para abrir su explicación.
4. En **Chequeo diario**, guarda un registro.
5. En **Cognición**, inicia la prueba, espera la señal verde y pulsa el círculo.
6. En **Riesgos de misión**, cambia el escenario.
7. En **Emergencia médica**, inicia el registro, asigna roles y finalízalo cuando termine el ejercicio.
8. En **Riesgos de misión**, **Modo Marte** o **Preparar salida**, abre **Fuente y límites** para consultar las referencias.

## Estructura principal

- `src/App.tsx`: interfaz, perfiles, reglas, gráficas, riesgos, emergencia y navegación.
- `src/styles.css`: diseño responsive para computadora y tableta.
- `src/main.tsx`: entrada de React.
- `package.json`: scripts y dependencias.
- `vite.config.ts`: configuración de Vite.

## Próximas tareas sugeridas

- Añadir opciones de exportación e importación del historial entre dispositivos.
- Separar los componentes grandes de `src/App.tsx` en archivos más pequeños.
- Añadir visualización separada de referencia ficticia e historial personal.
- Seleccionar datasets concretos de NASA OSDR y guardar localmente sus metadatos y referencias.
- Sustituir los textos de emergencia por protocolos revisados por profesionales médicos.
- Agregar inventario de recursos de misión.
- Revisar accesibilidad, privacidad y validación clínica antes de cualquier uso real.

## Fuentes de contexto

La bibliografía se conserva aquí para la documentación y la presentación del proyecto. Los enlaces externos requieren conexión; no hay una sección independiente de Evidencia en el menú.


- NASA Open Science Data Repository: https://science.nasa.gov/biological-physical/data/osdr/
- NASA Five Hazards of Human Spaceflight: https://www.nasa.gov/stem-content/five-hazards-of-human-spaceflight/
- NASA Risks of Human Spaceflight: https://www.nasa.gov/hrp/risks/
- NASA Assisted Medical Procedures: https://techport.nasa.gov/projects/18874


## Modo Marte e historial conectado

- El chequeo actualiza las tarjetas, señales y gráficas; se guarda una entrada por tripulante y fecha local. Guardar otra vez actualiza ese día.
- La reacción medida se incorpora al registro del mismo tripulante y día. Una respuesta anticipada no se guarda. El índice espera ambos registros cuando hay datos personales.
- En las gráficas, el selector separa ejemplos ficticios y registros personales; nunca se unen en una misma serie. Los periodos de 7 y 30 días filtran fechas reales e incluyen hoy. La referencia personal requiere tres fechas previas por indicador; los ejemplos usan su propia referencia ficticia. Los datos ausentes se muestran como huecos.
- Modo Marte permite elegir jornada normal, cambio de turno o preparación de EVA; registrar coordinación y bitácora; descargar un informe y la copia fija del último envío simulado.
- Latencia ilustrativa de 4, 10, 20 o 22 minutos por trayecto. En modo demo ×120, 40 minutos de ida y vuelta transcurren en 20 segundos reales. Se supone respuesta inmediata del guion en Tierra.
- Temporizador y bitácora persisten al recargar o cambiar de sección. Los registros se guardan en este navegador y origen: localhost, el enlace de Azure y el dominio propio tienen almacenes independientes.
- No hay comunicación real con Tierra, respuesta de IA, diagnóstico ni autorización de EVA. La web necesita cargar inicialmente: no hay service worker ni instalación offline.
- Investigación de contexto: [NASA: Assessment of the State of Communication Delay Research](https://ntrs.nasa.gov/citations/20250000703). Es una referencia, no un dataset incorporado ni respaldo de NASA.

### Demostración breve

1. Selecciona un tripulante y guarda el chequeo diario.
2. Completa la prueba cognitiva esperando la señal verde.
3. En Modo Marte, elige escenario y demo ×120; pulsa «Simular envío a Tierra».
4. Durante la espera, completa tareas y escribe en la bitácora.
5. Observa la respuesta de guion y descarga el informe. Cambia de tripulante para comprobar la separación del historial.

### Validación

Las pruebas usan el soporte TypeScript de Node.js 22.13 o superior.

```bash
npm test
npm run build
```

## Preparación de salida y clima espacial

La sección **Preparar salida** incorpora:

- Consulta directa, sin clave, de las escalas observadas [NOAA SWPC](https://services.swpc.noaa.gov/products/noaa-scales.json). S, R y G conservan sus significados distintos; no se calcula dosis personal.
- Fecha de observación y consulta en UTC. Solo se presenta como reciente una respuesta verificada y de hasta 30 minutos (criterio de interfaz, no operacional). Si falla la red, la última copia se identifica como referencia sin vigencia verificada; no se sustituye por datos inventados.
- Reproducción de tres avisos NOAA del 19–20 de enero de 2026, enlazados a sus originales. El control avanza por fichas documentales, sin interpolar mediciones ni simular un pronóstico. La ficha S4 no asigna una hora exacta.
- Dos planes editables por tripulante: destino, fecha/hora local, duración, responsable, latencia, checklist y observaciones. Se conservan en `cosmic-exit-plans-v1-{profileId}`. Los registros personales de hoy se muestran aparte.
- Tabla comparativa e informe de texto descargable con la fuente ambiental, fecha, límites y decisiones registradas por el usuario.

Las observaciones de NOAA describen el entorno terrestre y no se extrapolan a Luna o Marte. No se pronostica una ventana segura, no se declara aptitud médica y no se autoriza una salida. Una escala S0 tampoco implica ausencia de radiación. NASA DONKI se ofrece como referencia adicional; su API no se integra en esta versión.

Para demostrar: abre **Preparar salida**, consulta NOAA, cambia a **Reproducir evento histórico**, reproduce la secuencia, modifica los planes A/B y descarga la comparación.

## Orientación y relevo de turno

En Resumen, «Tu siguiente paso» prioriza el chequeo y la reacción de hoy, y después la revisión documental de un plan cuya salida esté prevista para hoy. Un plan documentado requiere responsable, checklist completo y observaciones; no constituye autorización de salida.

«Resumen del turno» reúne los registros personales de hoy, señales orientativas, planes guardados y la última bitácora de Marte, señalando que esta puede pertenecer a otro turno. Permite añadir receptor y notas, guardar el último cierre por tripulante y descargar tanto el informe actual como el cierre anterior. La clave es `cosmic-turn-last-v1-{profileId}`. Cerrar un turno no borra registros ni transmite datos.

La identidad visual de Cosmic Ray 64 utiliza verde petróleo, cobre y fondos oscuros propios. No se incorporan logos, banderas, insignias ni identificadores de misiones de NASA; las menciones textuales conservadas son citas de fuentes científicas. No se añadió un modo demostración general.

## Pulido de registros, formularios e idioma

- Cambia entre Español y English desde la cabecera sin recargar la página. La elección se conserva en el dispositivo y las notas escritas por el usuario no se traducen.
- Resumen abre con registros personales de hoy, sin completar ausencias con ejemplos. El selector «Ejemplos ficticios» cambia conjuntamente tarjetas, índice, señales y gráfica a un historial ilustrativo claramente identificado. «Registros personales» recupera la lectura personal sin modificar sus registros. Los informes y las demás pantallas siguen usando datos personales.
- La referencia personal usa los tres primeros registros anteriores de cada indicador (se requieren tres fechas previas para ese indicador). El índice no aparece hasta tener los indicadores actuales y la referencia completa. Sus reglas son ilustrativas, no un modelo clínico validado.
- Signos vitales abre campos vacíos o el registro manual de hoy. Se validan números positivos, saturación de hasta 100% y formato sistólica/diastólica; no se generan límites clínicos personalizados.
- Emergencia está en el menú principal, también en móvil. El inicio, estado, roles, checklist y notas se recuperan al cambiar de pantalla o recargar. El temporizador usa la hora de inicio guardada. Al preparar otro evento, el anterior se archiva localmente.
- Los formularios muestran errores y estados de guardado. El chequeo se puede enviar desde el teclado. Las explicaciones extensas están en desplegables y el informe de turno incorpora signos vitales y el último evento con sus fechas.
- Las gráficas se cargan en un archivo separado para reducir el tamaño de la descarga inicial.

Los registros antiguos bajo claves generales se conservan, pero no se asignan automáticamente a un tripulante. La app sigue almacenando datos por navegador y origen: localhost y el dominio publicado no comparten registros. No se implementó un modo demostración general ni una instalación offline de la web.
