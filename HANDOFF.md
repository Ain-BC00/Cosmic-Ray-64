# Documento de transferencia

Este documento sirve para que otra persona pueda continuar el proyecto sin perder el contexto.

## Estado actual

La aplicación compila con `npm run build` y se ejecuta localmente con Vite. El prototipo ya contiene resumen, chequeo diario, cognición, signos vitales, riesgos de misión, modo emergencia, gráficas explorables y biblioteca de evidencia.

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

## Tareas prioritarias

- [ ] Conectar los datos del chequeo diario al resumen principal.
- [ ] Hacer que el historial se guarde por fecha y por perfil.
- [ ] Añadir datasets OSDR seleccionados con metadatos, licencia y enlace de origen.
- [ ] Revisar con personal médico los procedimientos del modo emergencia.
- [ ] Crear pruebas de interfaz para las gráficas, alertas y prueba cognitiva.
- [ ] Mejorar la accesibilidad y comprobar el diseño en tableta.
- [ ] Revisar privacidad, cifrado y exportación antes de usar datos personales.

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

