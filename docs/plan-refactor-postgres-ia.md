# Plan Maestro de Refactorizacion a PostgreSQL (Guia para IA ejecutora)

Este documento esta pensado para que puedas darselo a otra IA y que ejecute la migracion completa sin perder contexto ni cometer errores comunes.

## 1) Contexto del proyecto (resumen operativo)

- Stack actual: Next.js App Router + TypeScript.
- Persistencia actual: IndexedDB en cliente mediante LocalDB.
- Fuente principal de datos actual: `src/lib/db.ts`.
- Riesgo actual: autenticacion y datos sensibles procesados en cliente.
- Objetivo de negocio: migrar a una base robusta PostgreSQL, con backend seguro, esquema relacional, y migracion de datos historicos.

## 2) Instrucciones globales para cualquier IA que ejecute este plan

Copia y pega esto al inicio de cada sesion con la IA:

"""
Actua como arquitecto + implementador senior de Next.js 15 y PostgreSQL.
Reglas obligatorias:
1. No romper funcionalidades existentes.
2. No eliminar codigo legacy hasta verificar la nueva ruta.
3. Cada cambio debe incluir validacion tecnica (build, typecheck, pruebas relevantes).
4. No guardar contrasenas en texto plano.
5. No dejar endpoints sin validacion de entrada (usar Zod o equivalente).
6. Usar migraciones versionadas para BD (no cambios manuales sin migracion).
7. Antes de editar, leer archivos impactados.
8. Entregar siempre: resumen, archivos cambiados, riesgos, pruebas ejecutadas y pendientes.
"""

## 3) Reglas de calidad y seguridad (no negociables)

- Autenticacion y autorizacion siempre en servidor.
- Contrasenas con hash (bcrypt o argon2).
- Sesiones con cookies HttpOnly + Secure + SameSite.
- Rate limit para login y endpoints sensibles.
- Validacion de inputs con esquema tipado.
- Operaciones financieras en transacciones atomicas.
- No almacenar blobs pesados en Postgres cuando sea evitable (usar object storage y guardar referencia).
- Timestamps en UTC.
- Auditoria minima: created_at, updated_at, created_by, updated_by (cuando aplique).

## 4) Definicion de exito (DoD global)

La refactorizacion se considera completa cuando:

1. Ninguna pagina depende de IndexedDB para datos de negocio.
2. Todos los modulos criticos operan sobre API + PostgreSQL.
3. Existe migracion de datos historicos validada con reconciliacion.
4. Build y typecheck pasan sin errores.
5. Flujo completo de auth, pacientes, citas y pagos validado.
6. Hay estrategia de backup/restore en servidor documentada y probada.

## 5) Fases del proyecto (con prompts listos para IA)

---

## Fase 0 - Descubrimiento y linea base

### Objetivo
Crear un mapa exacto del estado actual para evitar suposiciones en la migracion.

### Tareas obligatorias
1. Inventariar entidades y campos desde `src/lib/db.ts`.
2. Identificar en que paginas/componentes se usa cada entidad.
3. Detectar reglas de negocio embebidas en UI.
4. Documentar riesgos funcionales y de seguridad.

### Entregables
- Documento de inventario de entidades y relaciones actuales.
- Matriz modulo -> operaciones CRUD actuales.
- Lista priorizada de riesgos.

### Criterios de aceptacion
- Inventario completo sin vacios en entidades criticas (users, patients, appointments, payments).
- Riesgos clasificados por severidad (alta/media/baja).

### Prompt sugerido para IA
"""
Realiza un assessment completo del proyecto Next.js y genera:
1) inventario de modelos actuales,
2) mapeo de uso por modulo,
3) reglas de negocio encontradas en frontend,
4) riesgos de seguridad y datos.
No hagas cambios aun. Solo analisis y documento tecnico.
"""

### Errores comunes a evitar
- Asumir relaciones no declaradas.
- Ignorar procesos de backup/import actuales.

---

## Fase 1 - Diseno de esquema PostgreSQL

### Objetivo
Traducir el modelo actual a un esquema relacional robusto y mantenible.

### Tareas obligatorias
1. Definir modelos relacionales (users, clinics, patients, treatments, appointments, payments, payment_history, radiographs, consents, odontograms, inventory_items, subscription_payments, payment_methods).
2. Definir llaves primarias, foraneas, unique constraints e indices.
3. Definir estrategia multi-tenant por clinic_id.
4. Definir normalizacion minima y campos de auditoria.
5. Crear migracion inicial con ORM (Prisma recomendado).

### Entregables
- `prisma/schema.prisma` (o equivalente).
- Migracion inicial versionada.
- Documento de decisiones de modelado.

### Criterios de aceptacion
- Integridad referencial valida.
- Campos monetarios con tipo preciso (numeric/decimal).
- Indices en busquedas frecuentes (dni, patient_id, clinic_id, date).

### Prompt sugerido para IA
"""
Disena el esquema PostgreSQL de esta app odontologica usando Prisma.
Incluye relaciones, constraints, indices y campos de auditoria.
Entrega schema + migracion inicial + explicacion de decisiones.
No implementes aun endpoints ni frontend.
"""

### Errores comunes a evitar
- Guardar montos como float.
- No indexar columnas de filtro principal.

---

## Fase 2 - Infraestructura y configuracion de BD

### Objetivo
Tener entorno de desarrollo y despliegue consistente para PostgreSQL.

### Tareas obligatorias
1. Configurar variables de entorno (`DATABASE_URL`, etc.).
2. Preparar conexion segura y pooling.
3. Configurar scripts de migracion y seed.
4. Definir estrategia de entornos (dev/staging/prod).

### Entregables
- Configuracion de entorno reproducible.
- Scripts npm para migrar/seed/reset.
- Documento de operacion basica.

### Criterios de aceptacion
- Conexion estable en local y staging.
- Migraciones aplicables sin pasos manuales ocultos.

### Prompt sugerido para IA
"""
Implementa la configuracion tecnica de PostgreSQL para Next.js con Prisma:
- variables de entorno,
- scripts npm,
- conexion robusta,
- guia corta de ejecucion.
Valida que migrate y generate funcionen sin errores.
"""

### Errores comunes a evitar
- Hardcodear credenciales.
- Mezclar URLs de entornos por descuido.

---

## Fase 3 - Capa backend (API + servicios)

### Objetivo
Mover toda la logica de datos y negocio al servidor.

### Tareas obligatorias
1. Crear capa de servicios por dominio (patients, appointments, payments, etc.).
2. Crear endpoints en app/api con validacion Zod.
3. Implementar manejo uniforme de errores.
4. Aplicar transacciones en operaciones de pago/saldo.
5. Incluir filtros por tenant (clinic_id) en todas las consultas de negocio.

### Entregables
- Endpoints funcionales por modulo.
- Servicios desacoplados de handlers.
- Validaciones de entrada/salida.

### Criterios de aceptacion
- Ningun endpoint muta datos sin validacion.
- Operaciones criticas usan transaccion.
- Respuestas consistentes (status + payload + errores).

### Prompt sugerido para IA
"""
Implementa backend modular para esta app:
- servicios por dominio,
- route handlers en app/api,
- validacion con Zod,
- transacciones para pagos.
No migres frontend aun; primero deja API probada con ejemplos.
"""

### Errores comunes a evitar
- Duplicar logica en endpoint y servicio.
- Omitir control de tenant.

---

## Fase 4 - Autenticacion y autorizacion segura

### Objetivo
Eliminar seguridad en cliente y centralizarla en servidor.

### Tareas obligatorias
1. Reemplazar login local por login server-side.
2. Hash de contrasenas + comparacion segura.
3. Sesion segura con cookie HttpOnly.
4. Implementar RBAC por rol.
5. Implementar lockout/rate-limit en servidor.

### Entregables
- Endpoints auth (login/logout/me/refresh si aplica).
- Middleware de autorizacion por rutas.
- Migracion de usuarios con hash.

### Criterios de aceptacion
- No hay contrasenas en texto plano en DB ni storage cliente.
- Ruta protegida no accesible sin sesion valida.

### Prompt sugerido para IA
"""
Refactoriza autenticacion a modelo seguro server-side:
- hash de passwords,
- sesiones HttpOnly,
- RBAC,
- rate limit y lockout.
Actualiza login actual para consumir el nuevo backend.
"""

### Errores comunes a evitar
- Mantener session payload sensible en localStorage.
- Permitir bypass de rol desde frontend.

---

## Fase 5 - Migracion del frontend por modulos

### Objetivo
Sustituir gradualmente IndexedDB por API sin romper UX.

### Orden recomendado
1. Auth/Login
2. Patients
3. Appointments
4. Payments
5. Radiographs/Consents/Odontograms
6. Reports/Admin/Inventory

### Tareas obligatorias
1. Crear cliente API centralizado (fetch wrapper).
2. Reemplazar operaciones LocalDB por llamadas API por modulo.
3. Mantener paridad funcional visual y de negocio.
4. Añadir estados de carga y errores robustos.

### Entregables
- Modulos migrados en el orden definido.
- Eliminacion progresiva de dependencias directas a LocalDB.

### Criterios de aceptacion
- Cada modulo migrado pasa pruebas funcionales de su flujo principal.
- No aparecen regresiones de datos visibles para usuario final.

### Prompt sugerido para IA
"""
Migra el frontend por etapas para usar API server-side en lugar de LocalDB.
Hazlo modulo por modulo y al final de cada modulo entrega:
- archivos cambiados,
- pruebas ejecutadas,
- checklist de paridad funcional,
- riesgos remanentes.
"""

### Errores comunes a evitar
- Migrar todo de golpe.
- Quitar LocalDB antes de validar modulo nuevo.

---

## Fase 6 - Migracion de datos historicos (ETL)

### Objetivo
Llevar datos existentes del formato backup actual al nuevo esquema PostgreSQL.

### Tareas obligatorias
1. Definir formato de entrada (JSON de export actual).
2. Construir script ETL idempotente.
3. Transformar tipos/fechas/relaciones.
4. Subir archivos binarios a object storage y guardar metadatos + URL.
5. Ejecutar dry-run con reporte de inconsistencias.

### Entregables
- Script ETL versionado.
- Reporte de migracion (totales, errores, omitidos).
- Script de verificacion post-migracion.

### Criterios de aceptacion
- Reconciliacion 1:1 en entidades criticas o explicacion de diferencias.
- Sin errores de FK en carga final.

### Prompt sugerido para IA
"""
Construye un proceso ETL para importar backups JSON actuales a PostgreSQL.
Debe ser idempotente, validable y con reporte final de reconciliacion.
Incluye dry-run y carga final.
"""

### Errores comunes a evitar
- Importar sin validar consistencia referencial.
- Perder metadatos de archivos.

---

## Fase 7 - Pruebas integrales, cutover y limpieza legacy

### Objetivo
Poner en produccion con riesgo controlado y retirar tecnologia anterior.

### Tareas obligatorias
1. Ejecutar pruebas E2E de flujos criticos.
2. Definir ventana de cutover y plan de rollback.
3. Congelar escrituras legacy durante migracion final.
4. Activar nueva ruta productiva.
5. Eliminar codigo legacy solo despues de validacion final.

### Entregables
- Checklist de go-live firmado.
- Plan de rollback probado.
- Limpieza de dependencias/codigo no usado.

### Criterios de aceptacion
- Flujo completo funcionando en produccion.
- Backups y restore verificados.
- Sin dependencia real de IndexedDB para negocio.

### Prompt sugerido para IA
"""
Prepara y ejecuta cutover a PostgreSQL con validacion integral.
Entrega checklist de go-live, plan de rollback y evidencia de pruebas.
Solo elimina legacy despues de confirmar estabilidad.
"""

### Errores comunes a evitar
- Borrar codigo legacy antes del go-live estable.
- No probar rollback.

---

## 6) Plantilla universal de solicitud para cada fase

Usa esta plantilla para guiar a la IA sin ambiguedad:

"""
Fase: [NOMBRE DE FASE]
Objetivo puntual: [QUE DEBE QUEDAR LISTO HOY]
Alcance estricto:
- [Item 1]
- [Item 2]
- [Item 3]

Restricciones:
- No tocar modulos fuera del alcance.
- No romper compatibilidad existente.
- Validar con [build/typecheck/test]

Salida obligatoria:
1. Resumen tecnico corto.
2. Lista de archivos cambiados con motivo.
3. Riesgos detectados.
4. Pruebas ejecutadas y resultado.
5. Pendientes y siguiente paso.

Si falta contexto, primero analiza y pregunta maximo 3 preguntas concretas.
"""

## 7) Lista de verificacion por sesion (checklist anti-error)

Antes de pedir cambios a una IA:

- Defini fase exacta y alcance.
- Defini que archivos/modulos puede tocar.
- Defini criterio de exito de esa sesion.
- Exigi validaciones tecnicas al final.

Al finalizar cada sesion:

- Revisar que el alcance se haya respetado.
- Revisar que no haya cambios colaterales.
- Revisar que pruebas reportadas tengan sentido.
- Guardar decision de continuar, ajustar o revertir.

## 8) Secuencia recomendada de ejecucion (resumen)

1. Fase 0 y 1 completas antes de codificar backend masivo.
2. Fase 2 lista antes de API productiva.
3. Fase 3 y 4 antes de migrar frontend critico.
4. Fase 5 por modulos, no de una sola vez.
5. Fase 6 antes de apagar ruta legacy.
6. Fase 7 para salida controlada.

## 9) Nota final para minimizar errores de IA

Si una IA intenta hacer demasiadas cosas en una sola iteracion, divide el trabajo en tareas de 1 objetivo tecnico por sesion.
La calidad sube cuando el prompt tiene:
- alcance pequeno,
- restricciones claras,
- criterio de exito medible,
- formato de salida obligatorio.
