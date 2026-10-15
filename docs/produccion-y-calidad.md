# Producción y calidad

## Estado implementado

- Las tres páginas principales tienen idioma, viewport responsive, enlace de salto y landmark principal.
- `npm run quality` ejecuta chequeo sintáctico, pruebas funcionales y auditoría estructural.
- El workflow `.github/workflows/quality.yml` ejecuta la misma puerta de calidad en push y pull request.
- El bloqueo demo elimina solamente las claves que le pertenecen.

## Alcance de la autenticación

`auth-gate.js` es una barrera visual para presentaciones. El PIN se entrega al navegador y no constituye autenticación de producción. Para publicar el sistema se debe reemplazar por un proveedor de identidad, sesiones de servidor, autorización por roles y auditoría de accesos.

## Checklist de validación visual

1. Abrir `index.html`, `landing.html` y `excelente.html` mediante HTTP, no `file://`.
2. Confirmar que no existen errores en la consola.
3. Probar viewport móvil, tablet y escritorio.
4. Navegar con `Tab`, activar el enlace de salto y validar foco visible.
5. Cambiar entre To-Be y Excelente y comprobar que las tres columnas permanecen visibles.
6. Cambiar presets, filtros, sliders, tabs, modales y simuladores.
7. Verificar que la impresión y el retorno entre páginas mantienen el contexto esperado.

## Modularización

La configuración de escenarios y el catálogo financiero ya están separados del renderizado. La siguiente extracción segura debe hacerse por dominio: navegación, visualizaciones, simuladores y modales, conservando la API global existente para no romper los HTML clásicos.
