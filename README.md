# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Seguridad SRI

Para generar un hash SRI (Subresource Integrity) para un recurso externo usa:

```bash
npm run security:sri -- https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js
```

Tambien puedes calcular SRI para una hoja de estilos:

```bash
npm run security:sri -- https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css --tag link --algo sha384
```

El comando devuelve:

1. El valor de `integrity`.
2. Un snippet HTML listo para pegar con `crossorigin="anonymous"`.

Nota: en esta app las fuentes tipograficas se sirven en self-host con `next/font`, evitando dependencias de runtime a CDNs para fonts y reduciendo hallazgos de SRI faltante.
