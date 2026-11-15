// English copy is kept locally: no translation service or network is required.
const pairs = `
Resumen|Overview
Chequeo diario|Daily check-in
Cognición|Cognition
Signos vitales|Vital signs
Riesgos de misión|Mission risks
Modo Marte|Mars mode
Preparar salida|Plan an EVA
Emergencia|Emergency
Estado de hoy|Today's status
Rendimiento cognitivo|Cognitive performance
Preparación de salida|EVA preparation
Modo emergencia|Emergency coordination
MISIÓN|MISSION
TRIPULANTE|CREW MEMBER
LOCAL · REGISTROS PROPIOS|LOCAL · PERSONAL RECORDS
Almacenamiento local activo|Local storage active
Sin conexión a comunicaciones reales. Esta interfaz apoya la conversación con la tripulación y el personal médico.|No real communications are connected. This interface supports discussion with the crew and medical team.
Registro local|Local record
El chequeo y la prueba cognitiva usan tus entradas y mediciones realizadas en esta pantalla. La aplicación no diagnostica ni reemplaza una evaluación médica.|The check-in uses your entries and the cognitive test measures your clicks. This app does not diagnose conditions or replace a medical evaluation.
REGISTROS LOCALES|LOCAL RECORDS
TU SIGUIENTE PASO|YOUR NEXT STEP
Completa tu chequeo de hoy|Complete today's check-in
Registra sueño, ánimo, estrés y cansancio para actualizar tu resumen.|Record sleep, mood, stress and fatigue to update your overview.
Abrir chequeo|Open check-in
Registra tu tiempo de reacción|Record your reaction time
La prueba de hoy todavía está pendiente para este tripulante.|Today's test is still missing for this crew member.
Abrir prueba|Open test
Revisa un plan de salida|Review an EVA plan
Completa responsable, fecha, checklist y observaciones en una de las alternativas. El registro no autoriza una salida.|Add a reviewer, date, checklist and notes to one alternative. Recording a review does not authorize an EVA.
Revisar planes|Review plans
Preparación registrada|Preparation recorded
Tus registros de hoy están completos y hay un plan documentado. Puedes revisar pendientes y preparar el relevo de turno.|Today's records are complete and a plan is documented. Review outstanding items and prepare the shift handover.
Ver planes|View plans
Resumen del turno|Shift handover
LECTURA INTEGRAL|DAILY OVERVIEW
Sin registros de hoy|No records today
Construyendo tu referencia|Building your baseline
Observar evolución|Monitor changes
Dentro de tu rango habitual|Within your usual range
Referencia: primeros tres registros previos por indicador; índice orientativo.|Baseline: first three previous records per metric; the index is illustrative.
Referencia personal pendiente: se necesitan al menos tres fechas previas por indicador.|Personal baseline pending: each metric needs at least three previous dates.
ÍNDICE DE BIENESTAR|WELLBEING INDEX
Faltan registros o referencia personal|Records or personal baseline missing
Entrada personal de hoy|Today's personal entry
Pendiente de registro|Entry pending
Sueño|Sleep
Ánimo|Mood
Estrés percibido|Perceived stress
Estrés|Stress
Cansancio|Fatigue
TENDENCIA PERSONAL · EXPLORABLE|EXPLORE PERSONAL TRENDS
Registros personales|Personal records
Ejemplos ficticios|Fictional examples
Datos de la gráfica|Chart data
Datos del resumen|Overview data
EJEMPLOS FICTICIOS · SIN GUARDAR|FICTIONAL EXAMPLES · NOT SAVED
EJEMPLOS FICTICIOS · SOLO PARA MOSTRAR|FICTIONAL EXAMPLES · FOR PRESENTATION ONLY
Resumen con datos ficticios|Overview with fictional data
Tarjetas, índice, señales y gráfica usan el mismo historial de ejemplo. No se guardan como registros personales. Cambia de tripulante para explorar otros ejemplos.|Cards, index, signals and chart use the same example history. They are not saved as personal records. Switch crew members to explore other examples.
Volver a registros personales|Return to personal records
EJEMPLO FICTICIO|FICTIONAL EXAMPLE
ÍNDICE ILUSTRATIVO · EJEMPLO|ILLUSTRATIVE INDEX · EXAMPLE
Señales del ejemplo|Example signals
Registrar mis datos personales|Enter my personal records
Dato ficticio de ejemplo|Fictional example value
EJEMPLOS FICTICIOS · EXPLORABLE|EXPLORE FICTIONAL EXAMPLES
Indicador|Metric
Periodo|Period
Reacción (ms)|Reaction (ms)
Reacción|Reaction
7 días|7 days
30 días|30 days
Toda la misión|All records
Ejemplos ficticios separados de tus registros. No representan mediciones personales.|Fictional examples are separate from your records. They are not personal measurements.
Registros por fecha real. Los datos ausentes dejan huecos; la referencia requiere tres fechas previas.|Records use calendar dates. Missing values leave gaps; a baseline requires three previous dates.
No hay registros para este periodo.|No records for this period.
Ejemplo ficticio|Fictional example
Registro personal|Personal record
Referencia ficticia|Fictional baseline
Referencia personal|Personal baseline
Promedio móvil|Moving average
Línea base|Baseline
EVENTOS DE MISIÓN|MISSION EVENTS
Cambio de turno|Shift change
Comunicación retrasada|Delayed communication
EXPLORAR QUÉ OCURRIÓ|EXPLORE THE EVENT
Esta relación ayuda a observar tendencias; no es un diagnóstico.|This relationship helps explore trends; it is not a diagnosis.
LECTURAS EXPLICABLES|EXPLAINABLE SIGNALS
Señales de hoy|Today's signals
Sin señales destacadas|No signals highlighted
Las señales se muestran cuando hay registros y una referencia personal suficiente.|Signals appear when records and a sufficient personal baseline are available.
Completar chequeo de hoy|Complete today's check-in
3 MINUTOS · REGISTRO LOCAL|3 MINUTES · LOCAL RECORD
¿Cómo estás hoy?|How are you today?
Responde según cómo te sientes ahora. No hay respuestas correctas.|Answer according to how you feel now. There are no correct answers.
Horas de sueño|Hours of sleep
Incluye despertares largos.|Account for long periods awake.
Bajo|Low
Muy bien|Very good
Alto|High
Nada|None
Mucho|A lot
Síntomas o notas opcionales|Optional symptoms or notes
Escribe algo que quieras comentar con la tripulación…|Write something you would like to discuss with the crew…
Guardar chequeo local|Save check-in
Ingresa sueño de 0 a 14 horas y escalas de 0 a 10.|Enter 0–14 hours of sleep and ratings from 0–10.
Registro guardado por tripulante y fecha|Record saved by crew member and date
No se pudo guardar: revisa el almacenamiento del navegador|Could not save: check browser storage
PRUEBA BREVE · ATENCIÓN|BRIEF ATTENTION TEST
Tiempo de reacción|Reaction time
Presiona “Iniciar prueba”, espera el cambio a verde y toca el círculo lo más rápido posible. Una pulsación antes de la señal se marca como respuesta anticipada.|Select “Start test”, wait for green and press the circle as quickly as possible. Pressing before the signal counts as an early response.
Responder a la señal de reacción|Respond to the reaction signal
¡AHORA!|NOW!
Espera…|Wait…
Anticipada|Too early
Listo|Ready
Midiendo…|Measuring…
Repetir prueba|Repeat test
Iniciar prueba|Start test
Tiempo medido con tu clic y guardado localmente.|Measured with your click and saved locally.
Referencia personal pendiente.|Personal baseline pending.
No se guardó un resultado: espera la señal verde.|No result saved: wait for the green signal.
Respuesta anticipada: inicia otra vez y espera la señal verde|Early response: restart and wait for green
ENTRADA MANUAL|MANUAL ENTRY
Introduce únicamente valores que hayas medido con un dispositivo externo. Estos campos no se rellenan con ejemplos ni generan un diagnóstico.|Only enter values measured with an external device. These fields do not contain example values or generate diagnoses.
Pulso|Pulse
Saturación|Oxygen saturation
Temperatura|Temperature
Glucosa|Glucose
lpm|bpm
Opcional|Optional
Entrada manual · sistólica/diastólica|Manual entry · systolic/diastolic
Presión arterial|Blood pressure
Introduce al menos un valor válido. Usa números positivos, oxígeno de hasta 100% y presión como 120/80.|Enter at least one valid value. Use positive numbers, oxygen up to 100%, and blood pressure such as 120/80.
No se pudo guardar. Revisa el almacenamiento del navegador.|Could not save. Check browser storage.
Guardar registro local|Save local record
Cambios sin guardar|Unsaved changes
✓ Guardado|✓ Saved
Cómo se guardan los datos|How data is saved
Cada tripulante tiene su registro por fecha en este navegador. Guardar de nuevo actualiza los valores del mismo día. Los registros antiguos sin perfil se conservan sin atribuirlos a una persona.|Each crew member has a dated record in this browser. Saving again updates that day's values. Older records without a profile are retained without assigning them to a person.
MISSION SCENARIO LAB · CONTEXTO, NO DIAGNÓSTICO|MISSION SCENARIO LAB · CONTEXT, NOT DIAGNOSIS
¿Qué cambia en este entorno?|What changes in this environment?
Selecciona una fase de misión para ver qué riesgos requieren más observación y qué datos pueden ayudar a la tripulación.|Select a mission phase to explore relevant hazards and the information that may help the crew.
FASE|PHASE
COMUNICACIÓN|COMMUNICATION
EVACUACIÓN|EVACUATION
AUTONOMÍA|AUTONOMY
PRIORIDAD DE ESTE ESCENARIO|SCENARIO FOCUS
Estos niveles son una guía educativa de contexto. No representan el riesgo médico individual de ningún tripulante.|These levels provide educational context. They do not represent any crew member's individual medical risk.
OBSERVAR|OBSERVE
Medio|Medium
Base|Baseline
Fuente y límites|Source and limitations
Los escenarios son una guía educativa, no una evaluación individual ni una autorización de salida.|Scenarios are educational guidance, not individual assessments or EVA authorizations.
Marco de peligros de NASA ↗ · requiere conexión|NASA hazard framework ↗ · connection required
Órbita terrestre|Earth orbit
Superficie lunar|Lunar surface
Superficie de Marte|Mars surface
Tránsito y superficie lunar|Lunar transit and surface
Tránsito a Marte|Mars transit
Caminata espacial|Spacewalk
Radiación espacial|Space radiation
Aislamiento y confinamiento|Isolation and confinement
Distancia de la Tierra|Distance from Earth
Campos de gravedad|Gravity fields
Entorno hostil/cerrado|Hostile/closed environment
MARS OPERATIONS · SIMULACIÓN EDUCATIVA|MARS OPERATIONS · EDUCATIONAL SIMULATION
La Tierra puede esperar. El registro continúa.|Earth can wait. Keep the record moving.
Organiza el turno, observa tus registros y prepara un informe mientras simulas la demora de comunicación.|Organize your shift, review records and prepare a report while simulating communication delays.
SIN ENVÍO REAL|NO REAL TRANSMISSION
01 · PREPARAR MISIÓN|01 · PREPARE THE MISSION
Contexto del turno|Shift context
Escenario|Scenario
Jornada normal|Routine shift
Preparación de EVA|EVA preparation
Deja un registro claro para quien recibe el siguiente turno.|Leave a clear record for the incoming shift.
Documenta preparación y coordinación. Estos resultados no autorizan una caminata espacial.|Document preparation and coordination. These results do not authorize a spacewalk.
Completa los registros y documenta lo que cambió durante la jornada.|Complete the records and document changes during the shift.
✓ Revisar chequeo|✓ Review check-in
1. Completar chequeo|1. Complete check-in
2. Medir reacción|2. Measure reaction
Registros por tripulante y fecha, guardados en este navegador. No se sincronizan entre dispositivos.|Records are saved by crew member and date in this browser. They do not sync across devices.
02 · ENLACE CON TIERRA|02 · EARTH LINK
Comunicación con demora|Delayed communication
Minutos por trayecto|Minutes each way
Reloj de simulación|Simulation clock
Demo acelerada ×120|Accelerated simulation ×120
Tiempo real ×1|Real time ×1
Se supone respuesta inmediata del guion al llegar a Tierra.|The scripted reply is assumed to be immediate upon arrival at Earth.
Simulación en curso|Simulation running
Simular nuevo envío|Simulate another transmission
Simular envío a Tierra|Simulate transmission to Earth
Completa el chequeo y la prueba de hoy para habilitar el envío.|Complete today's check-in and test to enable the simulated transmission.
En camino a Tierra|Outbound to Earth
Respuesta de guion en camino|Scripted reply inbound
Respuesta simulada recibida|Simulated reply received
Respuesta de guion|Scripted reply
Informe recibido en esta simulación. Mantén la bitácora al día y entrega las observaciones al responsable del turno. Este mensaje no interpreta resultados ni prescribe atención.|Report received in this simulation. Keep the log updated and hand observations to the shift lead. This message does not interpret results or prescribe care.
03 · AUTONOMÍA A BORDO|03 · ONBOARD AUTONOMY
Coordinar durante la espera|Coordinate while waiting
Identificar al responsable del turno y confirmar el relevo.|Identify the shift lead and confirm the handover.
Revisar la documentación y los recursos asignados a la tarea.|Review the documentation and resources assigned to the task.
Registrar observaciones y preparar la siguiente actualización.|Record observations and prepare the next update.
Bitácora del turno|Shift log
Responsables, tareas y observaciones…|Owners, tasks and observations…
04 · INFORME TRAZABLE|04 · TRACEABLE REPORT
Resumen para Tierra|Report for Earth
Descargar informe actual|Download current report
Descargar copia del envío|Download transmission snapshot
HISTORIAL PERSONAL|PERSONAL HISTORY
Registros por fecha|Records by date
Entradas personales y reacción medida; “—” significa dato pendiente.|Personal entries and measured reaction times; “—” means missing data.
Fecha|Date
Todavía no hay registros personales para este tripulante.|No personal records for this crew member yet.
¿Por qué simular una demora?|Why simulate a delay?
NASA estudia cómo los retrasos de comunicación afectan las operaciones más allá de la órbita terrestre; su revisión describe hasta 44 minutos de ida y vuelta para Marte. Aquí eliges una latencia ilustrativa: no se calcula la posición actual de los planetas.|NASA studies the effects of communication delays beyond Earth orbit; its review describes up to 44 minutes round-trip for Mars. The delay here is illustrative and does not use current planetary positions.
Consultar investigación de NASA ↗|Read the NASA research ↗
Referencia de investigación, no dataset integrado ni respaldo de NASA. La simulación funciona en el navegador una vez cargada; esta versión no instala una copia offline de la web.|Research reference, not an integrated dataset or NASA endorsement. The simulation works after loading in the browser; this version does not install an offline copy.
EVA BRIEFING · CLIMA ESPACIAL Y PREPARACIÓN|EVA BRIEFING · SPACE WEATHER AND PREPARATION
Antes de abrir la escotilla|Before opening the hatch
Compara dos planes, revisa el contexto solar y documenta qué falta confirmar. Las observaciones ambientales y tus registros se presentan por separado.|Compare two plans, review the solar context and document outstanding checks. Environmental observations and personal records are shown separately.
Observación actual|Current observation
Reproducir evento histórico|Replay historical event
CONSULTANDO NOAA|CHECKING NOAA
OBSERVACIÓN RECIENTE · NOAA|RECENT OBSERVATION · NOAA
REFERENCIA SIN VIGENCIA VERIFICADA|REFERENCE · CURRENT VALIDITY UNVERIFIED
DATOS NO DISPONIBLES|DATA UNAVAILABLE
ARCHIVO HISTÓRICO · ENERO 2026|HISTORICAL ARCHIVE · JANUARY 2026
Tormenta solar · 19–20 enero 2026|Solar storm · January 19–20, 2026
Entorno espacial observado cerca de la Tierra|Observed near-Earth space environment
Actualizar NOAA|Refresh NOAA
Consultando…|Checking…
No se pudo verificar NOAA. Si hay una copia anterior, se muestra solo como referencia. Reintenta la consulta.|NOAA could not be verified. Any previous copy is shown for reference only. Try again.
Radiación solar|Solar radiation
Perturbaciones de radio|Radio disturbances
Actividad geomagnética|Geomagnetic activity
No disponible en esta fuente|Unavailable in this source
Sin tormenta en esta escala|No storm on this scale
Evento observado · revisar contexto|Observed event · review context
Pausar reproducción|Pause playback
Reproducir secuencia|Play sequence
Avanzar por avisos históricos|Browse historical notices
Abrir aviso original de NOAA ↗|Open original NOAA notice ↗
Reproducción de tres avisos documentados, sin interpolación. R y G se omiten: estas fichas no contienen observaciones equivalentes. No son las condiciones de hoy.|Replay of three documented notices, without interpolation. R and G are omitted because these cards lack equivalent observations. These are not today's conditions.
Observación|Observation
Consulta|Retrieved
Se considera reciente una observación de hasta 30 minutos, como criterio de interfaz. No es una garantía operativa. Pulsa Actualizar para volver a consultar.|The interface treats observations up to 30 minutes old as recent. This is not an operational guarantee. Select Refresh to check again.
Ver datos originales NOAA ↗|View original NOAA data ↗
S0 no equivale a “espacio seguro”. Las escalas no calculan dosis personal y no describen por sí solas el entorno de la Luna o Marte. R y G tienen significados distintos de S.|S0 does not mean “safe space”. These scales do not calculate personal dose or describe conditions on the Moon or Mars. R and G have different meanings from S.
Consultar las escalas NOAA.|Read the NOAA scales.
Preparación personal de hoy|Today's personal preparation
Las señales requieren tres fechas previas por indicador para formar una referencia personal. No determinan aptitud médica ni se convierten en una probabilidad de daño.|Signals require three previous dates per metric to form a personal baseline. They do not determine medical fitness or a probability of harm.
Abrir chequeo diario|Open daily check-in
Abrir prueba cognitiva|Open cognitive test
ALTERNATIVA|ALTERNATIVE
Plan A · salida breve|Plan A · short EVA
Plan B · salida extendida|Plan B · extended EVA
Nombre del plan|Plan name
Destino|Destination
Duración prevista (min)|Planned duration (min)
Salida prevista (hora local)|Planned departure (local time)
Responsable de revisión|Reviewer
Nombre del responsable|Reviewer's name
Demora de comunicación por trayecto (min)|Communication delay each way (min)
Checklist declarado por el usuario|User-declared checklist
Equipo y soporte vital revisados según procedimiento.|Equipment and life support checked according to procedure.
Compañero y responsable de coordinación identificados.|Partner and coordination lead identified.
Enlace de comunicación y alternativa revisados.|Primary and backup communication links reviewed.
Procedimiento y recursos de contingencia disponibles.|Procedure and contingency resources available.
REVISIÓN REQUERIDA · SIN AUTORIZACIÓN AUTOMÁTICA|REVIEW REQUIRED · NO AUTOMATIC AUTHORIZATION
Decisión y observaciones del responsable|Reviewer's decision and notes
Documenta la revisión humana y los pendientes…|Document human review and outstanding items…
COMPARACIÓN · MISMA FUENTE AMBIENTAL PARA AMBOS PLANES|COMPARISON · SAME ENVIRONMENTAL SOURCE FOR BOTH PLANS
Qué cambia entre las alternativas|How the alternatives differ
Comparación descriptiva. Una duración menor no demuestra por sí sola menor dosis ni mayor seguridad.|Descriptive comparison. Shorter duration alone does not establish a lower dose or greater safety.
Criterio|Criterion
Duración|Duration
Salida local|Local departure
Sin definir|Not specified
Responsable|Owner
Pendiente|Pending
Verificaciones|Checks
Comunicación ida/vuelta|Round-trip communication
Aplicabilidad ambiental|Environmental applicability
Contexto terrestre; faltan posición y protección|Earth context; position and shielding are missing
No extrapolable desde NOAA a este destino|NOAA observations cannot be extrapolated to this destination
Estado|Status
Requiere revisión humana|Human review required
Descargar comparación e informe|Download comparison and report
Guardado por tripulante en este navegador. No se envía a Tierra.|Saved by crew member in this browser. Not transmitted to Earth.
NOAA aporta escalas observadas y los avisos históricos. NASA DONKI permite explorar eventos solares como referencia adicional; en esta versión no se consulta su API.|NOAA provides observed scales and historical notices. NASA DONKI is an additional reference for solar events; this version does not query its API.
Explorar NASA DONKI ↗|Explore NASA DONKI ↗
No se pronostica una ventana segura ni se estima una dosis. La salida prevista, la duración, el equipo y las decisiones son entradas del usuario.|No safe window is forecast and no dose is estimated. Departure, duration, equipment and decisions are entered by the user.
Falta la fecha y hora de salida; no se evalúa una ventana futura.|Departure date and time are missing; no future window is assessed.
La observación ambiental no es un pronóstico para la fecha y duración de esta salida.|The environmental observation is not a forecast for this departure and duration.
Falta identificar al responsable de revisión.|The reviewer has not been identified.
Falta el chequeo personal de hoy.|Today's personal check-in is missing.
Falta la prueba de reacción de hoy.|Today's reaction test is missing.
No hay una observación de radiación solar vigente y verificable para esta revisión.|No current, verifiable solar radiation observation is available for this review.
S0 indica ausencia de tormenta en esta escala; no significa ausencia de radiación espacial.|S0 means no storm on this scale, not an absence of space radiation.
Las observaciones de NOAA corresponden al entorno terrestre; no describen la exposición en Luna o Marte.|NOAA observations cover the Earth environment; they do not describe exposure on the Moon or Mars.
Reproducción histórica: no representa las condiciones de la salida planificada.|Historical replay: it does not represent conditions for the planned departure.
Faltan dosimetría, posición y protección del traje/vehículo. No se calcula dosis, aptitud médica ni autorización de salida.|Dosimetry, position and suit/vehicle shielding are missing. Dose, medical fitness and EVA authorization are not determined.
Corrige los campos del plan: duración de 10 a 480 min y demora de 0 a 60 min.|Correct the plan: duration must be 10–480 minutes and delay 0–60 minutes.
Corrige los campos numéricos para guardar los planes y exportar el informe.|Correct the numeric fields to save plans and export the report.
RELEVO|HANDOVER
Cerrar resumen de turno|Close shift handover
Revisa los registros y pendientes antes de entregar el turno. El informe conserva una copia de lo que aparece aquí.|Review records and outstanding items before handing over the shift. The report keeps a snapshot of this information.
Último cierre guardado|Last saved handover
Descargar último cierre|Download last handover
Quién recibe el turno|Incoming shift lead
Notas para el relevo|Handover notes
Nombre del responsable entrante|Name of incoming shift lead
Tareas pendientes, decisiones y observaciones…|Outstanding tasks, decisions and observations…
Vista previa del informe|Report preview
✓ Turno guardado|✓ Handover saved
Guardar cierre de turno|Save shift handover
Descargar resumen de turno|Download shift handover
Guardar el cierre conserva el último informe de este tripulante y mantiene sus chequeos y planes.|Saving keeps this crew member's latest handover without deleting check-ins or plans.
Resumen de turno guardado en este dispositivo|Shift handover saved on this device
COORDINACIÓN LOCAL|LOCAL COORDINATION
Organiza responsabilidades y observaciones. Sigue el procedimiento aprobado de la misión. Esta pantalla no contacta servicios externos.|Organize responsibilities and observations. Follow the mission's approved procedure. This screen does not contact external services.
Registro activo|Active record
Evento finalizado|Event closed
Sin iniciar|Not started
TIEMPO DEL EVENTO|EVENT TIMER
Evento observado|Observed event
Evento por describir|Describe the event
Iniciar registro de emergencia|Start emergency record
Finalizar emergencia|Close emergency record
Descargar informe del evento|Download event report
Preparar nuevo evento|Prepare new event
El evento anterior se conservará en el archivo local. Puedes descargar su informe antes de comenzar otro.|The previous event will remain in the local archive. You can download its report before starting another.
Archivar y preparar nuevo|Archive and prepare new
Cancelar|Cancel
Checklist de coordinación|Coordination checklist
Asignar responsable de atención y mantener la escena segura.|Assign a care lead and keep the scene safe.
Asignar responsable de comunicaciones y revisar latencia.|Assign a communications lead and check the delay.
Abrir el procedimiento médico aprobado para este evento.|Open the approved medical procedure for this event.
Localizar el equipo indicado en el inventario de la misión.|Locate the equipment specified in the mission inventory.
Registrar observaciones y tiempos sin interpretar ni diagnosticar.|Record observations and times without interpreting or diagnosing.
Preparar la actualización para el responsable de misión.|Prepare an update for the mission lead.
Observaciones|Observations
Registra cambios y observaciones sin diagnosticar…|Record changes and observations without diagnosing…
ROLES DE LA TRIPULACIÓN|CREW ROLES
Atención|Care
Comunicación|Communication
Registro|Log
Sin asignar|Unassigned
Se conservan el inicio, los roles, las observaciones y el checklist por tripulante al recargar o cambiar de sección.|Start time, roles, observations and checklist are retained by crew member when reloading or changing sections.
No se pudo guardar. Descarga el informe antes de salir.|Could not save. Download the report before leaving.
Registro de emergencia iniciado. No se envió ninguna alerta externa.|Emergency record started. No external alert was sent.
Evento finalizado y guardado en este dispositivo|Event closed and saved on this device
Registro guardado en este dispositivo|Record saved on this device
Sueño por debajo de tu línea base|Sleep below your baseline
Tiempo de reacción más lento|Slower reaction time
Estrés por encima de tu referencia|Stress above your baseline
Cansancio por encima de tu referencia|Fatigue above your baseline
Ánimo por debajo de tu referencia|Mood below your baseline
Sin notas|No notes
Sin registros personales de hoy|No personal records today
Sin especificar|Not specified
Preparado|Prepared
Fecha local|Local date
Recibe el turno|Incoming shift lead
REGISTROS PERSONALES DE HOY|TODAY'S PERSONAL RECORDS
Notas del chequeo|Check-in notes
PLANES GUARDADOS (NO SON AUTORIZACIONES)|SAVED PLANS (NOT AUTHORIZATIONS)
Revisión documental para hoy|Documented review for today
Sin planes guardados.|No saved plans.
COORDINACIÓN DE MODO MARTE (ÚLTIMA SESIÓN GUARDADA)|MARS COORDINATION (LAST SAVED SESSION)
Tareas|Tasks
Bitácora|Log
La sesión de Marte puede corresponder a otro turno; confirmar vigencia al recibirla.|The Mars session may belong to another shift; confirm it is still relevant at handover.
PENDIENTES DE RELEVO|HANDOVER ITEMS
Completar chequeo diario.|Complete daily check-in.
Completar prueba cognitiva.|Complete cognitive test.
Documentar la revisión de un plan para hoy.|Document a plan review for today.
Confirmar vigencia de datos ambientales y revisión humana antes de cualquier tarea.|Confirm environmental data freshness and human review before any task.
NOTAS PARA QUIEN RECIBE|NOTES FOR THE INCOMING SHIFT
Sin notas adicionales.|No additional notes.
Registro local. No se envía a Tierra ni se sincroniza entre dispositivos. No contiene una autorización médica u operativa. Los ejemplos ficticios del resumen no se incluyen como mediciones personales.|Local record. Not sent to Earth or synced across devices. This is not medical or operational authorization. Fictional examples are not included as personal measurements.
medida con clic|measured with a click
pendiente o corresponde a otra fecha|pending or assigned to another date
sin sesión disponible|no session available
sin anotaciones|no entries
registrada|recorded
sin definir|not specified
pendientes|pending
Señales orientativas contra referencia personal|Illustrative signals against personal baseline
Sin señales destacadas en los datos disponibles|No signals highlighted in the available data
No evaluadas: sin registros personales de hoy|Not assessed: no personal records today
Checklist|Checklist
Demora por trayecto|Delay each way
Decisión/observaciones del usuario|User decision/notes
Inicio|Start
Fin|End
Tiempo registrado|Recorded time
Escenario registrado|Recorded scenario
Registro local de coordinación. No es un protocolo clínico ni se envía a servicios de emergencia.|Local coordination record. Not a clinical protocol or a message to emergency services.
Sin envío real, sensores ni diagnóstico. La respuesta de Tierra es un guion fijo. No determina aptitud para EVA.|No real transmission, sensors or diagnosis. Earth's reply is a fixed script. It does not determine EVA fitness.
No es un pronóstico para la salida, cálculo de dosis ni autorización médica u operativa. No existe envío real ni respaldo de NASA/NOAA.|Not a departure forecast, dose calculation or medical/operational authorization. No real transmission or NASA/NOAA endorsement.
Operación cercana a la Tierra|Near-Earth operations
Casi inmediata|Near-immediate
Disponible en horas|Available within hours
Baja|Low
Monitoreo rutinario|Routine monitoring
Misión lunar|Lunar mission
Corta, con posibles interrupciones|Short delay, possible interruptions
Limitada; depende de la fase|Limited; phase-dependent
Media|Medium
Preparación para EVA y retorno|EVA and return preparation
Misión profunda · mitad de trayecto|Deep-space mission · mid-transit
Retraso prolongado|Extended delay
No disponible|Unavailable
Alta|High
Respuesta independiente de la Tierra|Earth-independent response
Actividad extravehicular|Extravehicular activity
Dependiente del enlace y del traje|Link- and suit-dependent
Retorno al vehículo|Return to vehicle
Seguridad de tarea y compañero|Task and partner safety
Registrar exposición y eventos solares cuando existan datos.|Record exposure and solar events when data is available.
Observar sueño, ánimo y cooperación.|Observe sleep, mood and cooperation.
El apoyo de Tierra está disponible con poca demora.|Earth support is available with little delay.
Observar adaptación, equilibrio y ejercicio.|Observe adaptation, balance and exercise.
Revisar ambiente y calidad del descanso.|Review the environment and rest quality.
El escenario requiere registrar exposición y refugio disponible.|This scenario requires exposure records and shelter availability.
El descanso y la coordinación sostienen tareas de superficie.|Rest and coordination support surface operations.
Mantener procedimientos y resúmenes locales.|Keep local procedures and summaries.
La gravedad parcial puede afectar equilibrio y carga física.|Partial gravity may affect balance and physical workload.
Traje, polvo, presión y soporte vital requieren seguimiento.|Suit, dust, pressure and life support require monitoring.
Registrar contexto de exposición y mantener trazabilidad del dato.|Record exposure context and data provenance.
Vigilar sueño, estrés, ánimo y coordinación del equipo.|Monitor sleep, stress, mood and team coordination.
La tripulación debe poder actuar mientras llega una respuesta.|The crew must be able to act while waiting for a reply.
Mantener preparación física y observar coordinación.|Maintain physical preparation and observe coordination.
Los recursos son limitados y el ambiente afecta la habitabilidad.|Resources are limited and the environment affects habitability.
Registrar exposición durante la actividad.|Record exposure during the activity.
La coordinación entre dos personas es crítica.|Coordination between partners is critical.
Usar el procedimiento local si el enlace falla.|Use the local procedure if the link fails.
El traje aumenta la carga física y reduce la movilidad.|The suit increases physical workload and reduces mobility.
La presión, oxígeno y soporte vital son esenciales.|Pressure, oxygen and life support are essential.
Exposición, procedencia del dato|Exposure, data provenance
Sueño, ánimo, estrés|Sleep, mood, stress
Estado de comunicación|Communication status
Mareo, coordinación, ejercicio|Dizziness, coordination, exercise
CO₂, ruido, luz, temperatura|CO₂, noise, light, temperature
Exposición, refugio, evento solar|Exposure, shelter, solar event
Sueño, ánimo, comunicación|Sleep, mood, communication
Latencia, mensajes pendientes|Delay, pending messages
Coordinación, fatiga, ejercicio|Coordination, fatigue, exercise
EVA, presión, oxígeno, CO₂|EVA, pressure, oxygen, CO₂
Exposición, evento solar, refugio|Exposure, solar event, shelter
Sueño, estrés, ánimo, equipo|Sleep, stress, mood, team
Latencia, autonomía, procedimientos|Delay, autonomy, procedures
Ejercicio, equilibrio, fatiga|Exercise, balance, fatigue
CO₂, oxígeno, temperatura, ruido|CO₂, oxygen, temperature, noise
Exposición y duración|Exposure and duration
Comunicación, carga de trabajo|Communication, workload
Estado del enlace, checklist|Link status, checklist
Fatiga, esfuerzo, coordinación|Fatigue, exertion, coordination
Presión, oxígeno, alarmas del traje|Pressure, oxygen, suit alarms
Se modificó el horario de trabajo y descanso.|Work and rest schedules changed.
Actividad exigente con mayor carga física y cognitiva.|Demanding activity with greater physical and cognitive workload.
La tripulación operó con mayor autonomía.|The crew operated with greater autonomy.
Tormenta fuerte observada|Strong storm observed
Un boletín operativo de NOAA informó condiciones de radiación solar S3.|A NOAA operational bulletin reported S3 solar radiation conditions.
Intensificación a severa|Intensification to severe
NOAA publicó que las mediciones GOES-19 alcanzaron S4. Esta ficha no asigna una hora exacta al cambio.|NOAA reported that GOES-19 measurements reached S4. This card does not assign an exact time to that change.
Boletín posterior con S3|Later bulletin reporting S3
Un boletín operativo posterior informó S3. Las fichas son avisos publicados, no una serie continua ni el máximo de cada día.|A later operational bulletin reported S3. These cards are published notices, not a continuous series or each day's maximum.
19 ene · 11:36 UTC|Jan 19 · 11:36 UTC
19 ene · aviso S4|Jan 19 · S4 notice
20 ene · 23:13 UTC|Jan 20 · 23:13 UTC
Sin señales destacadas|No signals highlighted
Patrón estable hoy|Stable pattern today
Dato simulado|Simulated data
Entrada del tripulante|Crew entry
Prueba cognitiva|Cognitive test
Contexto NASA|NASA context
sin tiempo de respuesta humana|excluding human response time
declaradas|declared
Generado|Generated
Fuente|Source
Consulta actual|Current query
Archivo de avisos, sin consulta actual|Notice archive, not a current query
Sin registros de hoy|No records today
Falta el chequeo de hoy.|Today's check-in is missing.
Sin notas|No notes
Prueba de reacción|Reaction test
Completar registros antes de interpretar|Complete records before interpreting
Coordinación completada|Coordination completed
Latencia elegida|Selected delay
Velocidad|Speed
por trayecto|each way
reales restantes|real time remaining
Sin registros de hoy|No records today
No se pudo guardar la sesión. Exporta el informe antes de salir.|Could not save the session. Export the report before leaving.
Envío simulado iniciado. No se transmitieron datos a ningún servicio.|Simulated transmission started. No data was sent to any service.
No se pudieron guardar los planes. Descarga el informe para conservarlos.|Could not save the plans. Download the report to keep them.
No se pudo guardar el turno. Descarga el informe para conservarlo.|Could not save the handover. Download the report to keep it.
No se pudo archivar el evento anterior. Descarga su informe antes de continuar.|Could not archive the previous event. Download its report before continuing.
Falta guardar el chequeo de hoy.|Today's check-in has not been saved.
Avance de comunicación simulada|Simulated communication progress
Duración debe|Duration must
REGISTRO DE EMERGENCIA|EMERGENCY RECORD
RESUMEN DE TURNO|SHIFT HANDOVER
PREPARACIÓN DE SALIDA · APOYO EDUCATIVO|EVA PREPARATION · EDUCATIONAL SUPPORT
MODO MARTE · SIMULACIÓN EDUCATIVA|MARS MODE · EDUCATIONAL SIMULATION
No disponible|Unavailable
sin datos|no data
Escalas|Scales
Responsables|Owners
Tareas pendientes|Outstanding tasks
Idiomas|Languages
SIGNOS VITALES MANUALES|MANUALLY ENTERED VITAL SIGNS
ÚLTIMO EVENTO DE COORDINACIÓN|LATEST COORDINATION EVENT
Sin evento iniciado.|No event started.
Sin registro de signos vitales de hoy.|No vital signs recorded today.
Sin señales destacadas o referencia personal todavía pendiente|No signals highlighted, or personal baseline still pending
Guardado|Saved
Idioma|Language
Cargando gráfica…|Loading chart…
Uso y límites|Use and limitations
Qué requiere revisión|What needs review
Describe el evento observado…|Describe the observed event…
Modo|Mode
Decisión o notas registradas por el usuario|Decision or notes recorded by the user
`.trim().split('\n').filter(Boolean).map(line => line.split('|') as [string, string])
const dictionary = new Map(pairs.map(([es, en]) => [es.toLocaleLowerCase('es'), en]))
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(?:${[...dictionary.keys()].sort((a,b) => b.length-a.length).map(escape).join('|')})(?![\\p{L}\\p{N}])`, 'giu')
export function userText(value: string) {
  return `\uE000${Array.from(value).map(c => c.codePointAt(0)!.toString(16)).join('.')}\uE001`
}
export function restoreUserText(value: string) {
  return value.replace(/\uE000([\da-f.]*)\uE001/g, (_match, encoded: string) => encoded ? encoded.split('.').map(code => String.fromCodePoint(parseInt(code, 16))).join('') : '')
}
export function english(text: string): string {
  const direct = dictionary.get(text.trim().toLocaleLowerCase('es'))
  if (direct) return text.replace(text.trim(), direct)
  return text
    .replace(/Día final del historial ficticio: Día (\d+)\. Referencia: primeros tres días del ejemplo\. Índice ilustrativo, no un porcentaje de salud\./g, 'Final day of the fictional history: Day $1. Baseline: first three example days. Illustrative index, not a health percentage.')
    .replace(/Sueño: ([\d.]+) h · ánimo: ([\d.]+)\/10 · estrés: ([\d.]+)\/10 · cansancio: ([\d.]+)\/10\./g, 'Sleep: $1 h · mood: $2/10 · stress: $3/10 · fatigue: $4/10.')
    .replace(/Reacción medida: ([\d.]+) ms\./g, 'Measured reaction: $1 ms.')
    .replace(/Registraste ([\d.]+) h frente a ([\d.]+) h habituales\. Considera repetir el chequeo en reposo\./g, 'You recorded $1 h compared with your usual $2 h. Consider repeating the check-in at rest.')
    .replace(/El resultado está ([\d.]+) ms por encima de tu referencia\. Repite la prueba cuando estés descansado\./g, 'The result is $1 ms above your baseline. Repeat the test when rested.')
    .replace(/Registraste ([\d.]+)\/10 frente a ([\d.]+)\/10 en tu línea base\. Observa si se mantiene\./g, 'You recorded $1/10 compared with your baseline of $2/10. Monitor whether it persists.')
    .replace(/Registraste ([\d.]+)\/10 frente a ([\d.]+)\/10 habituales\. Considera revisar descanso y carga de trabajo\./g, 'You recorded $1/10 compared with your usual $2/10. Consider reviewing rest and workload.')
    .replace(/Registraste ([\d.]+)\/10 frente a ([\d.]+)\/10 en tu línea base\. Coméntalo con la tripulación si continúa\./g, 'You recorded $1/10 compared with your baseline of $2/10. Discuss with the crew if it persists.')
    .replace(/El valor registrado fue ([\d.]+) y el promedio móvil fue ([\d.]+)\./g, 'The recorded value was $1 and the moving average was $2.')
    .replace(/Registros de (\d{4}-\d{2}-\d{2})\./g, 'Records for $1.')
    .replace(/Chequeo personal guardado\./g, 'Personal check-in saved.')
    .replace(/Falta el chequeo diario\./g, 'Daily check-in missing.')
    .replace(/Reacción medida hoy\./g, 'Reaction measured today.')
    .replace(/(\d+) señal(?:es)? para revisar/g, '$1 signals to review')
    .replace(/(\d+) verificaciones de equipo o coordinación pendientes\./g, '$1 equipment or coordination checks pending.')
    .replace(/Evento S(\d): NOAA describe peligro de radiación para astronautas en EVA\. Requiere revisión especializada\./g, 'S$1 event: NOAA describes radiation hazards for astronauts on EVA. Specialist review required.')
    .replace(/Evento S(\d): revisar el contexto de radiación solar y los procedimientos de misión\./g, 'S$1 event: review solar radiation context and mission procedures.')
    .replace(/R(\d): perturbación de radio en el entorno terrestre; revisar la aplicabilidad al enlace\./g, 'R$1: radio disturbance in the Earth environment; review relevance to the link.')
    .replace(/G(\d): perturbación geomagnética terrestre; no equivale a dosis personal\./g, 'G$1: Earth geomagnetic disturbance; not a personal dose measurement.')
    .replace(/Ficha (\d+) de (\d+) · 4 s por aviso/g, 'Card $1 of $2 · 4 s per notice')
    .replace(/(\d+) minutos simulados de ida y vuelta/g, '$1 simulated round-trip minutes')
    .replace(/ en (\d+) segundos reales/g, ' in $1 real seconds')
    .replace(/Día (\d+)/g, 'Day $1')
    .replace(pattern, match => dictionary.get(match.toLocaleLowerCase('es')) ?? match)
}
