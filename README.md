# Cosmic Ray 64

Aplicación web local para apoyar el monitoreo del bienestar y el rendimiento humano durante misiones espaciales. La interfaz está en español y funciona con React, Vite, TypeScript, Recharts y almacenamiento local del navegador.

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
- Índice de bienestar calculado contra la línea base del perfil.
- Señales explicables basadas en reglas transparentes.
- Gráficas dinámicas con línea base, promedio móvil y periodos de misión.
- Eventos de misión sobre la gráfica: cambio de turno, EVA y comunicación retrasada.
- Prueba de tiempo de reacción real con detección de respuesta anticipada.
- Chequeo diario de sueño, ánimo, estrés, cansancio y síntomas.
- Registro manual y perfiles simulados de signos vitales.
- Cinco perfiles ficticios de tripulantes.
- Escenarios de riesgo: órbita terrestre, Luna, Marte y caminata espacial.
- Modo de emergencia con temporizador, roles, checklist y resumen local.
- Biblioteca de evidencia con referencias NASA y OSDR.
- Funcionamiento offline después de instalar dependencias.

## Cómo revisar la app

1. En **Resumen**, cambia el tripulante y observa que cambien las métricas y alertas.
2. En la gráfica, cambia el indicador y el periodo.
3. Pulsa los eventos de misión debajo de la gráfica para abrir su explicación.
4. En **Chequeo diario**, guarda un registro.
5. En **Cognición**, inicia la prueba, espera la señal verde y pulsa el círculo.
6. En **Riesgos de misión**, cambia el escenario.
7. En **Emergencia médica**, inicia el registro, asigna roles y finalízalo cuando termine el ejercicio.
8. En **Evidencia**, revisa la procedencia y los límites de cada referencia.

## Estructura principal

- `src/App.tsx`: interfaz, perfiles, reglas, gráficas, riesgos, emergencia y evidencia.
- `src/styles.css`: diseño responsive para computadora y tableta.
- `src/main.tsx`: entrada de React.
- `package.json`: scripts y dependencias.
- `vite.config.ts`: configuración de Vite.

## Próximas tareas sugeridas

- Conectar los valores guardados en el chequeo diario con las tarjetas del resumen.
- Separar los componentes grandes de `src/App.tsx` en archivos más pequeños.
- Agregar historial persistente por fecha y por tripulante.
- Seleccionar datasets concretos de NASA OSDR y guardar localmente sus metadatos y referencias.
- Sustituir los textos de emergencia por protocolos revisados por profesionales médicos.
- Agregar inventario médico y comunicación retrasada simulada.
- Revisar accesibilidad, privacidad y validación clínica antes de cualquier uso real.

## Fuentes de contexto

- NASA Open Science Data Repository: https://science.nasa.gov/biological-physical/data/osdr/
- NASA Five Hazards of Human Spaceflight: https://www.nasa.gov/stem-content/five-hazards-of-human-spaceflight/
- NASA Risks of Human Spaceflight: https://www.nasa.gov/hrp/risks/
- NASA Assisted Medical Procedures: https://techport.nasa.gov/projects/18874

