# ✅ CHECKLIST DE IMPLEMENTACIÓN: Hoja de Ruta Interactiva

Use este checklist para rastrear el progreso de implementación. ✅ Marque cuando complete cada sección.

---

## 📋 PRE-PROYECTO (Semana 0)

Antes de escribir código:

```
DECISIONES & APROBACIONES
☐ Equipo aprobó arquitectura multitenant (leer ANALISIS-ARQUITECTURA-MULTITENANT-MYSQL.md)
☐ Equipo aprobó timeline 9 semanas
☐ Presupuesto asignado para MySQL hosting (~$50-100/mes)
☐ Se seleccionó developer senior para liderar (al menos 50% dedicación)
☐ Se definió horario de standups (diarios recomendado)
☐ Se configuro repositorio Git con rama 'develop' para cambios

CAPACITACIÓN
☐ Team leyó Prisma ORM docs (~2 horas)
☐ Team leyó Next.js API Routes docs (~2 horas)
☐ Team leyó sobre JWT + HttpOnly cookies (~1 hora)
☐ Team leyó sobre multitenant database design (~1 hora)

INFRAESTRUCTURA
☐ MySQL 8.0+ disponible (local o cloud)
☐ Credenciales MySQL anotadas en lugar seguro (no Git)
☐ Dominio/subdominio para local: clinic1.local, clinic2.local (en /etc/hosts o hosts de Windows)
☐ HTTPS configurado para producción (Vercel lo hace automático)
```

---

## 🛠️ FASE 0: Infraestructura (Semana 1)

Configuración inicial de BD y Prisma.

```
INSTALACIÓN
☐ npm install @prisma/client prisma bcryptjs jsonwebtoken zod redis
☐ npx prisma init
☐ Crear .env.local con DATABASE_URL
☐ Crear .env.example como plantilla

BASE DE DATOS
☐ MySQL 8.0+ instalado o servicio cloud contratado
☐ Base de datos 'kusko_dento_prod' creada
☐ Usuario 'kusko_user' creado con privilegios
☐ Conexión probada: mysql -u kusko_user -p -h localhost

PRISMA
☐ schema.prisma copiado (de ANALISIS-000-ARQUITECTURA... sección "SQL Schema")
☐ npx prisma generate exitoso (sin errores)
☐ npx prisma migrate dev --name init exitoso
☐ npx prisma studio abre y muestra tablas
☐ npm run build sin errores
☐ npm run typecheck sin errores

VALIDACIÓN FINAL
☐ Todas las 13 tablas visibles en Prisma Studio
☐ Índices y foreign keys presentes
☐ .env.local en .gitignore (NO commitear credentials)
```

---

## 🔐 FASE 1: Backend API (Semanas 2-3)

Implementar endpoints básicos y autenticación.

```
ESTRUCTURA DE CARPETAS
☐ src/services/ creada
☐ src/app/api/ creada
☐ src/lib/validators.ts creado
☐ src/types/ creada con tipos centralizados
☐ src/middleware.ts creado

SERVICIOS
☐ src/services/auth.service.ts implementado
   ☐ login(email, password, clinic_id) funciona
   ☐ Password hashing con bcrypt
   ☐ JWT generado correctamente
   ☐ updateLastLogin() registra login time

☐ src/services/clinic.service.ts implementado
   ☐ getById(clinic_id) funciona
   ☐ update(clinic_id, data) funciona
   ☐ getAll() (admin only) funciona

☐ src/services/user.service.ts implementado
   ☐ getByClinic(clinic_id) funciona
   ☐ create(clinic_id, data) con validación
   ☐ update(user_id, data) funciona
   ☐ delete(user_id) soft delete o hard delete

☐ src/services/patient.service.ts implementado
   ☐ getByClinic(clinic_id) con paginación
   ☐ create(clinic_id, data) valida DNI único por clinic
   ☐ getById(clinic_id, patient_id) WITH clinic_id check
   ☐ update(patient_id, data) funciona
   ☐ search(clinic_id, query) busca por DNI/nombre

☐ src/services/treatment.service.ts implementado
   ☐ getByClinic(clinic_id) lista todos los tratamientos
   ☐ create(clinic_id, data) agrega tratamiento
   ☐ update(treatment_id, data) funciona

☐ src/services/appointment.service.ts implementado
   ☐ getByClinic(clinic_id, filters?) con fechas
   ☐ create(clinic_id, data) valida doctor existe
   ☐ getByDoctor(doctor_id, clinic_id) funciona
   ☐ getByPatient(patient_id, clinic_id) funciona
   ☐ updateStatus(appointment_id, status) funciona

VALIDACIÓN CON ZOD
☐ src/lib/validators.ts contiene:
   ☐ LoginSchema validando email + password + clinic_id
   ☐ CreatePatientSchema completo
   ☐ CreateAppointmentSchema completo
   ☐ CreatePaymentSchema completo
   ☐ CreateUserSchema con validación de rol

ENDPOINTS API
☐ POST /api/auth/login
   ☐ Valida credenciales con Zod
   ☐ Retorna token JWT
   ☐ Cookie HttpOnly + Secure configurada
   ☐ Test: curl -X POST con credenciales válidas

☐ POST /api/auth/logout
   ☐ Limpia cookie auth_token
   ☐ Retorna 200 OK
   ☐ Test: curl con cookie válida

☐ GET /api/auth/me
   ☐ Retorna usuario actual desde JWT
   ☐ Requiere auth_token válido
   ☐ Test: curl con cookie

☐ GET /api/clinics
   ☐ Admin only - lista todas clínicas
   ☐ Retorna con paginación
   ☐ Test: Postman GET /api/clinics

☐ GET /api/clinics/[id]
   ☐ Retorna detalles de clínica
   ☐ Solo owner o admin
   ☐ Test: GET /api/clinics/clinic123

☐ GET /api/users
   ☐ Lista usuarios de clinic actual
   ☐ Valida clinic_id desde token
   ☐ Test: GET /api/users (con auth)

☐ POST /api/users
   ☐ Crea nuevo usuario en clinic actual
   ☐ Valida email único por clinic
   ☐ Hash password antes de guardar
   ☐ Test: POST /api/users con datos válidos

☐ GET /api/patients
   ☐ Lista pacientes de clinic actual
   ☐ Soporta ?page=1&limit=20 (paginación)
   ☐ Valida clinic_id desde token
   ☐ Test: GET /api/patients?page=1

☐ POST /api/patients
   ☐ Crea paciente en clinic actual
   ☐ Valida DNI único por clinic
   ☐ Test: POST /api/patients con JSON

☐ GET /api/patients/[id]
   ☐ Retorna detalles de paciente
   ☐ Solo si pertenece a clinic actual
   ☐ Test: GET /api/patients/patient123

☐ PUT /api/patients/[id]
   ☐ Edita paciente existente
   ☐ Valida clinic_id
   ☐ Test: PUT /api/patients/patient123

☐ GET /api/treatments
   ☐ Lista tratamientos de clinic actual
   ☐ Test: GET /api/treatments

☐ POST /api/treatments
   ☐ Agrega tratamiento nuevo
   ☐ Test: POST /api/treatments

☐ GET /api/appointments
   ☐ Lista citas de clinic actual
   ☐ Soporta filtros: ?date=2024-01-01&status=scheduled
   ☐ Test: GET /api/appointments

☐ POST /api/appointments
   ☐ Crea cita nueva
   ☐ Valida: patient existe, doctor existe, fecha válida
   ☐ Usa transacción si crea payment también
   ☐ Test: POST /api/appointments

MIDDLEWARE & SEGURIDAD
☐ src/middleware.ts controla todas rutas /api/*
   ☐ Extrae clinic_id de token JWT
   ☐ Adjunta clinic_id a request headers
   ☐ Rechaza sin token (401)
   ☐ Rechaza token expirado (401)

☐ JWT + HttpOnly Cookies
   ☐ signJWT(payload, secret) genera token con expiration
   ☐ verifyJWT(token, secret) valida y retorna payload
   ☐ expiración: 7 días (configurable)
   ☐ refresh token logic (opcional pero recomendado)

☐ RBAC (Role-Based Access Control)
   ☐ /api/clinics limitado a admin
   ☐ /api/users/* limitado a clinic_owner
   ☐ /api/patients accesible a doctor + clinic_owner
   ☐ /api/payments accesible a clinic_owner + accountant

TESTING BÁSICO
☐ Tests MANUALES con Postman/Insomnia:
   ☐ Login exitoso → retorna token + user
   ☐ Login fallido → 401 Unauthorized
   ☐ Acceso sin token → 401
   ☐ GET /api/patients lista pacientes
   ☐ POST /api/patients crear paciente válido
   ☐ POST /api/patients rechaza DNI duplicado
   ☐ GET /api/patients/[wrong-id] retorna 404 o vacío

☐ Build: npm run build - sin errores
☐ Typecheck: npm run typecheck - sin errores
☐ Dev server: npm run dev - inicia sin errores
```

---

## 🎨 FASE 2: Migración Frontend (Semanas 4-5)

Reemplazar IndexedDB con API en frontend.

```
CLIENTE HTTP
☐ src/lib/api-client.ts implementado
   ☐ Clase ApiClient con métodos: get, post, put, delete
   ☐ Manejo de errores centralizado
   ☐ Credenciales: include (para cookies)
   ☐ Headers: Content-Type application/json

☐ src/hooks/use-api.ts implementado
   ☐ Hook useApi<T>(endpoint, {autoFetch?})
   ☐ Retorna: data, loading, error, refetch()
   ☐ useEffect automático si autoFetch=true
   ☐ Manejo de errores en hook

☐ src/hooks/use-mutation.ts implementado
   ☐ Hook useMutation<T>(endpoint, method)
   ☐ Retorna: mutate(), loading, error
   ☐ Manejo de errores en mutación

REFACTOR: MÓDULO AUTH
☐ src/app/login/page.tsx refactorizado
   ☐ Elimina IndexedDB localStorage
   ☐ Usa useMutation para POST /api/auth/login
   ☐ Valida email + password local
   ☐ Muestra error si login fallido
   ☐ Redirect a /dashboard si login exitoso
   ☐ Test: Intentar login → debería funcionar desde API

☐ src/hooks/use-auth.tsx refactorizado
   ☐ Hook obtiene user actual desde GET /api/auth/me
   ☐ Verifica token en cookie (no localStorage)
   ☐ Retorna: user, loading, isAuthenticated, logout()
   ☐ logout() hace POST /api/auth/logout

☐ src/app/layout.tsx refactorizado
   ☐ Usa useAuth en componente cliente
   ☐ Si no autenticado: redirect a /login
   ☐ Si autenticado: muestra AppLayout

REFACTOR: MÓDULO PACIENTES
☐ src/app/patients/page.tsx refactorizado
   ☐ Elimina IndexedDB localStorage
   ☐ Usa useApi('/api/patients') para GET
   ☐ Usa useMutation('/api/patients', 'POST') para crear
   ☐ Muestra loading mientras carga
   ☐ Muestra error si algo falla
   ☐ Test LIST: GET /api/patients mostrado en página
   ☐ Test CREATE: Formulario crea paciente vía API

☐ src/app/patients/[id]/page.tsx refactorizado
   ☐ Usa useApi(`/api/patients/${id}`) para detalles
   ☐ Usa useMutation para PUT /api/patients/[id]
   ☐ Test: Editar paciente y ver cambios

☐ src/app/patients/[id]/odontogram/page.tsx refactorizado
   ☐ Usa useApi(`/api/odontograms?patient_id=${id}`)
   ☐ Usa useMutation para POST /api/odontograms
   ☐ Test: Guardar odontograma

REFACTOR: MÓDULO CITAS
☐ src/app/appointments/page.tsx refactorizado
   ☐ Usa useApi('/api/appointments') con filtros
   ☐ Soporta ?date=YYYY-MM-DD&status=scheduled
   ☐ Usa useMutation para crear citas
   ☐ Test: Listar citas y crear nuevas

☐ src/app/appointments/[id]/page.tsx refactorizado
   ☐ Usa useApi para GET detalles
   ☐ Usa useMutation para cambiar status

REFACTOR: OTROS MÓDULOS
☐ src/app/treatments/page.tsx refactorizado
   ☐ Cambiar a /api/treatments

☐ src/app/radiographs/page.tsx refactorizado
   ☐ Cambiar a /api/radiographs
   ☐ Sustituir uploader de archivos

☐ src/app/consents/page.tsx refactorizado
   ☐ Cambiar a /api/consents

☐ src/app/inventory/page.tsx refactorizado
   ☐ Cambiar a /api/inventory

☐ src/app/profile/page.tsx refactorizado
   ☐ Cambiar a /api/auth/me + PUT /api/users/[id]

VALIDACIÓN FUNCIONAL
☐ Paridad de funcionalidad:
   ☐ Login → crear → leer → editar → eliminar funciona para cada módulo
   ☐ Sin IndexedDB en Network tab (solo /api/*)
   ☐ Todos los datos vienen del servidor

☐ Estados de UX:
   ☐ Spinner/loading durante fetch
   ☐ Error message si API falla
   ☐ Toast de confirmación si éxito
   ☐ Deshabilitado botón mientras se carga

☐ Build & Types:
   ☐ npm run build sin errores
   ☐ npm run typecheck sin errores
```

---

## 💳 FASE 3: Pagos con Transacciones (Semana 6)

Implementar pagos seguros y auditados.

```
SERVICIO DE PAGOS
☐ src/services/payment.service.ts implementado
   ☐ createPayment(clinicId, data) usa transacción
   ☐ Dentro de transacción:
      ☐ Valida paciente existe
      ☐ Valida cita existe
      ☐ Crea Payment con Decimal (NO float)
      ☐ Crea PaymentHistory
      ☐ Actualiza status de cita si pagado

☐ getPatientBalance(clinicId, patientId)
   ☐ Suma balance pendiente del paciente

☐ getClinicRevenue(clinicId, filterDate?)
   ☐ Suma ingresos por período

ENDPOINT PAGOS
☐ POST /api/payments
   ☐ Crea pago con transacción
   ☐ Retorna pago creado
   ☐ Test: POST con monto válido

☐ GET /api/payments?patient_id=X
   ☐ Historial de pagos del paciente
   ☐ Test: GET /api/payments?patient_id=patient123

☐ GET /api/payments/[id]/history
   ☐ Detalle de pago con historial

RATE LIMITING
☐ src/lib/rate-limit.ts implementado
   ☐ Máximo 10 pagos por minuto por usuario
   ☐ Máximo 100 pagos por hora por clinic

☐ Aplicado en POST /api/payments
   ☐ Retorna 429 si excede límite

VALIDACIÓN DE TRANSACCIONES
☐ Test: Crear pago y verificar:
   ☐ Payment creado en BD
   ☐ PaymentHistory registrado
   ☐ Balance actualizado
   ☐ Status de cita "completed" si pagado

☐ Test: Simular fallo a mitad transacción
   ☐ Rollback automático (sin Payment huérfano)

FRONTEND PAGOS
☐ src/app/payments/page.tsx refactorizado
   ☐ Usa /api/payments para listar
   ☐ Usa useMutation para crear pago
   ☐ Valida monto > 0
   ☐ Muestra balance pendiente

☐ Test: Crear pago desde UI
   ☐ Aparece en lista
   ☐ Balance actualiza
```

---

## 📥 FASE 4: ETL (Importar Datos Históricos) (Semana 7)

Migrar datos del IndexedDB viejo a MySQL.

```
EXPORT DE DATOS ACTUALES
☐ Descargar backup del IndexedDB actual como JSON
   ☐ Incluye: users, patients, appointments, payments
   ☐ Anotado con clinic associations
   ☐ Guardado en backup.json

ETL SCRIPT
☐ scripts/etl-import-backup.ts implementado
   ☐ Función importBackup(filePath)
   ☐ Procesa por entidad:
      ☐ Clinics: crear o usar existentes
      ☐ Users: hashing passwords, mapeo IDs
      ☐ Patients: validar DNI, crear relaciones
      ☐ Appointments: validar references
      ☐ Payments: registrar en PaymentHistory

☐ Retorna reporte con:
   ☐ Cantidad importados por tabla
   ☐ Cantidad de errores
   ☐ Lista de IDs fallidos
   ☐ Guardado en etl-report-${timestamp}.json

npm SCRIPT
☐ "etl:import" en package.json
   ☐ Ejecuta: ts-node scripts/etl-import-backup.ts
   ☐ Recibe ruta del backup: npm run etl:import ./backup.json

PRUEBAS
☐ Dry-run primero (sin commit):
   ☐ Contar registros antes: SELECT COUNT(*) FROM patients;
   ☐ Ejecutar: npm run etl:import ./backup.json
   ☐ Revisar reporte-XXX.json
   ☐ Contar registros después
   ☐ Diffs deberían ser 0 o explicable

☐ Validar reconciliación:
   ☐ DNIs únicos por clinic: ✅
   ☐ Relaciones FK íntegras: ✅
   ☐ Passwords hasheados: ✅
   ☐ Timestamps válidos: ✅

☐ Test: Acceder a datos importados desde UI
   ☐ Pacientes importados visibles
   ☐ Citas importadas funcionales
   ☐ Pagos visibles en historial

FALLBACK
☐ Si ETL falla:
   ☐ Script rollback disponible
   ☐ Restore último backup MySQL
   ☐ Reintentar con datos corregidos
```

---

## ✅ FASE 5: Testing, Validación & Go-Live (Semana 8)

Verificar todo antes de producción.

```
TESTING TÉCNICO
☐ Build production
   ☐ npm run build sin errores
   ☐ .next/ generado correctamente
   ☐ Tamaño bundle razonable (<5MB)

☐ Types check
   ☐ npm run typecheck sin errores
   ☐ No hay any implícitos

☐ Lint
   ☐ npm run lint sin warnings críticas

☐ Migraciones
   ☐ npx prisma migrate status = OK
   ☐ Todas las migraciones en prisma/migrations/

☐ Health check
   ☐ GET /api/health retorna 200
   ☐ Incluye BD status, API status, timestamp

SMOKE TESTS (Manual)
Usar checklist en docs/SMOKE-TESTS.md:
☐ Test Auth:
   ☐ Login exitoso → redirect dashboard ✅
   ☐ Login fallido → error 401 ✅
   ☐ Logout limpia cookie ✅

☐ Test Pacientes:
   ☐ Crear paciente ✅
   ☐ Editar paciente ✅
   ☐ Buscar paciente ✅
   ☐ Eliminar paciente ✅

☐ Test Citas:
   ☐ Crear cita ✅
   ☐ Cambiar status ✅
   ☐ Listar por día ✅

☐ Test Pagos:
   ☐ Crear pago ✅
   ☐ Ver historial ✅
   ☐ Balance correcto ✅

☐ Test Multitenant:
   ☐ Clinic A no ve datos Clinic B ✅
   ☐ Cambiar clinic_id en token → acceso denegado ✅

PERFORMANCE TEST
☐ Cargar 1000+ pacientes
   ☐ GET /api/patients con paginación: <200ms
   ☐ Crear 100 citas: <5 segundos
   ☐ Ver historial pagos: <100ms

☐ Memory leak test
   ☐ Abrir/cerrar módulos pacientes 10 veces
   ☐ Memoria no incrementa indefinidamente

BACKUP & RECOVERY
☐ Backup pre-go-live
   ☐ mysqldump kusko_dento_prod > backup-before-launch.sql
   ☐ Guardado en lugar seguro (no git)
   ☐ Verificar tamaño: >10MB significa data

☐ Test restore:
   ☐ mysql < backup-before-launch.sql en BD test
   ☐ Data integrada correctamente
   ☐ Aplicar migraciones: npx prisma migrate deploy

DOCUMENTACIÓN
☐ docs/API-ENDPOINTS.md
   ☐ Lista todos /api/* con método, auth, params

☐ docs/DATABASE-SCHEMA.md
   ☐ Diagrama ER completo

☐ docs/MULTITENANT-SECURITY.md
   ☐ Estrategia de aislamiento documentada

☐ docs/SMOKE-TESTS.md
   ☐ Checklist de tests manuales

☐ docs/ROLLBACK-PLAN.md
   ☐ Pasos exactos si algo falla en prod

PLAN DE GO-LIVE
☐ Carta de go-live firmada
  ☐ Equipo confirma todos tests ✅
  ☐ Todas fases completadas ✅
  ☐ BD backup disponible ✅
  ☐ Plan de rollback aprobado ✅

☐ Ventana de deploy
  ☐ Día elegido (idealmente miércoles)
  ☐ Horario elegido (low traffic)
  ☐ Equipo disponible 4 horas

☐ Deploy checklist
  ☐ Commit todos cambios: git push develop
  ☐ Trigger CI/CD (Vercel)
  ☐ Builds exitoso en staging
  ☐ Smoke tests en staging
  ☐ Datadog/monitoring activo
  ☐ Deploy a producción
  ☐ Validar /api/health en prod = green
  ☐ Random smoke test en prod
  ☐ Notificar users (email+banner)

MONITOREO POST-DEPLOY
☐ Primeras 24 horas:
  ☐ CPU < 70%
  ☐ Memory < 80%
  ☐ Query response time < 500ms
  ☐ Error rate < 0.1%
  ☐ No hay 5xx en logs

☐ Alertas configuradas:
  ☐ DB connection fails
  ☐ Response time >1s
  ☐ Error rate >0.5%
  ☐ Disk space <10%

FIN FASE 5
☐ Sistema en producción ✅
☐ 0 dependencias de IndexedDB ✅
☐ Datos históricos migrados ✅
☐ Equipo capacitado ✅
☐ Plan de mantenimiento en lugar ✅
```

---

## 🎓 CAPACITACIÓN & ONBOARDING

Una vez completo:

```
DOCUMENTACIÓN PARA EQUIPO
☐ README.md actualizado con nuevo stack
☐ docs/API-ENDPOINTS.md consultable
☐ docs/DATABASE-SCHEMA.md con diagramas
☐ docs/QUICK-START-30MIN.md para nuevos devs
☐ Ejemplos de código en componentes

WORKSHOPS (30 min c/u)
☐ Cómo agregar nuevo endpoint API
☐ Cómo consultar datos con useApi
☐ Cómo usar Prisma para queries complejas
☐ Cómo debuggear transacciones

RUNBOOKS (Procedimientos)
☐ Cómo ejecutar migraciones en prod
☐ Cómo rollback si algo falla
☐ Cómo agregar nueva clínica
☐ Cómo investigar bug de multitenant
```

---

## 📞 SOPORTE POST-GO-LIVE

```
PRIMER MES
☐ Daily standup (15 min) issues + bugs
☐ Weekly review: métricas, performance
☐ Bugs críticos: fix + deploy same-day
☐ Bugs menores: acumular + sprint próximo

MANTENIMIENTO MENSUAL
☐ Revisar índices MySQL (< 5ms queries)
☐ Revisar disk space (alert si >70%)
☐ Revisar error logs (buscar patterns)
☐ Backup restore test (verificar que funciona)

ESCALADO FUTURO
☐ Si >10 clinicas: considerar caching con Redis
☐ Si >100 clinicas: considerar sharding por region
☐ Si >500M rows: archivo old data
☐ Si 1M requests/día: evaluar backend separado + PostgreSQL
```

---

## ✨ RESUMEN FINAL

```
ANTES DE EMPEZAR:
TOTAL ITEMS: 100+
COMPLETADOS: 25/100+ (25%)

DURANTE FASES 1-5:
TOTAL ITEMS: 350+
META: Completar 100% antes go-live

DESPUÉS GO-LIVE:
MANTENIMIENTO ONGOING
```

---

**Próximo paso:** Imprimir este checklist y pegar en pared de oficina. Actualizar diariamente. ✅

**Tiempo estimado:** 9 semanas con 1 developer full-time.  
**Actualizado:** 24 de marzo de 2026
