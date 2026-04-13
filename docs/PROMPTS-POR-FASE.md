# 🎯 PROMPTS OPTIMIZADOS POR FASE: Copia y Pega a la IA

**Propósito:** Acelerar desarrollo dando prompts específicos y claros a la IA en cada fase.

**Cómo usar:** Copia el PROMPT de tu fase, pégalo a la IA, y ella sabrá exactamente qué hacer.

---

## 📖 GUÍA RÁPIDA: QUÉ DOCUMENTO LEER ANTES DE CADA FASE

| Fase | Documento a leer | Tiempo | Prompt a usar |
|------|------------------|--------|---------------|
| **0** (Setup) | QUICK-START-30MIN.md | 30 min | PROMPT-FASE-0 ↓ |
| **1** (Backend API) | ANALISIS-ARQUITECTURA.md (sección Fase 1) | 1 hora | PROMPT-FASE-1 ↓ |
| **2** (Frontend) | ANALISIS-ARQUITECTURA.md (sección Fase 2) | 1 hora | PROMPT-FASE-2 ↓ |
| **3** (Pagos) | ANALISIS-ARQUITECTURA.md (sección Fase 3) | 30 min | PROMPT-FASE-3 ↓ |
| **4** (ETL) | ANALISIS-ARQUITECTURA.md (sección Fase 4) | 30 min | PROMPT-FASE-4 ↓ |
| **5** (Testing+Deploy) | ANALISIS-ARQUITECTURA.md (sección Fase 5) | 30 min | PROMPT-FASE-5 ↓ |

**Tiempo total lectura:** ~3.5 horas (mientras codificas)

---

## 🚀 FASE 0: Infraestructura y Configuración (Semana 1)

### 📖 Lee primero:
```
docs/QUICK-START-30MIN.md
```

### 📋 Checklist antes de pedir a la IA:
- ✅ MySQL 8.0+ instalado o contratar (PlanetScale/Supabase)
- ✅ Node.js 18+ instalado
- ✅ Editor VS Code abierto en proyecto

### 🤖 PROMPT PARA LA IA (Copia y pega):

```
Fase 0 - Infraestructura y Base de Datos

OBJETIVO:
Configurar PostgreSQL, Prisma ORM y ambiente de desarrollo.

TAREAS ESPECÍFICAS:
1. npm install @prisma/client prisma bcryptjs jsonwebtoken zod
2. Crear archivo .env.local con:
   DATABASE_URL="mysql://kusko_user:StrongPassword123!@localhost:3306/kusko_dento_prod"
   NEXTAUTH_SECRET="(generar con crypto)"
   JWT_SECRET="(generar con crypto)"
   API_BASE_URL="http://localhost:3000"
   NODE_ENV="development"

3. Crear .env.example (plantilla sin valores sensibles)

4. Crear prisma/schema.prisma con modelo completo:
   - Clinic (id, name, domain, created_at)
   - User (id, clinic_id, email, password_hash, role, status)
   - Patient (id, clinic_id, dni, full_name, phone, email, address, medicalHistory, created_at)
   - Treatment (id, clinic_id, name, price, created_at)
   - Appointment (id, clinic_id, patient_id, doctor_id, treatment_id, date, time, cost, status)
   - Payment (id, clinic_id, patient_id, appointment_id, amount, balance, status, created_at)
   - PaymentHistory (id, clinic_id, payment_id, amount_paid, payment_date, method)
   - Radiograph (id, clinic_id, patient_id, appointment_id, file_url, type, created_at)
   - Odontogram (id, clinic_id, patient_id, appointment_id, data_json, created_at)
   - Consent (id, clinic_id, patient_id, appointment_id, consent_type, accepted_at)
   - InventoryItem (id, clinic_id, name, quantity, unit_cost, min_quantity, created_at)
   
   OBLIGATORIO:
   - Todos tienen clinic_id (multitenant)
   - Usar Decimal para montos (no Float)
   - Índices en clinic_id, created_at, status
   - Foreign keys correctas

5. Ejecutar:
   npx prisma generate
   npx prisma migrate dev --name init

6. Validar:
   npx prisma studio (debe abrir UI en localhost:5555)
   npm run build (sin errores)
   npm run typecheck (sin errores)

RESTRICCIONES:
- NO crear tablas adicionales sin justificar
- NO usar Float para dinero
- NO hacer queries sin clinic_id filter (será agregado después)

VALIDACIÓN FINAL:
- Prisma Studio abierto mostrando 11 tablas
- Archivo .env.local existente (NO en git)
- Archivo .env.example visible
- Build sin errores

ENTREGA:
1. Confirmar Prisma Studio abierto y visible
2. Mostrar 11 tablas creadas
3. Confirmar npm run build sin errores
4. Listar archivos creados:
   - prisma/schema.prisma
   - .env.local (no mostrar valores)
   - .env.example
```

### ✅ Validación esperada:
- Prisma Studio abriendo en localhost:5555
- 11 tablas visibles
- npm run build sin errores
- npm run typecheck sin errores

### ⏱️ Tiempo estimado: **1-2 horas**

---

## 🔐 FASE 1: Backend API (Semanas 2-3)

### 📖 Lee primero:
```
docs/ANALISIS-ARQUITECTURA-MULTITENANT-MYSQL.md
(Sección "FASE 1 - Capa backend (API + servicios)")
```

### 📋 Checklist antes de pedir a la IA:
- ✅ Fase 0 completada (Prisma Studio funcionando)
- ✅ Documento leído
- ✅ Estructura de carpetas clara en mente

### 🤖 PROMPT PARA LA IA (Copia y pega):

```
Fase 1 - Backend API: Autenticación y CRUD básicos

STACK:
- Next.js 15 App Router
- Prisma ORM
- Zod para validación
- JWT + HttpOnly cookies
- bcryptjs para hash

OBJETIVO:
Crear backend API robusto con autenticación segura y CRUD para pacientes.

ESTRUCTURA A CREAR:
```
src/
├── lib/
│   ├── jwt.ts (signJWT, verifyJWT)
│   ├── validators.ts (Zod schemas)
│   ├── hash.ts (bcrypt functions)
│   └── prisma.ts (Prisma client singleton)
│
├── services/
│   ├── auth.service.ts
│   ├── patient.service.ts
│   ├── clinic.service.ts
│   ├── appointment.service.ts
│   └── treatment.service.ts
│
├── app/
│   ├── api/
│   │   ├── health/route.ts
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── me/route.ts
│   │   │   └── refresh/route.ts
│   │   ├── patients/
│   │   │   ├── route.ts (GET all, POST create)
│   │   │   └── [id]/route.ts (GET one, PUT update)
│   │   ├── appointments/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── treatments/route.ts
│   │
│   └── layout.tsx (aplicar middleware)
│
└── middleware.ts (validar JWT + inyectar clinic_id)
```

TAREAS ESPECÍFICAS:

1. **src/lib/jwt.ts:**
   - signJWT(payload, secret) → retorna token string
   - verifyJWT(token, secret) → retorna payload o throws
   - Expiration: 7 días (parametrizable)

2. **src/lib/hash.ts:**
   - hashPassword(password) → bcrypt hash
   - verifyPassword(password, hash) → boolean

3. **src/lib/validators.ts (Zod):**
   - LoginSchema: { email, password, clinic_id }
   - CreatePatientSchema: { dni, full_name, phone, address, email?, age? }
   - CreateAppointmentSchema: { patient_id, doctor_id, date, time, cost }
   - Todaslas validaciones necesarias

4. **src/services/auth.service.ts:**
   - login(email, password, clinic_id) → { token, user, clinic }
     * Validar credenciales
     * Hash validate password
     * Genera JWT
     * Update last_login
     * NUNCA guardar password sin hashing
   
   - logout(userId) → success
     (Lógica simple por ahora, versión stateless)

5. **src/services/patient.service.ts:**
   - getByClinic(clinic_id, page?, limit?) → array
     * OBLIGATORIO filtro clinic_id
     * Paginación opcional
   
   - getById(clinic_id, patient_id) → patient (validar clinic_id)
   
   - create(clinic_id, data) → patient
     * Validar DNI único por clinic
     * NUNCA confiar en frontend para clinic_id
   
   - update(clinic_id, patient_id, data) → patient
     * Solo si pertenece a clinic_id
   
   - search(clinic_id, query) → array
     * Buscar por DNI o nombre

6. **src/services/clinic.service.ts:**
   - getById(clinic_id) → clinic
   - update(clinic_id, data) → clinic

7. **src/middleware.ts:**
   - Interceptar TODOS los /api/* requests
   - Validar auth_token cookie
   - Extraer clinic_id y user_id del JWT
   - Inyectar en request.headers:
     * x-clinic-id
     * x-user-id
   - Rechazar con 401 si inválido

8. **src/app/api/health/route.ts:**
   - GET /api/health
   - Retorna: { status: "ok", timestamp, database: "connected" }

9. **POST /api/auth/login:**
   - Validar input con LoginSchema
   - Llamar authService.login()
   - Retornar { user, clinic } + cookie HttpOnly
   - Cookie config: { httpOnly: true, secure: true, sameSite: "lax", maxAge: 7*24*60*60 }
   - Test: POST con credenciales válidas debe retornar 200

10. **POST /api/auth/logout:**
    - Limpiar cookie auth_token
    - Retornar { message: "logged out" }

11. **GET /api/auth/me:**
    - Requiere token válido
    - Retorna usuario actual + clinic

12. **GET /api/patients:**
    - Requiere auth
    - Valida clinic_id desde header
    - Soporta ?page=1&limit=20
    - Retorna paginado

13. **POST /api/patients:**
    - Validar con CreatePatientSchema
    - Crear en clinic actual
    - Validar DNI único por clinic
    - Retorna 201 + patient

14. **GET /api/patients/[id]:**
    - Solo si patient pertenece a clinic_id del token
    - Retorna 404 si no existe

15. **PUT /api/patients/[id]:**
    - Validar clinic_id
    - Actualizar paciente
    - No permitir cambiar clinic_id

16. **GET /api/appointments:**
    - Listar citas de la clinic
    - Soporta filtros: ?date=YYYY-MM-DD&status=scheduled

17. **GET /api/treatments:**
    - Listar tratamientos de la clinic

RESTRICCIONES OBLIGATORIAS:
- Middleware DEBE validar clinic_id en TODO request
- JAMÁS hacer query sin WHERE clinic_id = X
- Contraseñas NUNCA en plain text
- Zod DEBE validar TODOS los inputs
- Errores consistentes: { error: "mensaje", status: 400/401/500 }

VALIDACIÓN:
- npm run build sin errores
- npm run typecheck sin errores
- npm run dev inicia sin errores
- Test con curl/Postman:
  * POST /api/auth/login con credenciales → 200 con cookie
  * GET /api/patients sin token → 401
  * GET /api/patients con token inválido → 401
  * GET /api/patients con token válido → 200 con pacientes

ENTREGA:
1. Archivos creados listados
2. Endpoints funcionales confirmados
3. Teste exitosos mostrados (curl/Postman)
4. Riesgos identificados
5. Próximos pasos para Fase 2
```

### ✅ Validación esperada:
- npm run build sin errores
- npm run typecheck sin errores
- POST /api/auth/login retorna 200 con cookie
- GET /api/patients retorna array (o 401 sin token)
- SELECT query filtra por clinic_id

### ⏱️ Tiempo estimado: **2-3 semanas (backend solamente)**

---

## 🎨 FASE 2: Migración Frontend a API (Semanas 4-5)

### 📖 Lee primero:
```
docs/ANALISIS-ARQUITECTURA-MULTITENANT-MYSQL.md
(Sección "FASE 2 - Migración del frontend por módulos")
```

### 📋 Checklist antes de pedir a la IA:
- ✅ Fase 1 completada (todos los endpoints funcionando)
- ✅ Endpoints testeados manualmente

### 🤖 PROMPT PARA LA IA:

```
Fase 2 - Migración Frontend: Eliminar IndexedDB, usar API

OBJETIVO:
Reemplazar IndexedDB con llamadas a /api/* en 3 módulos críticos.

ORDEN DE MIGRACIÓN (uno a la vez):
1. Auth (login → debe funcionar primero)
2. Patients (CRUD de pacientes)
3. Appointments (citas)

ESTRUCTURA A CREAR/REFACTOR:
```
src/
├── lib/
│   └── api-client.ts (cliente HTTP centralizado)
│
├── hooks/
│   ├── use-api.ts (hook genérico GET)
│   ├── use-mutation.ts (hook genérico POST/PUT/DELETE)
│   └── use-auth.tsx (refactor para usar /api/auth/me)
│
├── app/
│   ├── login/page.tsx (refactor: eliminar IndexedDB)
│   ├── dashboard/
│   │   ├── patients/
│   │   │   ├── page.tsx (refactor: GET /api/patients)
│   │   │   ├── [id]/page.tsx (refactor: GET /api/patients/[id])
│   │   │   └── [id]/edit/page.tsx (refactor: PUT /api/patients/[id])
│   │   │
│   │   └── appointments/
│   │       └── page.tsx (refactor: GET /api/appointments)
│   │
│   └── layout.tsx (usar useAuth para protección)
```

TAREAS ESPECÍFICAS:

1. **src/lib/api-client.ts:**
   - Clase ApiClient con métodos: get(), post(), put(), delete()
   - Basepath: "/api"
   - Manejo centralizado de errores
   - Credenciales: "include" (para enviar cookies)
   - Headers: { "Content-Type": "application/json" }
   - NO almacenar tokens (usa cookies HttpOnly)

2. **src/hooks/use-api.ts:**
   - export function useApi<T>(endpoint: string, { autoFetch?: boolean })
   - Retorna: { data, loading, error, refetch }
   - useEffect automático si autoFetch !== false
   - Manejo de errores en hook
   - Ejemplo: const { data: patients } = useApi('/api/patients')

3. **src/hooks/use-mutation.ts:**
   - export function useMutation<T,D>(endpoint, method)
   - Retorna: { mutate, loading, error }
   - mutate(payload?)async() retorna T | null
   - Ejemplo: const { mutate: create } = useMutation('/api/patients', 'POST')

4. **src/hooks/use-auth.tsx (REFACTOR):**
   - Cambiar de localStorage a GET /api/auth/me
   - logout() hace POST /api/auth/logout (limpia cookie)
   - Retorna: { user, loading, isAuthenticated, logout }
   - Usa useEffect para cargar usuario en startup

5. **src/app/login/page.tsx (REFACTOR):**
   - Eliminar localStorage.setItem()
   - Usa useMutation('/api/auth/login', 'POST')
   - POST { email, password, clinic_id }
   - Si 200: redirect('/dashboard')
   - Si error: mostrar mensaje
   - Validación local = email format + password.length >= 8

6. **src/app/dashboard/patients/page.tsx (REFACTOR):**
   - Eliminar IndexedDB query
   - Usa const { data: patients } = useApi('/api/patients')
   - Mostrar loading spinner si loading
   - Mostrar error si error
   - Crear paciente: useMutation para POST /api/patients
   - Al crear exitoso: refetch()
   - Test: navegar a /dashboard/patients → debe cargar lista

7. **src/app/dashboard/patients/[id]/page.tsx (REFACTOR):**
   - Usa useApi(`/api/patients/${id}`)
   - Detalle del paciente
   - Botón editar → navigate(edit)

8. **src/app/dashboard/patients/[id]/edit/page.tsx (REFACTOR):**
   - Usa useMutation para PUT /api/patients/[id]
   - Formulario pre-llenado con datos del API
   - Al guardar exitoso: redirect('/dashboard/patients')

9. **src/app/dashboard/appointments/page.tsx (REFACTOR):**
   - Usa useApi('/api/appointments?date=YYYY-MM-DD')
   - Listar citas del día/semana
   - Filtros opcional

10. **src/app/layout.tsx (REFACTOR):**
    - Usar useAuth para validar login
    - Si no autenticado: redirect('/login')
    - Mostrar user.fullName en navbar

RESTRICCIONES:
- NUNCA localStorage.setItem('user', ...)
- NUNCA localStorage.setItem('token', ...)
- Eliminar TODAS las queries directas a IndexedDB
- Validación Zod en forms ANTES de enviar

VALIDACIÓN POR MÓDULO:
Auth:
  - Login exitoso → redirect a /dashboard
  - Logout click → limpia cookie + redirect /login
  - Refresh página en /dashboard → mantiene sesión (cookie)

Patients:
  - GET /api/patients muestra lista ✅
  - POST crea paciente visible en lista ✅
  - GET /api/patients/[id] muestra detalles ✅
  - PUT edita y refleja cambios ✅

Appointments:
  - GET /api/appointments muestra citas ✅
  - Network tab SOLO muestra /api/* (NO IndexedDB)

ENTREGA:
1. 3 módulos refactorizados listados
2. Network tab imagen mostrando /api/* calls
3. LocalStorage verificado vacío (/login, /dashboard)
4. Funcionalidad paridad confirmada
5. Progreso screenshot
```

### ✅ Validación esperada:
- Login funciona desde API
- Pacientes cargan desde /api/patients
- Cookies HttpOnly en Network tab
- localStorage VACÍO (sin tokens)

### ⏱️ Tiempo estimado: **2-3 semanas (una página por semana)**

---

## 💳 FASE 3: Pagos con Transacciones (Semana 6)

### 📖 Lee primero:
```
docs/ANALISIS-ARQUITECTURA-MULTITENANT-MYSQL.md
(Sección "FASE 3 - Pagos con Transacciones")
```

### 🤖 PROMPT PARA LA IA:

```
Fase 3 - Pagos: Servicio robusto con transacciones ACID

OBJETIVO:
Implementar pagos seguros con garantía transaccional.

TAREAS:

1. **src/services/payment.service.ts:**
   - createPayment(clinicId, data) usa prisma.$transaction()
   - Dentro de transacción:
     * Validar patient existe (clinic_id check)
     * Validar appointment existe (clinic_id check)
     * Crear Payment (amount = Decimal, NO float)
     * Crear PaymentHistory (auditoría)
     * Actualizar appointment.status = "completed" si pagado
     * SI ERROR: rollback automático
   
   - getPatientBalance(clinicId, patientId) → suma balance pendiente
   
   - getPaymentHistory(clinicId, paymentId) → historial completo

2. **src/lib/rate-limit.ts:**
   - Máximo 10 pagos por minuto por usuario
   - Máximo 100 pagos por hora por clinic
   - Retorna { success: boolean, remaining: number }

3. **POST /api/payments:**
   - Validar clinic_id desde header
   - Rate limit check
   - Validar input: { patient_id, appointment_id, amount, payment_method }
   - Llamar paymentService.createPayment()
   - Retornar { id, patient_id, status, balance }
   - Test: POST pago exitoso = monto registrado

4. **GET /api/payments?patient_id=X:**
   - Retornar historial de pagos del paciente
   - Incluir balance actual

5. **Frontend - src/app/dashboard/payments/page.tsx:**
   - Formulario crear pago
   - Validar monto > 0
   - Mostrar balance pendiente
   - Al crear: refetch historial

VALIDACIÓN:
- Crear pago → Payment creado en BD ✅
- Check PaymentHistory → registrado ✅
- Simular fallo → rollback (sin Payment huérfano) ✅
- Rate limit: 11 pagos en 1 minuto → 429 Too Many Requests ✅

ENTREGA:
1. Servicio implementado
2. Transacciones probadas (success + failure)
3. Endpoints funcionales
4. Frontend mostrando pagos
```

### ⏱️ Tiempo estimado: **1 semana**

---

## 📥 FASE 4: ETL - Migrar Datos Históricos (Semana 7)

### 📖 Lee primero:
```
docs/ANALISIS-ARQUITECTURA-MULTITENANT-MYSQL.md
(Sección "FASE 4 - ETL")
```

### 🤖 PROMPT PARA LA IA:

```
Fase 4 - ETL: Script para importar backup histórico a MySQL

OBJETIVO:
Migrar datos del IndexedDB actual a MySQL sin pérdida.

TAREAS:

1. **scripts/etl-import-backup.ts:**
   - Función importBackup(filePath)
   - Lee JSON del backup
   - Procesa por tabla:
     * Clinics: crear o usar existentes
     * Users: hash passwords, mapeo IDs
     * Patients: validar DNI, crear relaciones
     * Appointments: validar references
     * Payments: registrar en PaymentHistory
   
   - Retorna reporte: { users_imported, patients_imported, errors }
   - Salva reporte en etl-report-${timestamp}.json

2. **npm script:**
   - "etl:import" en package.json
   - Ejecuta: ts-node scripts/etl-import-backup.ts
   - Recibe ruta: npm run etl:import ./backup.json

3. **Validación:**
   - Contar antes vs después
   - DNIs únicos por clinic
   - Relaciones FK íntegras
   - Passwords hasheados

ENTREGA:
1. Script creado y testeado
2. Reporte generado
3. Reconciliación confirmada
4. Datos visibles en UI
```

### ⏱️ Tiempo estimado: **1 semana**

---

## ✅ FASE 5: Testing, Validación & Go-Live (Semana 8)

### 📖 Lee primero:
```
docs/ANALISIS-ARQUITECTURA-MULTITENANT-MYSQL.md
(Sección "FASE 5 - Testing...")
```

### 🤖 PROMPT PARA LA IA:

```
Fase 5 - Testing y Validación Pre-Producción

OBJETIVO:
Validar sistema completo antes de go-live.

TAREAS:

1. **Build & Type Check:**
   - npm run build sin errores
   - npm run typecheck sin errores
   - npm run lint revisar warnings

2. **Health Check:**
   - GET /api/health retorna 200 con status
   - Incluye db status, timestamp

3. **Smoke Tests (manual):**
   - Auth: login/logout/me funciona
   - Patients: crear/editar/buscar funciona
   - Appointments: crear/cambiar status funciona
   - Payments: crear/historial funciona
   - Multitenant: Clinic A NO ve Clinic B ✅

4. **Backup:**
   - mysqldump prod > backup-before-launch.sql
   - Guardar seguro (NO en git)
   - Test restore en BD test

5. **Documentation:**
   - API endpoints listados
   - Diagrama actualizado
   - Rollback plan documentado

ENTREGA:
1. Todos los tests pasando
2. Build exitoso
3. Backup creado
4. Checklist go-live firmado
```

### ⏱️ Tiempo estimado: **1 semana**

---

## 🎯 RESUMEN: USANDO ESTOS PROMPTS

### **Tu flujo será:**

```
Semana 1:
1. Ejecuta QUICK-START (no necesita IA)
2. Copiar PROMPT-FASE-0 a IA
3. IA ejecuta setup

Semana 2-3:
1. Lee ANALISIS (sección Fase 1)
2. Copiar PROMPT-FASE-1 a IA
3. IA crea backend API

Semana 4-5:
1. Lee ANALISIS (sección Fase 2)
2. Copiar PROMPT-FASE-2 a IA
3. IA migra frontend

Semana 6:
1. Copiar PROMPT-FASE-3 a IA
2. IA implementa pagos

Semana 7:
1. Copiar PROMPT-FASE-4 a IA
2. IA migra datos

Semana 8:
1. Copiar PROMPT-FASE-5 a IA
2. IA valida + go-live
```

**Tiempo usado de lectura:** ~30 minutos TOTAL  
**Tiempo ahorrado:** ~5 horas (vs explicar cada vez)

---

## 🚩 TIPS DE USO

### **Tip 1: Personaliza el prompt si necesitas**
```
Original: "POST /api/patients..."
Tu versión: "POST /api/patients... 
           PLUS: Agregar validación DNI con regex: /^\d{5,}$/"
```

### **Tip 2: Si la IA se desvía**
Repite esta línea:
```
"Mantén el prompt original. No hagas cambios colaterales."
```

### **Tip 3: Entre prompts**
Siempre confirma:
```
"Fase X completada. 
 npm run build: ✅
 npm run typecheck: ✅
 
 Listo para Fase X+1?"
```

### **Tip 4: Si algo falla**
Guarda el estado:
```
"Error en Fase 3. Volvemos a Fase 2 último commit.
 El error fue: [mensaje exacto]
 
 ¿Cómo lo arreglamos?"
```

---

## ✨ RESULTADO FINAL

**Después de usar Este documento:**
- ✅ Prompts específicos por fase
- ✅ Cero ambigüedad
- ✅ IA entiende exactamente qué hacer
- ✅ Desarrollo acelerado (5-10x más rápido)
- ✅ Menor necesidad de explicar

---

**Generado:** 25 de marzo de 2026  
**Estado:** Listo para usar  
**Próximo:** Copia PROMPT-FASE-0 y comienza 🚀
