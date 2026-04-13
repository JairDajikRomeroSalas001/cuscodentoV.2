# 🎨 ARQUITECTURA EN DIAGRAMAS: Visualización Completa

Diagramas ASCII de toda la arquitectura para entender de un vistazo.

---

## 1️⃣ FLUJO DE REQUEST MULTITENANT

```
FLUJO DE UN REQUEST A LA API

┌─────────────────────────────────────────────────────────────────┐
│                    USUARIO EN NAVEGADOR                          │
│                   clinic.domain.com                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ GET /api/patients
                         │ Cookie: auth_token=eyJh...
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER                                │
│                    (Vercel Serverless)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  src/middleware.ts (ejecuta PRIMERO)                             │
│  ┌──────────────────────────────────────╗                       │
│  │ 1. Extrae token de cookie            │                       │
│  │ 2. Verifica JWT                      │                       │
│  │ 3. Extrae clinic_id del token        │                       │
│  │ 4. Adjunta a request headers:        │                       │
│  │    x-clinic-id: "clinic123"          │                       │
│  │    x-user-id: "user456"              │                       │
│  └──────────────────────────────────────┘                       │
│                         ↓                                        │
│   src/app/api/patients/route.ts                                  │
│   ┌──────────────────────────────────────┐                      │
│   │ GET(request) {                       │                      │
│   │   const clinicId =                   │                      │
│   │     request.headers.get(             │                      │
│   │       'x-clinic-id'                  │                      │
│   │     );                               │                      │
│   │                                      │                      │
│   │   const patients =                   │                      │
│   │     await patientService             │                      │
│   │       .getByClinic(clinicId);        │                      │
│   │                                      │                      │
│   │   return NextResponse.json(patients);│                      │
│   │ }                                    │                      │
│   └──────────────────────────────────────┘                      │
│                         ↓                                        │
│   src/services/patient.service.ts                                │
│   ┌──────────────────────────────────────┐                      │
│   │ getByClinic(clinicId) {              │                      │
│   │   return prisma.patient.findMany({   │                      │
│   │     where: {                         │                      │
│   │       clinic_id: clinicId,  ← ⭐    │                      │
│   │     },                               │                      │
│   │   });                                │                      │
│   │ }                                    │                      │
│   │ (OBLIGATORIO filtrar por clinic_id) │                      │
│   └──────────────────────────────────────┘                      │
│                         ↓                                        │
│   Prisma Client (ORM seguro)                                     │
│   ┌──────────────────────────────────────┐                      │
│   │ Genera SQL parametrizado:            │                      │
│   │ SELECT * FROM patients               │                      │
│   │ WHERE clinic_id = ? AND ...          │                      │
│   │       ↑ Protegido contra SQL inject  │                      │
│   └──────────────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    MYSQL DATABASE                                │
│                 kusko_dento_prod                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  patients table                                                  │
│  ┌──────────────────────────────────────┐                       │
│  │ id │ clinic_id │ dni     │ names ...  │                       │
│  ├──────────────────────────────────────┤                       │
│  │ p1 │ clinic123 │ 12345   │ Juan ...  │  ← Solo Clinic A    │
│  │ p2 │ clinic123 │ 67890   │ María ... │  ← Solo Clinic A    │
│  │ p3 │ clinic456 │ 11111   │ Pedro ... │  ← Solo Clinic B    │
│  │ p4 │ clinic456 │ 22222   │ Ana ...   │  ← Solo Clinic B    │
│  └──────────────────────────────────────┘                       │
│                                                                  │
│  Para Clinic A: WHERE clinic_id='clinic123' retorna 2 registros │
│  Para Clinic B: WHERE clinic_id='clinic456' retorna 2 registros │
│  Nunca se mezclan datos entre clínicas ✅                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                 RESPONSE AL NAVEGADOR                            │
│                                                                  │
│ {                                                                │
│   "data": [                                                      │
│     {"id": "p1", "clinic_id": "clinic123", "dni": "12345", ...},│
│     {"id": "p2", "clinic_id": "clinic123", "dni": "67890", ...} │
│   ]                                                              │
│ }                                                                │
│                                                                  │
│ ✅ Solo pacientes de Clinic A (clinic_id='clinic123')          │
│ ✅ Clinic B nunca ve estos datos                                │
└─────────────────────────────────────────────────────────────────┘
```

**Puntos clave:**
- ✅ Middleware extrae clinic_id del token (no confía en frontend)
- ✅ Service **obligadamente** filtra por clinic_id
- ✅ SQL parametrizado (Prisma) = no SQL injection
- ✅ Resultado: solo datos del tenant correcto

---

## 2️⃣ ARQUITECTURA DE CARPETAS EN 3 NIVELES

```
┌─────────────────────────────────────────────────────────────────┐
│                    NIVEL 1: RUTAS Y UI                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  src/app/patients/page.tsx                                       │
│  ┌────────────────────────────────┐                              │
│  │ "use client"                   │                              │
│  │                                │                              │
│  │ export default function()      │                              │
│  │   const { data, loading } =    │                              │
│  │     useApi('/api/patients')    │                              │
│  │                                │                              │
│  │   return (                     │                              │
│  │     <PatientList data={data} />│                              │
│  │   )                            │                              │
│  └┬───────────────────────────────┘                              │
│   │                                                              │
│   │ Responsabilidad: Renderizar UI, mostrar datos               │
│   │ Dependencia: useApi (hook custom)                           │
│   └───────────────────────────────────────────────────┐         │
│                                                       │          │
└───────────────────────────────────────────────────────┼──────────┘
                                                        │
            ┌───────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────────────┐
│                  NIVEL 2: LOGICA (HOOKS)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  src/hooks/use-api.ts                                            │
│  ┌────────────────────────────────┐                              │
│  │ export function useApi<T>(     │                              │
│  │   endpoint: string             │                              │
│  │ ) {                            │                              │
│  │   const [data, setData] = ...  │                              │
│  │   const [loading, ...] = ...   │                              │
│  │   const [error, ...] = ...     │                              │
│  │                                │                              │
│  │   useEffect(() => {            │                              │
│  │     fetch(endpoint)            │                              │
│  │       .then(setData)           │                              │
│  │   }, [endpoint])               │                              │
│  │                                │                              │
│  │   return { data, loading }     │                              │
│  │ }                              │                              │
│  │                                │                              │
│  │ Responsabilidad: Manejar fetch, errores, loading             │
│  │ Dependencia: apiClient                                        │
│  └┬───────────────────────────────┘                              │
│   │                                                              │
│   └──────────────────────────────────────────────────┐          │
│                                                       │          │
└───────────────────────────────────────────────────────┼──────────┘
                                                        │
            ┌───────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────────────┐
│                 NIVEL 3: INTEGRACION (HTTP)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  src/lib/api-client.ts                                           │
│  ┌────────────────────────────────┐                              │
│  │ class ApiClient {              │                              │
│  │   async get(endpoint) {         │                              │
│  │     const response =            │                              │
│  │       await fetch(              │                              │
│  │         `${this.baseUrl}${ep}`, │                              │
│  │         {                       │                              │
│  │           method: 'GET',        │                              │
│  │           credentials: 'inc',   │                              │
│  │         }                       │                              │
│  │       )                         │                              │
│  │     return response.json()      │                              │
│  │   }                             │                              │
│  │ }                              │                              │
│  │                                │                              │
│  │ Responsabilidad: HTTP requests, cookies, headers             │
│  │ Dependencia: Browser fetch API                                │
│  └┬───────────────────────────────┘                              │
│   │                                                              │
│   └──────────────────────────────────────────────────┐          │
│                                                       │          │
└───────────────────────────────────────────────────────┼──────────┘
                                                        │
                    ┌───────────────────────────────────┘
                    ↓
         /api/patients (Backend)
```

**Cada nivel tiene responsabilidad clara:**
- **UI (Level 1):** Solo renderizar
- **Lógica (Level 2):** Manejar estado async
- **HTTP (Level 3):** Network requests

---

## 3️⃣ FLUJO DE DATOS COMPLETO (LOGIN A LISTADO DE PACIENTES)

```
ESCENARIO: Usuario inicia sesión → Ve lista de pacientes

1. LOGIN
   ┌────────────────────────────────────┐
   │ User entra clinic.domain.com       │
   │ ↓                                  │
   │ <LoginForm />                      │
   │ Ingresa: email + password          │
   │ ↓                                  │
   │ onClick handleLogin()              │
   │ ↓                                  │
   │ POST /api/auth/login               │
   │   body: {                          │
   │     email: "dr@clinic.com",        │
   │     password: "secure123",         │
   │     clinic_id: "clinic123"         │
   │   }                                │
   │ ↓                                  │
   │ Server:                            │
   │ - authService.login()              │
   │ - Hash validate password           │
   │ - Generate JWT token              │
   │ - Set HttpOnly cookie              │
   │ - Return user data                 │
   │ ↓                                  │
   │ client: useEffect(() => {          │
   │   redirect('/dashboard')           │
   │ })                                 │
   └────────────────────────────────────┘
                ↓
2. NAVEGACIÓN A PACIENTES
   ┌────────────────────────────────────┐
   │ Navigate: /dashboard/patients      │
   │ ↓                                  │
   │ src/app/patients/page.tsx          │
   │   useApi('/api/patients')          │
   │ ↓                                  │
   │ useEffect(() => {                  │
   │   fetch('/api/patients', {         │
   │     credentials: 'include' ← envía │
   │   })                       cookie  │
   │ })                                 │
   └────────────────────────────────────┘
                ↓
3. MIDDLEWARE VALIDA TOKEN
   ┌────────────────────────────────────┐
   │ src/middleware.ts                  │
   │ ↓                                  │
   │ const token =                      │
   │   request.cookies                  │
   │     .get('auth_token')?.value      │
   │ ↓                                  │
   │ if (!token) {                      │
   │   return 401 Unauthorized          │
   │ }                                  │
   │ ↓                                  │
   │ const payload = verifyJWT(token)   │
   │ {                                  │
   │   sub: "user456",                  │
   │   clinic_id: "clinic123",          │
   │   role: "doctor",                  │
   │   exp: 1703xxx (7 días)           │
   │ }                                  │
   │ ↓                                  │
   │ request.headers.set(               │
   │   'x-clinic-id': 'clinic123'       │
   │ )                                  │
   │ request.headers.set(               │
   │   'x-user-id': 'user456'           │
   │ )                                  │
   │ ↓                                  │
   │ NextResponse.next()                │
   │ (Continúa a handler)               │
   └────────────────────────────────────┘
                ↓
4. API HANDLER OBTIENE PACIENTES
   ┌────────────────────────────────────┐
   │ src/app/api/patients/route.ts      │
   │                                    │
   │ export async GET(request) {        │
   │   const clinicId =                 │
   │     request.headers.get(           │
   │       'x-clinic-id'                │
   │     ); // 'clinic123'              │
   │                                    │
   │   try {                            │
   │     const patients =               │
   │       await patientService         │
   │         .getByClinic(clinicId);    │
   │                                    │
   │     return NextResponse             │
   │       .json(patients);             │
   │   } catch (error) {                │
   │     return NextResponse             │
   │       .json(                       │
   │         { error: msg },            │
   │         { status: 500 }            │
   │       )                            │
   │   }                                │
   │ }                                  │
   └────────────────────────────────────┘
                ↓
5. SERVICE FILTRA POR CLINIC
   ┌────────────────────────────────────┐
   │ src/services/patient.service.ts    │
   │                                    │
   │ getByClinic(clinicId) {            │
   │   return prisma.patient            │
   │     .findMany({                    │
   │       where: {                     │
   │         clinic_id: clinicId        │
   │         ↑ OBLIGATORIO              │
   │       }                            │
   │     })                             │
   │ }                                  │
   │                                    │
   │ Genera SQL:                        │
   │ SELECT * FROM patients             │
   │ WHERE clinic_id = 'clinic123'      │
   │ AND ... (posibles filtros)         │
   │                                    │
   │ NUNCA SIN FILTRO clinic_id ⚠️     │
   └────────────────────────────────────┘
                ↓
6. MYSQL RETORNA DATOS
   ┌────────────────────────────────────┐
   │ Rows returned:                     │
   │ {                                  │
   │   id: 'p1',                        │
   │   clinic_id: 'clinic123',          │
   │   dni: '12345',                    │
   │   names: 'Juan',                   │
   │   ...                              │
   │ },                                 │
   │ {                                  │
   │   id: 'p2',                        │
   │   clinic_id: 'clinic123',          │
   │   dni: '67890',                    │
   │   names: 'María',                  │
   │   ...                              │
   │ }                                  │
   └────────────────────────────────────┘
                ↓
7. API RESPONSE AL CLIENTE
   ┌────────────────────────────────────┐
   │ HTTP 200 OK                        │
   │                                    │
   │ [{                                 │
   │   id: 'p1',                        │
   │   clinic_id: 'clinic123',          │
   │   names: 'Juan',                   │
   │   ...                              │
   │ }, ...]                            │
   └────────────────────────────────────┘
                ↓
8. FRONTEND RENDERIZA
   ┌────────────────────────────────────┐
   │ const { data, loading } =          │
   │   useApi('/api/patients')          │
   │                                    │
   │ setData(response)                  │
   │ ↓                                  │
   │ <PatientList patients={data} />    │
   │ ↓                                  │
   │ {data?.map(p => (                  │
   │   <PatientCard key={p.id} {...p} />│
   │ ))}                                │
   │ ↓                                  │
   │ <h2>{p.names}</h2>                 │
   │ <p>DNI: {p.dni}</p>               │
   │ ...                                │
   │ ↓                                  │
   │ PACIENTES LISTOS VISIBLES ✅      │
   └────────────────────────────────────┘
```

**Flujo seguro gracias a:**
1. ✅ Token en HttpOnly cookie (no accesible desde JS)
2. ✅ Middleware valida y extrae clinic_id
3. ✅ Service **nunca olvida** filtrar por clinic_id
4. ✅ Prisma parametriza SQL (no SQL injection)
5. ✅ Resultado: Clinic A vs Clinic B **jamás se mezclan**

---

## 4️⃣ ESTRUCTURA DE PAGOS TRANSACCIONAL

```
¿QUÉ PASA CUANDO CREAS UN PAGO?

POST /api/payments
  body: {
    patient_id: "p123",
    appointment_id: "apt456",
    amount: 150.00,
    payment_method: "cash"
  }

        ↓
    HANDLER
        ↓
paymentService.createPayment(clinicId, data)
        ↓
┌───────────────────────────────────────────────────────────┐
│    TRANSACCIÓN DATABASE (TODO O NADA)                     │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ prisma.$transaction(async (tx) => {                      │
│                                                           │
│   PASO 1: Validar que paciente existe                    │
│   ──────────────────────────────────                    │
│   const patient = await tx.patient.findFirst({          │
│     where: {                                             │
│       id: data.patient_id,                               │
│       clinic_id: clinicId                                │
│     }                                                    │
│   })                                                     │
│   if (!patient) throw new Error(...)                     │
│                                                           │
│   PASO 2: Validar que cita existe                       │
│   ────────────────────────────────                      │
│   const appointment = await tx.appointment               │
│     .findFirst({...})                                    │
│   if (!appointment) throw new Error(...)                │
│                                                           │
│   PASO 3: Crear Payment                                 │
│   ──────────────────────                                │
│   const payment = await tx.payment.create({             │
│     data: {                                              │
│       clinic_id: clinicId,                               │
│       patient_id: patient.id,                            │
│       appointment_id: appointment.id,                    │
│       amount: new Decimal(data.amount), ← IMPORTANTE    │
│       total_cost: appointment.cost,                      │
│       total_paid: data.amount,                           │
│       balance: appointment.cost - data.amount,           │
│       payment_status: data.amount >=                     │
│         appointment.cost ? "completed" : "partial",      │
│       payment_method: data.payment_method,               │
│     }                                                    │
│   })                                                     │
│                                                           │
│   PASO 4: Crear PaymentHistory (auditoría)              │
│   ────────────────────────────────────────              │
│   await tx.paymentHistory.create({                      │
│     data: {                                              │
│       clinic_id: clinicId,                               │
│       payment_id: payment.id,                            │
│       amount_paid: new Decimal(data.amount),            │
│       payment_date: new Date(),                          │
│       payment_method: data.payment_method,               │
│       reference: data.reference,                         │
│     }                                                    │
│   })                                                     │
│   → Queda registrado para auditoría ✅                  │
│                                                           │
│   PASO 5: Actualizar status de cita si pagado          │
│   ─────────────────────────────────────────            │
│   if (new Decimal(data.amount).gte(                     │
│     appointment.cost                                     │
│   )) {                                                   │
│     await tx.appointment.update({                       │
│       where: { id: appointment.id },                    │
│       data: { status: "completed" }                     │
│     })                                                   │
│   }                                                      │
│                                                           │
│   RETORNA: payment                                       │
│ })                                                       │
│                                                           │
│ SI FALLA CUALQUIER PASO:                                │
│ ─────────────────────────                              │
│   Rollback automático                                    │
│   ✓ Payment NO creado                                    │
│   ✓ PaymentHistory NO creado                            │
│   ✓ Appointment status NO cambiado                      │
│   ✓ Zero inconsistencias ✅                            │
│                                                           │
└───────────────────────────────────────────────────────────┘
        ↓
    RESPONSE
        ↓
{
  "id": "pay789",
  "patient_id": "p123",
  "appointment_id": "apt456",
  "amount": "150.00",
  "balance": "0.00",
  "payment_status": "completed"
}

✅ GARANTÍA: Todas operaciones sucedieron o NINGUNA
```

**Por qué Transacciones:**
- ❌ Sin transacción: Podría crearse Payment pero NO PaymentHistory → inconsistencia
- ✅ Con transacción: TODO sucede o NADA → garantía ACID

---

## 5️⃣ COMPARATIVA ANTES vs DESPUÉS

```
┌────────────────────────────────────────────────────────────┐
│                        ANTES                               │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Frontend (React)                                           │
│ ├─ IndexedDB (cliente)                                    │
│ │  └─ Contiene: users, patients, appointments, payments  │
│ └─ Lógica de negocio en componentes                      │
│    └─ Validar DNI                                        │
│    └─ Calcular balance                                   │
│    └─ Procesar pagos                                     │
│                                                            │
│ Backend: NADA (Firebase parcial)                          │
│                                                            │
│ Seguridad: ❌ CRÍTICA                                     │
│ ├─ Contraseñas visibles en IndexedDB                     │
│ ├─ Datos sensibles en cliente                            │
│ ├─ Sin autenticación servidor                            │
│ ├─ Sin auditoría                                         │
│ └─ Paciente A podría ver datos de Paciente B si sabe fix │
│                                                            │
│ Escalabilidad: ❌ LIMITADA                                │
│ └─ IndexedDB max ~50MB-200MB                             │
│                                                            │
│ Backup: ❌ MANUAL                                         │
│ └─ Export JSON desde navegador (propenso a fallos)       │
│                                                            │
└────────────────────────────────────────────────────────────┘

VS

┌────────────────────────────────────────────────────────────┐
│                       DESPUÉS                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Frontend (React)                                           │
│ ├─ useApi() hook → fetch desde servidor                  │
│ └─ Solo renderiza, NO lógica de negocio                  │
│                                                            │
│ Backend (Next.js API + Prisma)                            │
│ ├─ 50+ endpoints REST                                     │
│ ├─ Validación con Zod                                     │
│ ├─ Lógica de negocio centralizada (services/)            │
│ ├─ Transacciones para operaciones críticas               │
│ └─ Rate limiting, auditoría                              │
│                                                            │
│ Database (MySQL)                                          │
│ ├─ 13 tablas relacionadas                                │
│ ├─ clinic_id en CADA tabla (multitenant)                 │
│ ├─ Índices para queries rápidas                          │
│ ├─ Foreign keys para integridad                          │
│ └─ Backup automático                                      │
│                                                            │
│ Seguridad: ✅ EXCELENTE                                   │
│ ├─ Contraseñas hasheadas (bcrypt)                        │
│ ├─ JWT + HttpOnly cookies                                │
│ ├─ Middleware valida CADA request                        │
│ ├─ Audit logs completos                                  │
│ ├─ Data isolation por clinic garantizada                 │
│ └─ GDPR compliant                                         │
│                                                            │
│ Escalabilidad: ✅ EXCELENTE                               │
│ ├─ MySQL: terabytes si es necesario                      │
│ ├─ Vercel autoscaling                                     │
│ └─ Ready for 1000+ clínicas                              │
│                                                            │
│ Backup: ✅ AUTOMÁTICO                                     │
│ ├─ MySQL managed (diario)                                │
│ ├─ Recuperación garantizada                              │
│ └─ Per-clinic backup posible                             │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 6️⃣ MATRIZ DE RESPONSABILIDADES

```
        ┌────────────────────────────────────────┐
        │      ¿QUIÉN HACE QUÉ?                  │
        ├────────────────────────────────────────┤
        │ Responsabilidad   │ Antes │ Después    │
        ├───────────────────┼───────┼────────────┤
        │                   │       │            │
        │ Almacenar datos   │ UI    │ MySQL      │
        │ Validar inputs    │ UI    │ API (Zod)  │
        │ Hashear passwords │ UI ❌ │ API ✅     │
        │ Generar JWT       │ NO    │ API ✅     │
        │ Filtrar clinic    │ NO    │ Middleware │
        │ Transacciones     │ NO    │ Prisma ✅  │
        │ Auditoría         │ NO    │ Logs ✅    │
        │ Rate limiting     │ NO    │ Middleware │
        │ Renderizar UI     │ React │ React ✅   │
        │ Fetch data        │ NO    │ Hooks ✅   │
        │                   │       │            │
        └───────────────────┴───────┴────────────┘

ANTES: UI hacía TODO (inseguro)
DESPUÉS: Cada componente su responsabilidad
```

---

**Documento actualizado:** 24 de marzo de 2026  
**Imágenes:** Diagramas ASCII para entender arquitectura visual  
**Uso:** Referencia durante development
