# 📚 DOCUMENTACIÓN COMPLETA - KuskoDento v2

**Versión:** 2.0  
**Última actualización:** 25 de Marzo 2026  
**Estado:** ✅ Producción

---

## 🎯 TABLA DE CONTENIDOS

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura General](#arquitectura-general)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Base de Datos](#base-de-datos)
5. [Backend - Servicios](#backend---servicios)
6. [Backend - API Endpoints](#backend---api-endpoints)
7. [Frontend - Estructura](#frontend---estructura)
8. [Frontend - Componentes](#frontend---componentes)
9. [Frontend - Custom Hooks](#frontend---custom-hooks)
10. [Autenticación y Autorización](#autenticación-y-autorización)
11. [Flujos de Negocio](#flujos-de-negocio)
12. [Guía de Desarrollo](#guía-de-desarrollo)
13. [Despliegue](#despliegue)
14. [Troubleshooting](#troubleshooting)

---

## 📖 RESUMEN EJECUTIVO

### ¿Qué es KuskoDento?

Sistema de gestión integral para clínicas odontológicas de múltiples ubicaciones (multi-tenant) construido con las tecnologías más modernas.

### Características Principales

✅ **Autenticación Multi-Rol**
- Admin global
- Clínicas (propietarios)
- Doctores
- Asistentes y técnicos

✅ **Gestión Completa de Pacientes**
- Registro detallado con DNI
- Historial médico
- Búsqueda avanzada
- Fichas de consentimiento informado

✅ **Administración de Citas**
- Calendario interactivo
- Asignación automática de doctores
- Vincular tratamientos
- Descargas de records

✅ **Sistema de Tratamientos**
- Catálogo personalizado por clínica
- Precios flexibles
- Seguimiento de progreso
- Historial de servicios

✅ **Pagos y Facturación**
- Múltiples métodos de pago
- Seguimiento de balance
- Reportes de ingresos
- Suscripciones a clínicas

✅ **Radiografías y Odontogramas**
- Visor de imágenes con zoom
- PDF viewer integrado
- Odontograma digital interactivo
- Historial de diagnósticos

✅ **Inventario**
- Control de insumos
- Alertas de stock
- Histórico de consumo

✅ **Respaldos de Datos**
- Backup automático
- Exportación/Importación
- ETL (Extract-Transform-Load)

---

## 🏗️ ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────┐
│                    USUARIOS (Web)                        │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
                     ↓
┌─────────────────────────────────────────────────────────┐
│               NEXT.JS 15 (Frontend + Backend)            │
│  ┌──────────────────┐          ┌──────────────────┐    │
│  │  React 19 + TW   │          │  API Routes      │    │
│  │  Components      │          │  (src/app/api)   │    │
│  │  Hooks           │          │                  │    │
│  │  Pages           │          │  Middleware      │    │
│  └──────────────────┘          └────────┬─────────┘    │
│                                         │               │
│  ┌──────────────────┐          ┌────────▼─────────┐    │
│  │  Genkit AI       │          │  Servicios       │    │
│  │  (Análisis)      │          │  (src/services)  │    │
│  └──────────────────┘          └──────────────────┘    │
└─────────────────────────────────────────────────────────┘
                     │
                     ↓
         ┌──────────────────────┐
         │   Prisma ORM         │
         │  (TypeScript)        │
         └──────────┬───────────┘
                     │
         ┌──────────────────────┐
         │   MySQL Database     │
         │   (Multi-Tenant)     │
         └──────────────────────┘

COMUNICACIÓN: REST API + JSON
AUTENTICACIÓN: JWT Tokens (httpOnly cookies)
VALIDACIÓN: Zod + TypeScript
ESTADO: Context API + React 19
```

### Patrones Arquitectónicos

**Multi-Tenant por Dominio**
- Cada clínica tiene su dominio único
- Datos separados por `clinic_id`
- Seguridad: Row-Level Security implícita

**API-First**
- Frontend consume Backend vía REST
- Reutilizar endpoints entre dashboard y apps futuras

**Serverless-Ready**
- Next.js App Router con ISR (Incremental Static Regeneration)
- Zero cold-start con optimización

**Componentes Reutilizables**
- 30+ componentes UI de Radix + shadcn
- Theming con Tailwind CSS
- Responsive design

---

## 🛠️ STACK TECNOLÓGICO

### Frontend

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **React** | 19.2.1 | UI Components |
| **Next.js** | 15.5.9 | Framework full-stack |
| **TypeScript** | Latest | Type Safety |
| **Tailwind CSS** | 3.x | Styling |
| **Radix UI** | Latest | Componentes sin estilo |
| **shadcn/ui** | Latest | Componentes styled |
| **React Hook Form** | 7.54.2 | Formularios |
| **React Day Picker** | 9.11.3 | Calendarios |
| **Recharts** | 2.15.1 | Gráficos |
| **Lucide React** | 0.475.0 | Iconografía |
| **date-fns** | 3.6.0 | Manipulación de fechas |
| **clsx** | 2.1.1 | Class names condicionales |

### Backend

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Node.js** | Latest LTS | Runtime |
| **Next.js** | 15.5.9 | API Routes + SSR |
| **Prisma** | 6.16.2 | ORM |
| **MySQL** | 8.0+ | Database |
| **JWT (jose)** | 6.2.2 | Autenticación |
| **bcryptjs** | 3.0.3 | Hashing de contraseñas |
| **Zod** | Latest | Validación de datos |
| **Genkit** | 1.20.0 | AI/ML integrations |

### DevOps & Deployment

| Herramienta | Uso |
|-----------|-----|
| **Vercel** | Hosting (opcional) |
| **Docker** | Containerización |
| **MySQL Server** | Base de datos |
| **PM2** | Process management (self-hosted) |

---

## 🗄️ BASE DE DATOS

### Esquema General

```sql
┌──────────────────────────────────────────────────────────┐
│                        CLINIC                            │
│ id (PK), name (UNIQUE), domain (UNIQUE), phone, email   │
│ address, logo_url, theme, subscription_status           │
│ subscription_tier, next_payment_date, contract_start_date│
│ created_at, updated_at                                  │
└──────────────────↓───────────────────────────────────────┘
                   │ (1 Clínica → N Usuarios/Pacientes/...)
        ┌──────────┴──────────┬────────────────┬──────────┐
        ↓                     ↓                ↓          ↓
     ┌─────────┐        ┌──────────┐   ┌──────────────┐  ┌─────────────┐
     │  USER   │        │ PATIENT  │   │ APPOINTMENT  │  │  PAYMENT    │
     └─────────┘        └──────────┘   └──────────────┘  └─────────────┘
        │                   │                  │
        │ (Doctor)          │                  │
        │                   │                  ↓
        │                   │            ┌──────────────┐
        │                   │            │PAYMENT_HISTORY│
        │                   │            └──────────────┘
        │                   │
        │         ┌─────────┴──────────────────────┐
        │         ↓                                ↓
        │    ┌──────────────┐           ┌──────────────┘
        │    │ RADIOGRAPH   │           │ ODONTOGRAM
        │    └──────────────┘           └──────────────┘
        │
        │    (Firma Consentimiento)
        └───→ CONSENT

     TREATMENT (Catálogo)
     │
     └───→ APPOINTMENT
```

### Tablas Detalladas

#### 1. **CLINIC**
Información de cada clínica/consultorio en el sistema.

```sql
CREATE TABLE Clinic (
  id                 STRING @id @default(cuid()),
  name               STRING @unique,
  domain             STRING @unique,
  phone              STRING?,
  email              STRING?,
  address            STRING?,
  logo_url           STRING?,
  theme              STRING @default("light"),
  subscription_status STRING @default("active"), -- active, suspended, blocked
  subscription_tier  STRING @default("basic"),   -- basic, pro, enterprise
  next_payment_date  DATETIME?,
  contract_start_date DATETIME?,
  created_by         STRING?,
  created_at         DATETIME @default(now()),
  updated_at         DATETIME @updatedAt,
  
  -- Relaciones
  users              User[]
  patients           Patient[]
  appointments       Appointment[]
  payments           Payment[]
  treatments         Treatment[]
  radiographs        Radiograph[]
  odontograms        Odontogram[]
  consents           Consent[]
  inventory_items    InventoryItem[]
  
  // Índices para búsqueda rápida
  @@index([domain])
);
```

**Campos importantes:**
- `domain`: Subdominio único para cada clínica (ej: `alcaldía.kuskodento.app`)
- `subscription_status`: Control de acceso (active → acceso, suspended → sin acceso, blocked → bloqueado)
- `subscription_tier`: Plan de suscripción (afecta features disponibles)

#### 2. **USER**
Usuarios locales: Doctores, asistentes, administradores.

```sql
CREATE TABLE User (
  id                    STRING @id @default(cuid()),
  clinic_id             STRING,
  username              STRING? @unique,
  email                 STRING? @unique,
  password_hash         STRING?,
  role                  STRING @default("doctor"),     -- admin, clinic, doctor, assistant, technician
  full_name             STRING?,
  dni                   STRING? @unique,
  colegiatura           STRING?,                        -- Licencia profesional
  phone                 STRING?,
  address               STRING?,
  photo_url             STRING?,
  status                STRING @default("active"),      -- active, inactive
  last_login            DATETIME?,
  created_at            DATETIME @default(now()),
  updated_at            DATETIME @updatedAt,
  
  -- Relaciones
  clinic                Clinic @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  appointments_as_doctor Appointment[] @relation("doctor")
  consents_signed       Consent[] @relation("signed_by")
  
  @@unique([clinic_id, email])
  @@index([clinic_id])
  @@index([dni])
  @@index([role])
);
```

**Campos importantes:**
- `role`: Define permisos (admin > clinic > doctor > assistant > technician)
- `password_hash`: Hash bcrypt de la contraseña (NUNCA contraseña plana)
- `dni`: Documento de identidad (único a nivel global)
- `colegiatura`: Número de colegiatura profesional

#### 3. **PATIENT**
Información de pacientes registrados.

```sql
CREATE TABLE Patient (
  id                  STRING @id @default(cuid()),
  clinic_id           STRING,
  dni                 STRING,
  full_name           STRING,
  first_name          STRING?,
  last_name           STRING?,
  email               STRING?,
  phone               STRING,
  phone_secondary     STRING?,
  address             STRING,
  address_number      STRING?,
  city                STRING?,
  state               STRING?,
  postal_code         STRING?,
  photo_url           STRING?,
  birth_date          DATETIME?,
  gender              STRING?,
  
  -- Historial médico
  under_treatment     BOOLEAN @default(false),
  prone_to_bleeding   BOOLEAN @default(false),
  allergic_to_meds    BOOLEAN @default(false),
  allergies_detail    STRING?,
  hypertensive        BOOLEAN @default(false),
  diabetic            BOOLEAN @default(false),
  pregnant            BOOLEAN @default(false),
  medical_observations STRING?,
  
  registered_by       STRING?,
  registration_date   DATETIME @default(now()),
  status              STRING @default("active"),   -- active, inactive, archived
  created_at          DATETIME @default(now()),
  updated_at          DATETIME @updatedAt,
  
  -- Relaciones
  clinic              Clinic @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  appointments        Appointment[]
  payments            Payment[]
  radiographs         Radiograph[]
  odontograms         Odontogram[]
  consents            Consent[]
  
  @@unique([clinic_id, dni])
  @@index([clinic_id])
  @@index([dni])
  @@fulltext([full_name])  -- Búsqueda full-text
);
```

**Búsqueda:**
- FULLTEXT index en `full_name` para búsquedas por nombre
- Índice compuesto `[clinic_id, dni]` para búsquedas rápidas

#### 4. **TREATMENT**
Catálogo de tratamientos odontológicos.

```sql
CREATE TABLE Treatment (
  id             STRING @id @default(cuid()),
  clinic_id      STRING,
  name           STRING,           -- Ej: Limpieza Dental, Endodoncia
  description    STRING?,
  price          DECIMAL(10, 2),
  category       STRING?,          -- Ej: Preventiva, Correctiva, Estética
  estimated_time INT?,             -- Minutos
  status         STRING @default("active"),
  created_at     DATETIME @default(now()),
  updated_at     DATETIME @updatedAt,
  
  -- Relaciones
  clinic         Clinic @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  appointments   Appointment[]
  
  @@unique([clinic_id, name])  -- Tratamientos únicos por clínica
  @@index([clinic_id])
);
```

#### 5. **APPOINTMENT**
Citas programadas.

```sql
CREATE TABLE Appointment (
  id               STRING @id @default(cuid()),
  clinic_id        STRING,
  patient_id       STRING,
  doctor_id        STRING,
  treatment_id     STRING?,
  date             DATETIME,
  time             STRING,           -- Ej: "14:30"
  duration_minutes INT @default(30),
  status           STRING @default("scheduled"), -- scheduled, completed, cancelled, no-show
  cost             DECIMAL(10, 2),
  apply_discount   BOOLEAN @default(false),
  discount_amount  DECIMAL(10, 2) @default(0),
  observations     STRING?,          -- Notas del doctor
  created_at       DATETIME @default(now()),
  updated_at       DATETIME @updatedAt,
  
  -- Relaciones
  clinic           Clinic @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  patient          Patient @relation(fields: [patient_id], references: [id], onDelete: Cascade)
  doctor           User @relation("doctor", fields: [doctor_id], references: [id])
  treatment        Treatment? @relation(fields: [treatment_id], references: [id])
  payments         Payment[]
  radiographs      Radiograph[]
  odontograms      Odontogram[]
  
  @@index([clinic_id])
  @@index([patient_id])
  @@index([doctor_id])
  @@index([date])
);
```

#### 6. **PAYMENT**
Pagos de pacientes.

```sql
CREATE TABLE Payment (
  id               STRING @id @default(cuid()),
  clinic_id        STRING,
  appointment_id   STRING,
  patient_id       STRING,
  total_cost       DECIMAL(10, 2),   -- Monto total del tratamiento
  total_paid       DECIMAL(10, 2),   -- Total pagado hasta ahora
  balance          DECIMAL(10, 2),   -- Pendiente = total_cost - total_paid
  payment_status   STRING,           -- pending, partial, paid
  payment_method   STRING?,          -- cash, card, check, transfer
  notes            STRING?,
  created_at       DATETIME @default(now()),
  updated_at       DATETIME @updatedAt,
  
  -- Relaciones
  clinic           Clinic @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  appointment      Appointment @relation(fields: [appointment_id], references: [id])
  patient          Patient @relation(fields: [patient_id], references: [id])
  payment_histories PaymentHistory[]
  
  @@index([clinic_id])
  @@index([patient_id])
  @@index([appointment_id])
};
```

#### 7. **PAYMENT_HISTORY**
Registro detallado de pagos (auditoría).

```sql
CREATE TABLE PaymentHistory (
  id             STRING @id @default(cuid()),
  payment_id     STRING,
  clinic_id      STRING,
  amount         DECIMAL(10, 2),
  payment_date   DATETIME @default(now()),
  payment_method STRING,
  reference      STRING?,           -- Número de comprobante/cheque
  created_at     DATETIME @default(now()),
  
  -- Relaciones
  payment        Payment @relation(fields: [payment_id], references: [id], onDelete: Cascade)
  clinic         Clinic @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  
  @@index([payment_id])
  @@index([clinic_id])
};
```

#### 8. **RADIOGRAPH**
Radiografías asociadas a pacientes/citas.

```sql
CREATE TABLE Radiograph (
  id             STRING @id @default(cuid()),
  clinic_id      STRING,
  patient_id     STRING,
  appointment_id STRING?,
  file_url       STRING,            -- URL a imagen/PDF
  file_type      STRING?,           -- jpg, png, pdf
  description    STRING?,
  taken_date     DATETIME @default(now()),
  created_at     DATETIME @default(now()),
  
  -- Relaciones
  clinic         Clinic @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  patient        Patient @relation(fields: [patient_id], references: [id], onDelete: Cascade)
  appointment    Appointment? @relation(fields: [appointment_id], references: [id])
  
  @@index([clinic_id])
  @@index([patient_id])
};
```

#### 9. **ODONTOGRAM**
Diagrama odontológico digital (estado de dientes).

```sql
CREATE TABLE Odontogram (
  id             STRING @id @default(cuid()),
  clinic_id      STRING,
  patient_id     STRING,
  appointment_id STRING?,
  data_json      JSON,              -- Estructura del odontograma{tooth: status}
  notes          STRING?,
  created_at     DATETIME @default(now()),
  updated_at     DATETIME @updatedAt,
  
  -- Relaciones
  clinic         Clinic @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  patient        Patient @relation(fields: [patient_id], references: [id], onDelete: Cascade)
  appointment    Appointment? @relation(fields: [appointment_id], references: [id])
  
  @@index([clinic_id])
  @@index([patient_id])
};
```

#### 10. **CONSENT**
Consentimientos informados firmados.

```sql
CREATE TABLE Consent (
  id             STRING @id @default(cuid()),
  clinic_id      STRING,
  patient_id     STRING,
  type           STRING,            -- informed_treatment, privacy, data_processing
  signed_by_id   STRING?,           -- ID del doctor que lo firmó
  signed_at      DATETIME?,
  expires_at     DATETIME?,
  status         STRING @default("pending"), -- pending, signed, expired
  document_url   STRING?,           -- URL al documento PDF
  created_at     DATETIME @default(now()),
  updated_at     DATETIME @updatedAt,
  
  -- Relaciones
  clinic         Clinic @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  patient        Patient @relation(fields: [patient_id], references: [id], onDelete: Cascade)
  signed_by      User? @relation("signed_by", fields: [signed_by_id], references: [id])
  
  @@index([clinic_id])
  @@index([patient_id])
};
```

#### 11. **INVENTORY_ITEM**
Control de insumos/materiales.

```sql
CREATE TABLE InventoryItem (
  id             STRING @id @default(cuid()),
  clinic_id      STRING,
  name           STRING,
  description    STRING?,
  quantity       INT,
  unit           STRING,            -- piece, box, milliliter, etc
  unit_cost      DECIMAL(10, 2)?
  min_quantity   INT @default(5),
  supplier       STRING?,
  last_restocked DATETIME?,
  created_at     DATETIME @default(now()),
  updated_at     DATETIME @updatedAt,
  
  -- Relaciones
  clinic         Clinic @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  
  @@index([clinic_id])
};
```

### Estrategia de Datos Multi-Tenant

**Aislamiento por clinic_id:**
- Cada tabla tiene `clinic_id` para aislar datos
- Queries siempre filtran por `clinic_id` actual
- Imposible cruzar datos entre clínicas

**Seguridad:**
```typescript
// ✅ CORRECTO - Filtra por clinic
const patients = await prisma.patient.findMany({
  where: { clinic_id: userClinicId }
});

// ❌ INCORRECTO - Podría exponer datos de otra clínica
const patients = await prisma.patient.findMany({
  where: { id: patientId }
});
```

---

## 🔌 BACKEND - SERVICIOS

### Ubicación: `src/services/`

Capa de lógica de negocio independiente de HTTP.

#### 1. **appointment.service.ts**

**Responsabilidades:**
- Crear citas
- Validar disponibilidad de doctor
- Calcular costos
- Actualizar estado de cita
- Buscar citas por fecha/doctor

**Métodos principales:**

```typescript
// Crear cita
async createAppointment(data: {
  clinic_id: string;
  patient_id: string;
  doctor_id: string;
  treatment_id?: string;
  date: Date;
  time: string;
  observations?: string;
}): Promise<Appointment>

// Listar citas del día
async getAppointmentsByDate(
  clinic_id: string,
  date: Date
): Promise<Appointment[]>

// Obtener citas de un paciente
async getPatientAppointments(
  clinic_id: string,
  patient_id: string
): Promise<Appointment[]>

// Cambiar estado de cita
async updateAppointmentStatus(
  appointment_id: string,
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
): Promise<Appointment>

// Aplicar descuento
async applyDiscount(
  appointment_id: string,
  discount_amount: number
): Promise<Appointment>
```

#### 2. **auth.service.ts**

**Responsabilidades:**
- Hash y validación de contraseñas
- Generación y verificación de JWT
- Sesiones de usuario
- Refresh tokens
- Logout

**Métodos principales:**

```typescript
// Hash de contraseña
async hashPassword(password: string): Promise<string>

// Verificar contraseña
async verifyPassword(
  plaintext: string,
  hash: string
): Promise<boolean>

// Generar JWT
generateToken(
  user: User,
  expiresIn: string = '24h'
): string

// Verificar JWT
verifyToken(token: string): JWTPayload | null

// Login
async login(
  email: string,
  password: string,
  clinic_id: string
): Promise<{ user: User; clinic: Clinic; token: string }>

// Logout
async logout(user_id: string): Promise<void>
```

#### 3. **clinic.service.ts**

**Responsabilidades:**
- Crear clínicas
- Gestionar suscripciones
- Control de acceso por estado de suscripción
- Personalización (logo, colores, tema)
- Estadísticas por clínica

**Métodos principales:**

```typescript
// Crear clínica
async createClinic(data: {
  name: string;
  domain: string;
  email?: string;
  phone?: string;
  address?: string;
}): Promise<Clinic>

// Obtener info de clínica
async getClinicByDomain(domain: string): Promise<Clinic | null>

// Actualizar estado de suscripción
async updateSubscriptionStatus(
  clinic_id: string,
  status: 'active' | 'suspended' | 'blocked'
): Promise<Clinic>

// Obtener estadísticas
async getClinicStats(clinic_id: string): Promise<ClinicStats>

// Actualizar personalización
async updateClinicBranding(
  clinic_id: string,
  data: { logo_url?: string; theme?: string; name?: string }
): Promise<Clinic>
```

#### 4. **patient.service.ts**

**Responsabilidades:**
- Registro de pacientes
- Búsqueda por DNI/nombre
- Actualizar información médica
- Historial médico
- Validación de duplicados

**Métodos principales:**

```typescript
// Crear paciente
async createPatient(data: {
  clinic_id: string;
  dni: string;
  full_name: string;
  phone: string;
  address: string;
  email?: string;
  birth_date?: Date;
  [key: string]: any;
}): Promise<Patient>

// Buscar por DNI
async getPatientByDNI(
  clinic_id: string,
  dni: string
): Promise<Patient | null>

// Buscar por nombre (FULLTEXT)
async searchPatients(
  clinic_id: string,
  query: string
): Promise<Patient[]>

// Listar todos
async getAllPatients(clinic_id: string): Promise<Patient[]>

// Actualizar info médica
async updateMedicalInfo(
  patient_id: string,
  data: {
    allergic_to_meds?: boolean;
    diabetic?: boolean;
    hypertensive?: boolean;
    allergies_detail?: string;
  }
): Promise<Patient>

// Obtener historial completo
async getPatientHistory(clinic_id: string, patient_id: string): Promise<{
  patient: Patient;
  appointments: Appointment[];
  payments: Payment[];
  radiographs: Radiograph[];
  odontograms: Odontogram[];
}>
```

#### 5. **payment.service.ts**

**Responsabilidades:**
- Registrar pagos
- Calcular balance
- Generar reportes de ingresos
- Gestionar métodos de pago
- Auditoría de transacciones

**Métodos principales:**

```typescript
// Crear pago
async recordPayment(data: {
  appointment_id: string;
  patient_id: string;
  clinic_id: string;
  amount: number;
  payment_method: 'cash' | 'card' | 'check' | 'transfer';
  reference?: string;
}): Promise<Payment>

// Obtener pagos de cita
async getAppointmentPayments(appointment_id: string): Promise<Payment[]>

// Calcular balance
async calculateBalance(appointment_id: string): Promise<{
  total_cost: number;
  total_paid: number;
  balance: number;
  status: 'pending' | 'partial' | 'paid';
}>

// Obtener historial de pago
async getPaymentHistory(payment_id: string): Promise<PaymentHistory[]>

// Reportes por periodo
async getRevenueReport(
  clinic_id: string,
  from: Date,
  to: Date
): Promise<RevenueStats>

// Pagos pendientes
async getPendingPayments(clinic_id: string): Promise<Payment[]>
```

#### 6. **treatment.service.ts**

**Responsabilidades:**
- Crear plan de tratamiento
- Gestionar catálogo de servicios
- Actualizar precios
- Asociar a pacientes
- Generar planes de tratamiento

**Métodos principales:**

```typescript
// Crear tratamiento
async createTreatment(data: {
  clinic_id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  estimated_time?: number;
}): Promise<Treatment>

// Listar tratamientos
async getTreatments(clinic_id: string): Promise<Treatment[]>

// Obtener tratamiento
async getTreatmentById(id: string): Promise<Treatment | null>

// Actualizar precio
async updateTreatmentPrice(
  treatment_id: string,
  new_price: number
): Promise<Treatment>

// Buscar por nombre
async searchTreatments(
  clinic_id: string,
  query: string
): Promise<Treatment[]>

// Obtener por categoría
async getTreatmentsByCategory(
  clinic_id: string,
  category: string
): Promise<Treatment[]>
```

---

## 🌐 BACKEND - API ENDPOINTS

### Ubicación: `src/app/api/`

### Convención de Naming
- Rutas RESTful: `/api/[resource]`
- Métodos: GET (lectura), POST (crear), PUT (actualizar), DELETE (eliminar)
- Respuesta estándar JSON con `success`, `data`, `error`

### Autenticación

Todos los endpoints requieren JWT en cookie `Authorization` (excepto `/login`).

```typescript
// Middleware de auth automático
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('Authorization')?.value;
  if (!token && !isPublicRoute(request.pathname)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  // Validar token...
}
```

---

### 📋 LISTADO COMPLETO DE ENDPOINTS

#### **AUTHENTICATION**

##### `POST /api/auth/login`
Autenticar usuario.

**Request:**
```json
{
  "email": "doctor@clinic.com",
  "password": "password123",
  "clinic_id": "clinic_123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "doctor@clinic.com",
      "role": "doctor",
      "full_name": "Dr. Juan García",
      "clinic_id": "clinic_123"
    },
    "clinic": {
      "id": "clinic_123",
      "name": "Clínica Dental Central",
      "subscription_status": "active"
    },
    "token": "eyJhbGc..."
  }
}
```

**Errores:**
- `400`: Credenciales inválidas
- `404`: Clínica no encontrada
- `403`: Clínica suspendida/bloqueada

---

##### `POST /api/auth/logout`
Cerrar sesión.

**Request:** (requiere auth)

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

##### `GET /api/auth/me`
Obtener usuario actual.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "clinic": {...}
  }
}
```

---

##### `POST /api/auth/refresh`
Renovar token JWT.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "nuevo_token_jwt"
  }
}
```

---

#### **APPOINTMENTS (Citas)**

##### `GET /api/appointments`
Listar citas.

**Query Parameters:**
```
?clinic_id=clinic_123
&patient_id=patient_456     (opcional)
&doctor_id=user_789         (opcional)
&start_date=2026-03-25      (opcional)
&end_date=2026-04-01        (opcional)
&limit=50
&page=1
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "apt_1",
        "patient_id": "pat_1",
        "doctor_id": "doc_1",
        "date": "2026-03-25T14:30:00Z",
        "time": "14:30",
        "status": "scheduled",
        "patient": { "id": "pat_1", "full_name": "Juan Pérez" },
        "doctor": { "id": "doc_1", "full_name": "Dr. García" },
        "treatment": { "id": "trt_1", "name": "Limpieza", "price": "50.00" }
      }
    ],
    "total": 150,
    "page": 1,
    "totalPages": 3
  }
}
```

---

##### `POST /api/appointments`
Crear cita.

**Request:**
```json
{
  "clinic_id": "clinic_123",
  "patient_id": "patient_456",
  "doctor_id": "doctor_789",
  "treatment_id": "treatment_111",
  "date": "2026-03-25T14:30:00Z",
  "time": "14:30",
  "duration_minutes": 30,
  "observations": "Limpieza preventiva"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { "id": "apt_new", ... }
}
```

---

##### `GET /api/appointments/[id]`
Obtener cita específica.

**Response (200):**
```json
{
  "success": true,
  "data": { "id": "apt_1", ... }
}
```

---

##### `PUT /api/appointments/[id]`
Actualizar cita.

**Request:**
```json
{
  "status": "completed",
  "observations": "Procedimiento exitoso"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { "id": "apt_1", "status": "completed", ... }
}
```

---

##### `DELETE /api/appointments/[id]`
Eliminar cita.

**Response (200):**
```json
{
  "success": true,
  "message": "Appointment deleted"
}
```

---

#### **PATIENTS (Pacientes)**

##### `GET /api/patients`
Listar pacientes.

**Query Parameters:**
```
?clinic_id=clinic_123
&search=juan            (búsqueda por nombre)
&dni=12345678          (búsqueda exacta por DNI)
&status=active         (active, inactive, archived)
&limit=50
&page=1
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "patient_1",
        "dni": "12345678",
        "full_name": "Juan Pérez García",
        "phone": "+51987654321",
        "email": "juan@example.com",
        "address": "Av. Principal 123",
        "gender": "male",
        "birth_date": "1990-05-15T00:00:00Z",
        "allergic_to_meds": false,
        "diabetic": true,
        "medical_observations": "Diabético tipo 2"
      }
    ],
    "total": 45,
    "page": 1,
    "totalPages": 1
  }
}
```

---

##### `POST /api/patients`
Crear paciente.

**Request:**
```json
{
  "clinic_id": "clinic_123",
  "dni": "12345678",
  "full_name": "Juan Pérez García",
  "phone": "+51987654321",
  "address": "Av. Principal 123",
  "email": "juan@example.com",
  "gender": "male",
  "birth_date": "1990-05-15",
  "allergic_to_meds": false,
  "diabetic": true,
  "medical_observations": "Diabético tipo 2"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { "id": "patient_new", ... }
}
```

**Validaciones:**
- DNI único por clínica
- Email válido (si se proporciona)
- Teléfono válido
- Mínimo 8 caracteres en nombre completo

---

##### `GET /api/patients/[id]`
Obtener paciente.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "patient": { ... },
    "appointments": [ ... ],
    "payments": [ ... ],
    "radiographs": [ ... ]
  }
}
```

---

##### `PUT /api/patients/[id]`
Actualizar paciente.

**Request:**
```json
{
  "full_name": "Juan Pérez García",
  "phone": "+51987654321",
  "allergic_to_meds": true,
  "allergies_detail": "Penicilina"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { "id": "patient_1", ... }
}
```

---

##### `DELETE /api/patients/[id]`
Eliminar paciente (soft delete).

**Response (200):**
```json
{
  "success": true,
  "message": "Patient archived"
}
```

---

#### **PAYMENTS (Pagos)**

##### `GET /api/payments`
Listar pagos.

**Query Parameters:**
```
?clinic_id=clinic_123
&status=pending|partial|paid
&from=2026-01-01
&to=2026-03-31
&limit=50
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "payment_1",
        "appointment_id": "apt_1",
        "patient_id": "pat_1",
        "total_cost": "150.00",
        "total_paid": "50.00",
        "balance": "100.00",
        "payment_status": "partial",
        "payment_method": "cash",
        "created_at": "2026-03-20T10:00:00Z",
        "patient": { "id": "pat_1", "full_name": "Juan Pérez" },
        "appointment": { "id": "apt_1", "date": "2026-03-20", "treatment": { "name": "Endodoncia" } },
        "payment_histories": [
          {
            "id": "hist_1",
            "amount": "50.00",
            "payment_date": "2026-03-20",
            "payment_method": "cash"
          }
        ]
      }
    ],
    "total": 200
  }
}
```

---

##### `POST /api/payments`
Registrar pago.

**Request:**
```json
{
  "appointment_id": "apt_1",
  "patient_id": "pat_1",
  "clinic_id": "clinic_123",
  "amount": "50.00",
  "payment_method": "cash",
  "reference": "EFECTIVO-001"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "payment_new",
    "balance": "100.00",
    "payment_status": "partial"
  }
}
```

---

##### `GET /api/payments/[id]`
Obtener pago.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "payment": { ... },
    "history": [ ... ]
  }
}
```

---

##### `PUT /api/payments/[id]`
Actualizar pago.

**Request:**
```json
{
  "payment_status": "paid",
  "notes": "Pago final recibido"
}
```

---

##### `DELETE /api/payments/[id]`
Anular pago.

---

#### **TREATMENTS (Tratamientos)**

##### `GET /api/treatments`
Listar tratamientos.

**Query Parameters:**
```
?clinic_id=clinic_123
&category=preventiva
&status=active
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "trt_1",
        "name": "Limpieza Dental",
        "price": "50.00",
        "description": "Limpieza profesional y desinfectante",
        "category": "Preventiva",
        "estimated_time": 30
      }
    ]
  }
}
```

---

##### `POST /api/treatments`
Crear tratamiento.

**Request:**
```json
{
  "clinic_id": "clinic_123",
  "name": "Endodoncia",
  "price": "250.00",
  "description": "Tratamiento de conducto",
  "category": "Correctiva",
  "estimated_time": 90
}
```

---

##### `PUT /api/treatments/[id]`
Actualizar tratamiento.

---

##### `DELETE /api/treatments/[id]`
Eliminar tratamiento.

---

#### **HEALTH CHECK**

##### `GET /api/health`
Verificar salud del API.

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-03-25T10:00:00Z",
  "database": "connected",
  "version": "2.0.0"
}
```

---

### Manejo de Errores Estándar

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid request data",
  "details": { "email": "Email inválido" }
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error",
  "requestId": "req_123456"
}
```

---

## 🎨 FRONTEND - ESTRUCTURA

### Ubicación: `src/app/` y `src/components/`

### Arquitectura

```
src/
├── app/                    # Next.js App Router (páginas + API)
│   ├── layout.tsx         # Layout global
│   ├── page.tsx           # Home (login)
│   ├── dashboard/         # Dashboard principal
│   ├── patients/          # Gestión de pacientes
│   ├── appointments/      # Citas
│   ├── treatments/        # Tratamientos
│   ├── payments/          # Pagos
│   ├── radiographs/       # Radiografías
│   ├── odontogram/        # Odontograma digital
│   ├── consents/          # Consentimientos
│   ├── inventory/         # Inventario
│   ├── backups/           # Respaldos
│   ├── admin/             # Sección administrativa
│   │   ├── users/         # Gestión de usuarios
│   │   ├── billing/       # Facturación
│   │   ├── subscriptions/ # Suscripciones
│   │   └── reports/       # Reportes
│   ├── login/             # Página de login
│   ├── profile/           # Perfil del usuario
│   ├── api/               # API Routes
│   └── globals.css        # Estilos globales
│
├── components/
│   ├── layout/
│   │   └── AppLayout.tsx  # Navegación + sidebar
│   └── ui/                # 30+ componentes reutilizables
│
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities, helpers, tipos
└── services/              # Lógica de negocio
```

---

## 🧩 FRONTEND - COMPONENTES

### 📍 COMPONENTES DE LAYOUT

#### **AppLayout.tsx** (Componente Wrapper Principal)

Proporciona navegación, sidebar, y layout consistent.

```typescript
export function AppLayout({ children }: { children: React.ReactNode }) {
  // Renderiza:
  // - Header con logo y usuario
  // - Sidebar con navegación (dinámica según rol)
  // - Main content area
  // - Toaster para notificaciones
}
```

**Features:**
- Navegación dinámica según rol (admin, clinic, doctor)
- Detecta estado de suscripción (activo, suspendido, bloqueado)
- Sidebar colapsible en mobile
- Tema light/dark
- Dropdown de usuario en header

**Menú dinámico:**
- Admin ve: Dashboard, Reportes, Suscripciones, Facturación, Clínicas
- Clinic ve: Dashboard, Personal, Pacientes, Tratamientos, Pagos, Citas, Inventario, Respaldos
- Doctor ve: Dashboard, Pacientes, Tratamientos, Pagos, Citas, Radiografías, Odontograma, Consentimientos

---

### 🎨 COMPONENTES UI (Radix + shadcn)

#### **Componentes de Formulario**

| Componente | Descripción | Props |
|-----------|------------|-------|
| `<Input />` | Input text | `placeholder, type, disabled, className` |
| `<Textarea />` | Área de texto | `placeholder, rows, disabled` |
| `<Select />` | Dropdown select | `value, onValueChange, disabled` |
| `<Checkbox />` | Checkbox | `checked, onCheckedChange` |
| `<RadioGroup />` | Radio buttons | `value, onValueChange` |
| `<Switch />` | Toggle switch | `checked, onCheckedChange` |
| `<Calendar />` | Date picker | `selected, onSelect, disabled` |
| `<Slider />` | Range slider | `value, onValueChange, min, max` |
| `<Label />` | Form label | `htmlFor, className` |

**Ejemplo de uso:**
```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PatientForm() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre Completo</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Juan Pérez García"
        />
      </div>

      <div>
        <Label htmlFor="gender">Género</Label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger id="gender">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Masculino</SelectItem>
            <SelectItem value="female">Femenino</SelectItem>
            <SelectItem value="other">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
```

---

#### **Componentes de Diálogo**

| Componente | Caso de uso |
|-----------|-----------|
| `<Dialog />` | Diálogos modales generales |
| `<AlertDialog />` | Confirmaciones críticas (borrar) |
| `<Sheet />` | Panel lateral deslizable |

---

#### **Componentes de Datos**

| Componente | Descripción |
|-----------|------------|
| `<Table />` | Tabla datos con paginación |
| `<Card />` | Tarjeta contenedora |
| `<Badge />` | Etiquetas/tags |
| `<Progress />` | Barra de progreso |
| `<Tabs />` | Pestañas/tabs |
| `<Accordion />` | Acordeón desplegable |

---

#### **Componentes de Navegación**

| Componente | Descripción |
|-----------|------------|
| `<Sidebar />` | Barra lateral navegación |
| `<Menubar />` | Barra de menú horizontal |
| `<DropdownMenu />` | Menú contextual |
| `<Popover />` | Popover/tooltip |
| `<Breadcrumb />` | Ruta de navegación |

---

### 📄 PÁGINAS PRINCIPALES

#### **1. DASHBOARD** (`src/app/dashboard/page.tsx`)

Página principal post-login con vistas diferenciadas.

**Admin Dashboard:**
- Total de clínicas (activas, inactivas)
- Total de pacientes del sistema
- Ingresos mensuales
- Gráfico de crecimiento
- Últimas clínicas registradas

**Clinic Dashboard:**
- Stat cards: Pacientes, Citas, Ingresos, Balance
- Gráfico de citas por mes
- Accesos rápidos (pacientes, citas, pagos)
- Alertas de suscripción
- Últimas transacciones

---

#### **2. PATIENTS** (`src/app/patients/page.tsx`)

Gestión completa de pacientes.

**Features:**
- ✅ Listar todos los pacientes
- ✅ Buscar por nombre o DNI
- ✅ Crear nuevo paciente (modal/formulario)
- ✅ Editar información
- ✅ Ver historial completo
- ✅ Eliminar (soft delete)
- ✅ Filtrados por estado (activo, inactivo, archivado)

**Datos mostrados:**
```tsx
{
  dni,
  fullName,
  phone,
  email,
  address,
  birthDate,
  medicalInfo: {
    underTreatment,
    proneToBleeding,
    allergicToMeds,
    diabetic,
    hypertensive,
    pregnant
  }
}
```

---

#### **3. APPOINTMENTS** (`src/app/appointments/page.tsx`)

Gestión de citas odontológicas.

**Features:**
- ✅ Vista calendario semanal/mensual
- ✅ Crear cita (paciente + doctor + tratamiento + hora)
- ✅ Cambiar estado (Asignado → Atendido)
- ✅ Buscar por paciente/doctor
- ✅ Filtrar por fecha
- ✅ Aplicar descuentos
- ✅ Eliminar cita

**Campos:**
```tsx
{
  patient: { id, full_name },
  doctor: { id, full_name },
  treatment: { id, name, price },
  date: YYYY-MM-DD,
  time: HH:MM,
  duration_minutes: 30,
  cost: 150,
  status: "scheduled" | "completed" | "cancelled",
  observations: "Notas del doctor"
}
```

---

#### **4. TREATMENTS** (`src/app/treatments/page.tsx`)

Catálogo de tratamientos.

**Features:**
- ✅ Listar tratamientos por clínica
- ✅ Crear nuevo tratamiento
- ✅ Editar nombre y precio
- ✅ Eliminar tratamiento
- ✅ Buscar por nombre
- ✅ Organizar por categoría

---

#### **5. PAYMENTS** (`src/app/payments/page.tsx`)

Sistema de pagos y facturación.

**Features:**
- ✅ Registro de pagos por cita
- ✅ Múltiples métodos (efectivo, tarjeta, cheque, transferencia)
- ✅ Cálculo automático de balance
- ✅ Historial de pagos
- ✅ Reportes de ingresos
- ✅ Filtrar por estado (pendiente, parcial, pagado)

**Datos:**
```tsx
{
  appointment_id,
  patient_id,
  total_cost: 150,
  total_paid: 50,
  balance: 100,
  payment_status: "partial",
  payment_method: "cash",
  payment_histories: [
    { amount: 50, date: "2026-03-20", method: "cash" }
  ]
}
```

---

#### **6. RADIOGRAPHS** (`src/app/radiographs/page.tsx`)

Gestión de radiografías.

**Features:**
- ✅ Cargar radiografías (JPG, PNG, PDF)
- ✅ Visor de imágenes con zoom
- ✅ PDF viewer integrado
- ✅ Asociar a paciente/cita
- ✅ Buscar por paciente
- ✅ Eliminar

---

#### **7. ODONTOGRAM** (`src/app/odontogram/page.tsx`)

Odontograma digital interactivo.

**Features:**
- ✅ Seleccionar dientes
- ✅ Marcar estado (sano, cariado, tratado, extraído, implante)
- ✅ Guardar para cada cita
- ✅ Histórico de cambios

---

#### **8. CONSENTS** (`src/app/consents/page.tsx`)

Consentimientos informados.

**Features:**
- ✅ Generar consentimiento
- ✅ Marcar como firmado
- ✅ Asociar a paciente
- ✅ Descargar PDF
- ✅ Auditoría (quién, cuándo)

---

#### **9. INVENTORY** (`src/app/inventory/page.tsx`)

Control de insumos.

**Features:**
- ✅ Listar insumos
- ✅ Crear/editar cantidad
- ✅ Alertas de stock bajo
- ✅ Agregar proveedor
- ✅ Histórico de consumo

---

#### **10. BACKUPS** (`src/app/backups/page.tsx`)

Respaldos de datos.

**Features:**
- ✅ Descargar backup
- ✅ Cargar backup anterior
- ✅ ETL (importar datos)
- ✅ Historial de backups

---

#### **11. ADMIN - USERS** (`src/app/admin/users/page.tsx`)

Gestión de usuarios y clínicas (solo admin).

**Features (Admin):**
- ✅ Listar clínicas
- ✅ Crear clínica
- ✅ Editar información
- ✅ Cambiar estado de suscripción (active, suspended, blocked)
- ✅ Ver cuota de pago
- ✅ Agregar/editar usuarios

**Features (Clinic Owner):**
- ✅ Administrar doctores/asistentes/técnicos
- ✅ Editar perfiles
- ✅ Cambiar contraseñas
- ✅ Eliminar usuarios

---

#### **12. ADMIN - BILLING** (`src/app/admin/billing/page.tsx`)

Facturación y suscripciones.

**Features:**
- ✅ Listar suscripciones
- ✅ Cambiar plan (basic, pro, enterprise)
- ✅ Registrar pagos de suscripción
- ✅ Suspender/reactivar servicio
- ✅ Próxima fecha de pago

---

#### **13. ADMIN - REPORTS** (`src/app/admin/reports/page.tsx`)

Reportes a nivel sistémico.

**Features:**
- ✅ Total de clínicas
- ✅ Total de pacientes
- ✅ Ingresos mensuales
- ✅ Gráfico de crecimiento
- ✅ Estadísticas por clínica

---

#### **14. ADMIN - SUBSCRIPTIONS** (`src/app/admin/subscriptions/page.tsx`)

Gestión de suscripciones.

---

#### **15. LOGIN** (`src/app/login/page.tsx`)

Página de autenticación.

**Campos:**
- Email
- Contraseña
- Seleccionador de clínica (dropdown)

---

#### **16. PROFILE** (`src/app/profile/page.tsx`)

Perfil del usuario logueado.

**Features:**
- ✅ Ver información
- ✅ Editar nombre, teléfono, dirección
- ✅ Cambiar contraseña
- ✅ Cargar foto de perfil
- ✅ Ver permisos

---

## 🪝 FRONTEND - CUSTOM HOOKS

### Ubicación: `src/hooks/`

Hooks reutilizables para lógica común.

---

### **1. useAuth**

```typescript
const { 
  user,           // Usuario actual
  isLoading,      // Cargando?
  login,          // (email, password, clinic_id) => Promise
  logout,         // () => Promise
  isAdmin,        // Boolean
  isClinic,       // Boolean
  isDoctor        // Boolean
} = useAuth();
```

**Ejemplo:**
```tsx
function MyComponent() {
  const { user, logout } = useAuth();
  
  if (!user) return <Redirect to="/login" />;
  
  return (
    <div>
      <h1>Hola {user.full_name}</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

---

### **2. useApi**

Hook para llamadas HTTP REST.

```typescript
const { 
  data,           // Datos retornados
  isLoading,      // Cargando?
  error,          // Error si hay
  refetch         // () => Promise<void>
} = useApi(
  '/api/patients',
  { clinic_id: 'clinic_123' }  // query params
);
```

**Ejemplo:**
```tsx
function PatientsList() {
  const { data, isLoading, error } = useApi('/api/patients');

  if (isLoading) return <Spinner />;
  if (error) return <ErrorAlert msg={error} />;

  return (
    <table>
      {data?.items.map(patient => (
        <tr key={patient.id}>
          <td>{patient.full_name}</td>
          <td>{patient.dni}</td>
        </tr>
      ))}
    </table>
  );
}
```

---

### **3. useMutation**

Hook para operaciones POST/PUT/DELETE.

```typescript
const {
  mutate,        // (payload) => Promise<T>
  isLoading,     // Cargando?
  error,         // Error si hay
  data           // Último resultado
} = useMutation(
  'POST',
  '/api/patients'
);
```

**Ejemplo:**
```tsx
function CreatePatientForm() {
  const { mutate, isLoading, error } = useMutation('POST', '/api/patients');
  const [form, setForm] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await mutate(form);
      toast.success('Paciente creado');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulario... */}
      <button disabled={isLoading}>
        {isLoading ? 'Guardando...' : 'Crear'}
      </button>
    </form>
  );
}
```

---

### **4. useToast**

Notificaciones toast.

```typescript
const { toast } = useToast();

// Uso:
toast({ 
  title: "Éxito",
  description: "Paciente creado",
  variant: "default" // default, destructive, success
});
```

---

### **5. useMobile**

Detectar si está en dispositivo móvil.

```typescript
const isMobile = useMobile();

return isMobile ? <MobileLayout /> : <DesktopLayout />;
```

---

## 🔐 AUTENTICACIÓN Y AUTORIZACIÓN

### Flujo de Login

```
┌─────────────┐
│ Usuario     │
│ Login Form  │
└──────┬──────┘
       │ email, password, clinic_id
       ↓
┌───────────────────────────────────┐
│ POST /api/auth/login              │
│  1. Buscar usuario por email      │
│  2. Verificar contraseña (bcrypt) │
│  3. Verificar clinic_id existe    │
│  4. Generar JWT                   │
│  5. Set httpOnly cookie           │
└──────┬────────────────────────────┘
       │ { user, clinic, token }
       ↓
┌────────────────────────────────┐
│ useAuth store en Context       │
│  (localStorage, state)         │
└────────────────────────────────┘
       │
       ↓
┌────────────────────────────────┐
│ Dashboard                      │
│ (Acceso concedido)             │
└────────────────────────────────┘
```

### JWT Payload

```json
{
  "sub": "user_123",
  "email": "doctor@clinic.com",
  "role": "doctor",
  "clinic_id": "clinic_123",
  "clinic_name": "Clínica Central",
  "iat": 1699000000,
  "exp": 1699086400
}
```

### Middleware de Protección

```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('Authorization')?.value;
  
  // Rutas públicas
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  
  // Rutas protegidas: validar token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Verificar token válido
  const isValid = verifyJWT(token);
  if (!isValid) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}
```

### Control de Acceso por Rol

**Admin** (Super-usuario global)
- ✅ Crear clínicas
- ✅ Gestionar suscripciones
- ✅ Ver reportes globales
- ✅ Ver todas las clínicas
- ❌ Acceso a pacientes individuales

**Clinic Owner**
- ✅ Gestionar su clínica
- ✅ Crear/editar usuarios
- ✅ Ver reportes de su clínica
- ✅ Gestionar facturación
- ❌ Acceso a otras clínicas
- ❌ Crear otras clínicas

**Doctor**
- ✅ Ver pacientes
- ✅ Crear/editar citas
- ✅ Registrar radiografías
- ✅ Odontogramas
- ✅ Ver pagos
- ❌ Crear usuarios
- ❌ Facturación

**Assistant/Technician**
- ✅ Acceso limitado
- ✅ Ver pacientes (no editar)
- ✅ Cargar radiografías
- ✅ Actualizar inventario

---

## 📊 FLUJOS DE NEGOCIO

### Flujo 1: Registro de Nuevo Paciente

```
1. Doctor abre "Pacientes" → Click "Nuevo Paciente"
2. Modal abre con formulario
3. Llena: DNI, Nombre, Teléfono, Dirección, Género, etc.
4. Click "Guardar"
   → POST /api/patients
   → Validación en backend (DNI único, formato)
   → Guardar en DB
   → Retornar paciente creado
5. Toast "Paciente creado"
6. Actualizar lista de pacientes
```

---

### Flujo 2: Agendar Cita

```
1. Doctor abre "Citas" → Click "Nueva Cita"
2. Selecciona:
   - Paciente (dropdown búsqueda por nombre/DNI)
   - Tratamiento (dropdown, se muestra precio)
   - Fecha (date picker)
   - Hora (time picker)
   - Doctor (dropdown)
3. Click "Agendar"
   → POST /api/appointments
   → Validaciones (paciente existe, doctor disponible, etc)
   → Guardar en DB
4. Cita aparece en calendario
5. Generar notificación/SMS (futuro)
```

---

### Flujo 3: Registrar Pago

```
1. Doctor abre cita completada
2. Click tab "Pagos"
3. Rellena: Monto, Método (efectivo/tarjeta/etc), Referencia
4. Click "Registrar Pago"
   → POST /api/payments
   → Calcula nuevo balance
   → Guarda en PaymentHistory
5. Balance se actualiza automáticamente
6. Si balance == 0 → Estado "PAGADO"
```

---

### Flujo 4: Generar Reporte

```
1. Admin abre "Reportes"
2. Selecciona período (mes, rango de fechas)
3. Click "Generar"
   → Consulta base de datos
   → Calcula: total ingresos, pacientes nuevos, citas, etc
   → Renderiza gráficos (Recharts)
   → Opción descargar como PDF/Excel (futuro)
```

---

## 📚 GUÍA DE DESARROLLO

### Configuración Inicial

#### 1. **Clonar repositorio**
```bash
git clone https://github.com/[owner]/KuskoDentoV.2.git
cd KuskoDentoV.2
```

#### 2. **Instalar dependencias**
```bash
npm install
```

#### 3. **Configurar variables de entorno**

Crear `.env.local`:
```bash
DATABASE_URL=mysql://usuario:password@localhost:3306/kuskodento
NEXTAUTH_SECRET=tu_secret_aqui
JWT_SECRET=tu_jwt_secret_aqui
NEXT_PUBLIC_API_URL=http://localhost:9002
```

#### 4. **Configurar base de datos**

```bash
# Generar Prisma Client
npx prisma generate

# Correr migraciones
npx prisma migrate dev --name init

# Seed de datos (opcional)
node scripts/seed-phase1.js
```

#### 5. **Iniciar servidor de desarrollo**

```bash
npm run dev
```

Abre [http://localhost:9002](http://localhost:9002)

### Comandos Útiles

```bash
# Desarrollo con Turbopack (más rápido)
npm run dev

# Build para producción
npm run build

# Iniciar servidor producción
npm start

# Linting
npm run lint

# Type checking
npm run typecheck

# Genkit AI dev
npm run genkit:dev

# Smoke tests
npm run test:smoke

# ETL import
npm run etl:import

# Visualizar DB (Prisma Studio)
npx prisma studio
```

### Estructura de Carpetas para Nuevas Features

Si vas a añadir una nueva feature (ej: Chat):

```
src/
├── app/
│   ├── chat/
│   │   └── page.tsx          # Página de chat
│   └── api/
│       └── chat/
│           ├── route.ts       # GET/POST /api/chat
│           └── [id]/
│               └── route.ts   # GET/PUT/DELETE /api/chat/[id]
├── components/
│   └── chat/
│       ├── ChatWidget.tsx    # Componente principal
│       └── MessageItem.tsx   # Componente secundario
├── hooks/
│   └── use-chat.ts           │ Hook personalizado
├── services/
│   └── chat.service.ts       # Lógica de negocio
└── lib/
    └── validators.ts         # Schemas Zod
```

### Patrón MVC (Modificado)

```typescript
// 1. ROUTE (Controller)
// src/app/api/patients/route.ts
export async function GET(req: NextRequest) {
  const clinicId = req.nextUrl.searchParams.get('clinic_id');
  const patients = await patientService.getPatients(clinicId);
  return succeededResponse(patients);
}

// 2. SERVICE (Business Logic)
// src/services/patient.service.ts
export async function getPatients(clinicId: string) {
  return prisma.patient.findMany({
    where: { clinic_id: clinicId }
  });
}

// 3. COMPONENT (View)
// src/app/patients/page.tsx
export function PatientsPage() {
  const { data: patients } = useApi('/api/patients');
  return (
    <table>
      {patients?.map(p => <tr key={p.id}>{p.full_name}</tr>)}
    </table>
  );
}
```

### Validación de Datos

Usar Zod para validación:

```typescript
import { z } from 'zod';

export const createPatientSchema = z.object({
  dni: z.string().min(8).max(20),
  full_name: z.string().min(3),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/),
  email: z.string().email().optional(),
  address: z.string().min(5)
});

type CreatePatientInput = z.infer<typeof createPatientSchema>;

// En API:
export async function POST(req: NextRequest) {
  const body = await req.json();
  const validated = createPatientSchema.parse(body); // Lanza error si invalid
  // ...
}
```

### Estado Global (Context API)

```typescript
// src/contexts/AppContext.tsx
import { createContext, useState } from 'react';

interface AppContextType {
  selectedClinic: Clinic | null;
  setSelectedClinic: (clinic: Clinic) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  return (
    <AppContext.Provider value={{ selectedClinic, setSelectedClinic }}>
      {children}
    </AppContext.Provider>
  );
}

// Uso en componentes:
import { useContext } from 'react';
const { selectedClinic } = useContext(AppContext);
```

---

## 🚀 DESPLIEGUE

### Despliegue en Vercel (Recomendado)

```bash
# 1. Push a GitHub
git add .
git commit -m "Deploy to Vercel"
git push origin main

# 2. Conectar repo en https://vercel.com/dashboard
# 3. Vercel auto-detecta Next.js
# 4. Configurar variables de entorno en Vercel Dashboard
# 5. Deploy automático en cada push a main
```

### Variables de Entorno para Producción

```bash
DATABASE_URL=mysql://prod_user:secure_pass@prod-db-server:3306/kuskodento_prod
NEXTAUTH_SECRET=[long_random_string]
JWT_SECRET=[long_random_string_different]
NEXT_PUBLIC_API_URL=https://app.kuskodento.com
NODE_ENV=production
```

### Despliegue Self-Hosted (VPS)

```bash
# 1. SSH a servidor
ssh root@192.168.1.1

# 2. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instalar MySQL
sudo apt-get install -y mysql-server

# 4. Clonar código
git clone https://github.com/[owner]/KuskoDentoV.2.git
cd KuskoDentoV.2

# 5. Instalar dependencias
npm install

# 6. Build
npm run build

# 7. Usar PM2 para process management
npm install -g pm2
pm2 start "npm start" --name "kuskodento"
pm2 save
pm2 startup

# 8. Configurar Nginx como reverse proxy
sudo apt-get install -y nginx
# Editar /etc/nginx/sites-available/default
# Apuntar a localhost:3000

# 9. SSL con Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d kuskodento.com
```

### Nginx Config Ejemplo

```nginx
server {
  listen 80;
  server_name kuskodento.com;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

---

## 🐛 TROUBLESHOOTING

### Error: "Database connection refused"

**Solución:**
```bash
# 1. Verificar MySQL está corriendo
sudo systemctl status mysql

# 2. Verificar DATABASE_URL es correcto
# 3. Verificar usuario/password
mysql -u usuario -p -h 127.0.0.1
```

### Error: "JWT expired"

**Solución:**
```bash
# El token expiró, necesita hacer login de nuevo
# O implementar refresh token automático
```

### Error: "Cannot find module '@/lib/db'"

**Solución:**
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules
npm install

# O resetear TypeScript
npx tsc --noEmit
```

### S error: "Clinic suspended"

**Solución:**
- La clínica está suspendida en la facturación
- Admin debe cambiar estado en `/admin/billing`

### Lentitud en queries

**Solución:**
```typescript
// Agregar índices en Prisma schema
@@index([clinic_id, patient_id])

// O usar Prisma query optimization
select: {
  id: true,
  name: true,
  // Evitar cargar campos grandes innecesarios
}
```

---

## 📞 SOPORTE Y CONTACTO

- **Documentación:** https://kuskodento.com/docs
- **Issues:** https://github.com/[owner]/KuskoDentoV.2/issues
- **Email:** soporte@kuskodento.com

---

## 📄 CHANGELOG

### v2.0.0 (25/03/2026)

✅ Lanzamiento inicial  
✅ Autenticación multi-tenant  
✅ Gestión de pacientes completa  
✅ Sistema de citas  
✅ Pagos y facturación  
✅ Radiografías y odontogramas  
✅ Inventario  
✅ Respaldos automáticos  

### v2.1.0 (próximo)

🔜 Chat en tiempo real  
🔜 Notificaciones SMS  
🔜 App móvil nativa  
🔜 Integración con laboratorios  
🔜 BI avanzado  

---

**Documentación generada automáticamente**  
Última actualización: 25 de Marzo 2026
