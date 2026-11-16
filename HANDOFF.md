# Documento de transferencia

Este documento sirve para que otra persona pueda continuar el proyecto sin perder el contexto.

## Estado actual

La aplicación compila con `npm run build` y se ejecuta localmente con Vite. El prototipo ya contiene resumen, chequeo diario, cognición, signos vitales, riesgos de misión, modo emergencia, gráficas explorables y referencias contextuales.

## Instalación para continuar

```bash
git clone [PEGAR_AQUÍ_LA_URL_DEL_REPOSITORIO]
cd "Cosmic Ray 64"
npm install
npm run dev
```

Si la carpeta clonada tiene otro nombre, usa ese nombre en el comando `cd`.

## Qué debe saber la persona que continúe

- No hay sensores físicos conectados.
- Los signos vitales de demostración son simulados y están identificados en la interfaz.
- No existe un modelo clínico entrenado.
- Las alertas actuales son reglas transparentes y orientativas.
- La prueba cognitiva calcula el tiempo entre la señal visual y el clic del usuario.
- Los datos de la aplicación se guardan en `localStorage`.
- El modo emergencia organiza tareas y registra el evento; no prescribe tratamientos.
- Las referencias de NASA/OSDR son fuentes de contexto y no representan respaldo o certificación de NASA para esta aplicación.

## Estado de entrega

La aplicación se considera terminada para la entrega del proyecto. Este repositorio conserva el código fuente completo, la documentación técnica, las referencias utilizadas y las instrucciones para ejecutar la versión local. Las modificaciones posteriores deben tratarse como mantenimiento o nuevas versiones, no como tareas pendientes de esta entrega.

## Indicaciones para el siguiente desarrollador

### Objetivo que quiero priorizar

<!-- Completar aquí con la siguiente función que se desea desarrollar. -->

### Decisiones de producto

<!-- Completar aquí: qué debe conservarse, qué debe cambiarse y qué no debe implementarse. -->

### Fuentes o datasets aprobados

<!-- Completar aquí con enlaces, identificadores OSDR y condiciones de uso. -->

### Personas que deben revisar cambios sensibles

<!-- Completar aquí con los responsables de producto, investigación o revisión médica. -->

### Notas de la última sesión

<!-- Completar aquí cualquier decisión o problema descubierto. -->


## Incorporación: Modo Marte

El historial vive en `cosmic-daily-v1`; cada sesión de Marte usa `cosmic-mars-v1-{profileId}`. Los registros antiguos sin perfil (`cosmic-checkin` y `cosmic-reaction-history`) se conservan pero no se atribuyen a una persona automáticamente.

`src/mission.ts` contiene validación, actualización por fecha/perfil y cálculo del reloj. `src/MarsMode.tsx` contiene el simulador, bitácora, historial e informes. Las transmisiones guardan una copia fija del informe y la configuración de tiempo usada al enviar.

Los datos se mantienen locales al navegador y origen, sin sincronización ni backend. El escenario de Marte no modifica los escenarios de la sección Riesgos. La evidencia integrada es una referencia a investigación NASA, no un dataset analizado. Se incorporó interfaz español/inglés; no se presenta ningún dataset OSDR como si hubiera sido analizado.

## Incorporación: preparación de salida

`src/spaceWeather.ts` valida la respuesta NOAA, distingue datos ausentes de escala cero, calcula la vigencia y genera explicaciones de revisión. `src/ExitReadiness.tsx` integra consulta con cancelación/timeout, copia local marcada, reproducción de avisos históricos, planes A/B e informe descargable.

Fuente actual: `https://services.swpc.noaa.gov/products/noaa-scales.json`, entrada `0` (observación actual). El caché `cosmic-weather-v1` conserva fecha de observación y consulta, pero requiere una consulta exitosa al abrir para marcarse como reciente. Las fichas históricas conservan sus enlaces NOAA individuales. No hay interpolación, dosimetría ni estimación de riesgo clínico. Las nueve pruebas cubren historial, reloj, validación de planes y tratamiento de datos ambientales ausentes/antiguos.

## Navegación y referencias

Se retiró la pantalla independiente de Evidencia. La bibliografía permanece en README y las referencias aplicables aparecen en desplegables «Fuente y límites» dentro de Riesgos de misión, Modo Marte y Preparar salida. La etiqueta general indica registros locales sin prometer disponibilidad offline completa.

## Orientación y cierre de turno

`src/TurnBrief.tsx` contiene el informe de relevo y lectura defensiva de planes/bitácora. `nextStep` en `src/mission.ts` ordena los pendientes. El cierre conserva una copia fija del informe local por tripulante; los registros personales no se reemplazan por datos ficticios. La nueva paleta propia usa verde petróleo y cobre; los tokens CSS ya no hacen referencia a NASA. Se mantienen las citas textuales, sin elementos gráficos de marca ni modo demostración nuevo.

## Estado después del pulido integral

- `src/records.ts`: validación/lectura de signos y emergencias, tiempo transcurrido y filtros por fechas.
- `src/Vitals.tsx`: registro manual por persona/fecha (`cosmic-vitals-v2-{profileId}-{date}`).
- `src/EmergencyMode.tsx`: borrador/evento por perfil (`cosmic-emergency-v2-{profileId}`) y archivo previo al iniciar otro evento (`cosmic-emergency-archive-v2-{profileId}`). No sobrescribe claves legacy.
- `src/TrendExplorer.tsx`: carga diferida de Recharts; selector personal/ejemplo y periodos calendario sin datos ficticios mezclados.
- `src/i18n.tsx` y `src/translations.ts`: textos locales ES/EN. La traducción opera sobre texto de React antes de renderizar, sin modificar el DOM ni valores de formularios. Los informes marcan explícitamente los campos de usuario para conservarlos literalmente. Ampliar el catálogo al introducir textos nuevos.
- La referencia de cada métrica usa tres registros anteriores al día actual; el índice requiere referencia y datos actuales completos. No se presenta como validación clínica.
- La emergencia ya es accesible en el menú móvil. El diálogo de relevo mantiene el foco y desactiva el fondo mientras está abierto.
- El resumen de turno incluye signos manuales de hoy y la fecha/estado del último evento, que puede pertenecer a otro turno.

Validación: `npm test` y `npm run build`, más recorridos de navegador de ambos idiomas, persistencia por perfil, recuperación de evento y vistas móviles. La versión de entrega se publica mediante GitHub y Azure Static Web Apps.

## Selector de ejemplos en el resumen

El selector existente ahora cambia tarjetas, índice, señales y gráfica conjuntamente. Por defecto abre con registros personales; seleccionar ejemplos no escribe registros y volver restaura los valores personales. Los ejemplos usan los tres primeros días del perfil como referencia y el último como lectura actual. `assessWellbeing` centraliza las mismas reglas ilustrativas para ambas fuentes; los informes y las demás pantallas reciben exclusivamente la evaluación personal. No se añadió un modo general de demostración.

Comprobación: Luna muestra 79/100 y tres señales en el ejemplo; al volver, las tarjetas personales y el almacenamiento permanecen iguales. Se verificaron textos ES/EN y ancho móvil de 390 px.
