# Guía de desarrollo

## Ejecutar validaciones

```bash
npm test
npm run check
```

No se requieren dependencias npm externas para las pruebas actuales.

## Ejecutar la aplicación

```bash
python -m http.server 8080
```

Abrir `index.html`, `landing.html` o `excelente.html` en el navegador.

## Convenciones

- Mantener los nombres de proyectos como `p1` a `p8`.
- Mantener los importes en pesos chilenos como números en los cálculos.
- Aplicar formato monetario solo en la capa visual.
- Etiquetar toda cifra como dato observado, cálculo, supuesto o proyección cuando corresponda.
- No agregar otra copia del catálogo de proyectos en una página HTML.

## Sesión demo

`auth-gate.js` solo ofrece un bloqueo visual local. El PIN está en el cliente y no debe considerarse autenticación de producción. La sesión limpia únicamente sus propias claves de almacenamiento.
