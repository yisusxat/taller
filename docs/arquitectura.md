# Arquitectura de AndesHome

## Capas

- `index.html`: Torre de Control analítica.
- `landing.html`: suite 2D y sandbox operativo.
- `excelente.html`: escenario de automatización y comparación To-Be/Excelente.
- `andeshome-store.js`: store canónico de métricas, entidades y finanzas.
- `excellent-scenarios.js`: configuración de la comparación estratégica avanzada.
- `app.js`: gráficos y navegación de la Torre de Control.
- `landing-2d.js`: interacción SVG, simuladores y filtros del plano.
- `auth-gate.js`: bloqueo visual de sesión demo.

## Flujo de datos

```text
Fuentes académicas (XLSX/DOCX/MD)
              ↓
     Datos canónicos del store
              ↓
     Calculadora financiera
              ↓
   Torre de Control / Suite 2D
              ↓
     Comparación To-Be/Excelente
```

Las cifras To-Be son proyecciones del caso y no mediciones posteriores a una implementación real.

## Regla de mantenimiento

Las métricas compartidas deben modificarse primero en `andeshome-store.js`. Los valores exclusivos del escenario robotizado deben modificarse en `excellent-scenarios.js`.
