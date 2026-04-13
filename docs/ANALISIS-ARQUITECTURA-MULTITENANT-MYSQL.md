# 📋 ANÁLISIS COMPLETO: Migración a Arquitectura Multitenant con MySQL
**Generado:** 24 de marzo de 2026  
**Proyecto:** KuskoDento V.2  
**Estado Actual:** Next.js 15 + TypeScript + IndexedDB (LocalDB)  
**Destino:** Next.js + MySQL + Backend API + Multitenant

---

## 📍 TABLA DE CONTENIDOS
1. [Estado Actual del Proyecto](#estado-actual)
2. [Análisis de Viabilidad](#análisis-viabilidad)
3. [Arquitectura Multitenant Recomendada](#arquitectura-multitenant)
4. [Estructura de Carpetas Propuesta](#estructura-carpetas)
5. [Modelo de Datos MySQL (Completo)](#modelo-datos)
6. [Hoja de Ruta con Fases](#hoja-ruta)
7. [Riesgos y Mitigación](#riesgos)
8. [Configuración Inicial Paso a Paso](#configuracion-inicial)
9. [Checklist Pre-Implementación](#checklist)

---

## 🔍 ESTADO ACTUAL DEL PROYECTO {#estado-actual}

### Inventario de Entidades (del código actual)
```
✅ User (Admin, Clinic, Doctor, Assistant, Technician)
✅ Patient (historiales, datos médicos)
✅ Treatment (catálogo de servicios)
✅ Appointment (citas, doctores, costos)
✅ Payment (pagos, saldos, descuentos)
✅ PaymentHistory (historial de pagos)
⚠️ Radiographs (mencionado en rutas, no definido)
⚠️ Odontograms (mencionado en rutas, no definido)
⚠️ Consents (mencionado en rutas, no definido)
⚠️ Inventory (mencionado en rutas, no definido)
⚠️ Subscription/Billing (parcial)
```

### Stack Actual
| Componente | Tecnología | Observación |
|------------|-----------|-------------|
| Framework | Next.js 15 App Router | Moderno, robusto |
| Lenguaje | TypeScript | Excelente tipado |
| Persistencia | IndexedDB (cliente) | ❌ Inseguro para datos sensibles |
| UI | Radix UI + Tailwind | Componentes profesionales |
| AI | Genkit + Google AI | Para recomendaciones |
| Auth | Firebase (parcial) | ⚠️ Requiere refactor a JWT/Session |

### Problemas Actuales (Críticos)
| Problema | Severidad | Impacto |
|----------|----------|--------|
| Datos sensibles en cliente (IndexedDB) | 🔴 CRÍTICA | Violación de GDPR, contraseñas expuestas |
| Sin backend real | 🔴 CRÍTICA | No hay separación de responsabilidades |
| Auth mezclada con Firebase | 🔴 CRÍTICA | Falta control y auditoria server-side |
| Sin modelo multitenant estructurado | 🟡 ALTA | Escalabilidad perjudicada |
| Operaciones de pago sin transacciones | 🔴 CRÍTICA | Inconsistencia financiera |
| Archivos binarios en IndexedDB | 🔴 CRÍTICA | Límites de espacio, rendimiento |

---

## ✅ ANÁLISIS DE VIABILIDAD {#análisis-viabilidad}

### Por qué MySQL en lugar de PostgreSQL
| Aspecto | PostgreSQL | MySQL (8.0+) | Recomendación |
|--------|-----------|--------------|---------------|
| Complejidad inicial | Media | Baja | **MySQL para inicio rápido** |
| Características JSON | Excelente | Buena | MySQL suficiente |
| Transacciones | Completas | Completas (InnoDB) | MySQL es suficiente |
| Multi-tenancy | Buena | Excelente | **MySQL es superior** |
| Performance escalado | Mejor | Muy bueno | Diferencia mínima |
| Hosting económico | Costoso | Disponible | **MySQL más economía** |
| Migración futura | Posible | N/A | **Viable mantenerse en MySQL** |

**Conclusión:** MySQL 8.0+ con InnoDB es **la mejor opción para este proyecto**, especialmente para multitenant.

### Por qué Next.js monolítico (backend + frontend integrados)
| Opción | Ventajas | Desventajas | Recomendación |
|--------|----------|------------|--------------|
| Backend separado (Node/Express) | Escalabilidad total | Complejidad operativa, DevOps extra |  |
| Backend en Next.js API Routes | Integración simple, menos DevOps | Escalabilidad teórica limitada | **✅ ELEGIDA** |

**Decisión:** Usar Next.js API Routes para el backend. Razones:
- Ya tienes Next.js 15
- Suficiente para clinicas (load bajo-medio)
- Una sola codebase = menos complejidad
- Fácil migrar a backend separado después si crece
- Menos DevOps = entrega más rápida

---

## 🏗️ ARQUITECTURA MULTITENANT RECOMENDADA {#arquitectura-multitenant}

### Modelo Multitenant Elegido: Fila Aislada (Row-Level Isolation)

```
┌─────────────────────────────────────────────────────────────┐
│                   MULTITENANT ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  │  Clínica A   │      │  Clínica B   │      │  Clínica C   │
│  │  clinic.dom  │      │ clinic2.dom  │      │ clinic3.dom  │
│  └──────┬───────┘      └──────┬───────┘      └──────┬───────┘
│         │                     │                     │
│         └─────────────────────┼─────────────────────┘
│                               │
│                    (misma aplicación Next.js)
│
│  ┌─────────────────────────────────────────────────────────┐
│  │        MYSQL DATABASE COMPARTIDA CON ISOLACIÓN           │
│  │                  (clinic_id en cada tabla)               │
│  ├─────────────────────────────────────────────────────────┤
│  │ users (clinic_id)                                        │
│  │ patients (clinic_id)                                     │
│  │ appointments (clinic_id)                                 │
│  │ payments (clinic_id)                                     │
│  │ ... (todas las tablas tienen clinic_id)                  │
│  └─────────────────────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Dato Multitenant

```
Request HTTP
    ↓
Middleware (extrae clinic_id de subdomain/token)
    ↓
Context (adjunta clinic_id a cada operación)
    ↓
API Route (valida clinic_id)
    ↓
Servicio (filtra todos los queries por clinic_id)
    ↓
MySQL (consultas con WHERE clinic_id = X)
    ↓
Response (solo datos del tenant correcto)
```

### Beneficios de este Modelo
- ✅ Máxima seguridad (un tenant no ve datos de otro)
- ✅ Escalabilidad (agregar clinicas es agregar fila)
- ✅ Fácil backup por tenant
- ✅ Cumple GDPR (datos aislados por tenant)
- ✅ No sobre-engineered (evita complejidad innecesaria)

---

## 📁 ESTRUCTURA DE CARPETAS PROPUESTA {#estructura-carpetas}

### Opción 1: Monolítico Next.js (RECOMENDADA - Mejor para inicio)

```
KuskoDentoV.2/
├── src/
│   ├── app/                          # ← Frontend (App Router)
│   │   ├── admin/
│   │   ├── appointments/
│   │   ├── patients/
│   │   ├── payments/
│   │   ├── radiographs/
│   │   ├── odontogram/
│   │   ├── consents/
│   │   ├── inventory/
│   │   ├── treatments/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── login/
│   │   ├── api/                      # ← NUEVO: Backend API
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   ├── me/route.ts
│   │   │   │   └── refresh/route.ts
│   │   │   ├── clinics/
│   │   │   │   ├── [id]/route.ts      # GET/PUT clinic by id
│   │   │   │   └── route.ts           # GET all clinics (admin)
│   │   │   ├── users/
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── route.ts
│   │   │   ├── patients/
│   │   │   │   ├── [id]/route.ts
│   │   │   │   ├── [id]/appointments/route.ts
│   │   │   │   └── route.ts
│   │   │   ├── appointments/
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── route.ts
│   │   │   ├── payments/
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── route.ts
│   │   │   ├── treatments/
│   │   │   │   └── route.ts
│   │   │   ├── radiographs/
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── route.ts
│   │   │   ├── reports/
│   │   │   │   ├── revenue/route.ts
│   │   │   │   ├── appointments/route.ts
│   │   │   │   └── patients/route.ts
│   │   │   └── health/route.ts        # GET /api/health (healthcheck)
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── hooks/                         # ← Hooks de cliente (para API)
│   │   ├── use-auth.ts
│   │   ├── use-api.ts                 # ← NUEVO: wrapper fetch
│   │   ├── use-modal.ts               # etc...
│   │
│   ├── lib/
│   │   ├── db.ts                      # ← REFACTOR: solo tipos/interfaces
│   │   ├── api-client.ts              # ← NUEVO: cliente HTTP tipado
│   │   ├── utils.ts
│   │
│   ├── middleware.ts                  # ← NUEVO: validación de auth global
│   │
│   ├── services/                      # ← NUEVO: lógica de negocio (reutilizable)
│   │   ├── auth.service.ts
│   │   ├── patient.service.ts
│   │   ├── appointment.service.ts
│   │   ├── payment.service.ts
│   │   ├── clinic.service.ts
│   │   └── treatment.service.ts
│   │
│   └── types/                         # ← NUEVO: tipos centralizados
│       ├── clinic.types.ts
│       ├── patient.types.ts
│       ├── user.types.ts
│       └── api.types.ts
│
├── prisma/                            # ← NUEVO: ORM (Prisma) + esquema
│   ├── schema.prisma                  # ← Definición de BD
│   └── migrations/                    # ← Migraciones versionadas
│       └── migration_lock.toml
│
├── scripts/                           # ← NUEVO: scripts de utilidad
│   ├── seed.ts                        # Datos iniciales
│   ├── migrate.ts                     # Ejecutar migraciones
│   └── etl-import-backup.ts           # Importar backups antiguos
│
├── docs/
│   ├── ANALISIS-ARQUITECTURA-MULTITENANT-MYSQL.md (este archivo)
│   ├── API-ENDPOINTS.md               # ← NUEVO: documentación de endpoints
│   ├── DATABASE-SCHEMA.md             # ← NUEVO: esquema detallado
│   ├── MULTITENANT-SECURITY.md        # ← NUEVO: estrategia de seguridad
│   └── blueprint.md
│
├── .env.local                         # ← NUEVO: variables locales
├── .env.example                       # ← NUEVO: plantilla de variables
├── schema.prisma                      # ← Referencia (en prisma/schema.prisma)
│
└── package.json
```

### Opción 2: Backend Separado + Frontend (Si escalas después)

```
kusko-dento-monorepo/
├── backend/
│   ├── nest-project/ (o Express)
│   ├── migrations/
│   └── docker-compose.yml
│
├── frontend/
│   ├── next-app/
│   └── .env
│
└── shared/
    └── types/
```

**Recomendación:** Empezar con **Opción 1 (Monolítico)**, migrar a Opción 2 solo si:
- Excedes 1000 usuarios concurrentes
- Necesitas escalado independiente
- Tienes equipo DevOps dedicado

---

## 🗄️ MODELO DE DATOS MYSQL (COMPLETO) {#modelo-datos}

### Diagrama Relacional

```sql
┌──────────────┐
│   CLINICS    │  (Admin tenant)
├──────────────┤
│ id (PK)      │
│ name         │
│ domain       │
│ created_at   │
└──────────────┘
      ↑
      │ (clinic_id)
      │
┌─────┴──────────────────────────────────────┐
│                                             │
│  ┌──────────────┐    ┌──────────────┐     │
│  │    USERS     │    │  TREATMENTS  │     │
│  ├──────────────┤    ├──────────────┤     │
│  │ id           │    │ id           │     │
│  │ clinic_id(FK)├───→│ clinic_id(FK)│     │
│  │ username     │    │ name         │     │
│  │ email        │    │ price        │     │
│  │ password_hash│    └──────────────┘     │
│  │ role         │                         │
│  │ full_name    │                         │
│  └──────┬───────┘                         │
│         │ (doctorId from appointments)    │
│         │                                 │
│  ┌──────┴───────────┐                     │
│  │   PATIENTS       │                     │
│  ├──────────────────┤                     │
│  │ id               │◄───────────────┐    │
│  │ clinic_id (FK)   ├─────────┐      │    │
│  │ dni              │         │      │    │
│  │ names            │         │      │    │
│  │ last_names       │         │      │    │
│  │ email            │         │      │    │
│  │ phone            │         │      │    │
│  │ address          │         │      │    │
│  │ medicalHistory   │         │      │    │
│  │ created_at       │         │      │    │
│  └──────────────────┘         │      │    │
│                               │      │    │
│  ┌──────────────────────┐     │      │    │
│  │   APPOINTMENTS       │     │      │    │
│  ├──────────────────────┤     │      │    │
│  │ id                   │     │ FK   │    │
│  │ clinic_id (FK)       ├─────┤      │    │
│  │ patient_id (FK)      ├──────     │    │
│  │ doctor_id (FK)       ├──────┐    │    │
│  │ treatment_id (FK)    │      │    │    │
│  │ date                 │      │    │    │
│  │ time                 │      │    │    │
│  │ status               │      │    │    │
│  │ cost                 │      │    │    │
│  │ observations         │      │    │    │
│  └──────────┬───────────┘      │    │    │
│             │                  │    │    │
│             └──────────────────┴────┼────┘
│                                     │
│  ┌──────────────────────┐           │
│  │     PAYMENTS         │           │
│  ├──────────────────────┤           │
│  │ id                   │           │
│  │ clinic_id (FK)       ├───────────3
│  │ patient_id (FK)      │
│  │ appointment_id (FK)  │
│  │ amount               │
│  │ balance              │
│  │ payment_method       │
│  │ status (pending...)  │
│  │ created_at           │
│  └──────────────────────┘
│
│  ┌──────────────────────────┐
│  │  PAYMENT_HISTORY         │
│  ├──────────────────────────┤
│  │ id                       │
│  │ clinic_id                │
│  │ payment_id (FK)          │
│  │ amount_paid              │
│  │ payment_date             │
│  │ payment_method           │
│  │ reference                │
│  │ created_at               │
│  └──────────────────────────┘
│
│  ┌──────────────────────────┐
│  │  RADIOGRAPHS             │
│  ├──────────────────────────┤
│  │ id                       │
│  │ clinic_id                │
│  │ patient_id (FK)          │
│  │ appointment_id (FK)      │
│  │ file_url (S3/GCS)        │
│  │ file_name                │
│  │ file_size                │
│  │ type (panoramic...)      │
│  │ notes                    │
│  │ created_at               │
│  └──────────────────────────┘
│
│  ┌──────────────────────────┐
│  │  ODONTOGRAMS             │
│  ├──────────────────────────┤
│  │ id                       │
│  │ clinic_id                │
│  │ patient_id (FK)          │
│  │ appointment_id (FK)      │
│  │ data_json (teeth state)  │
│  │ notes                    │
│  │ created_at               │
│  │ updated_at               │
│  └──────────────────────────┘
│
│  ┌──────────────────────────┐
│  │  CONSENTS                │
│  ├──────────────────────────┤
│  │ id                       │
│  │ clinic_id                │
│  │ patient_id (FK)          │
│  │ appointment_id (FK)      │
│  │ type (informed...)       │
│  │ accepted_at              │
│  │ signed_by (user_id)      │
│  │ document_url (S3/GCS)    │
│  │ created_at               │
│  └──────────────────────────┘
│
│  ┌──────────────────────────┐
│  │  INVENTORY_ITEMS         │
│  ├──────────────────────────┤
│  │ id                       │
│  │ clinic_id (FK)           │
│  │ name                     │
│  │ quantity                 │
│  │ unit_cost                │
│  │ min_quantity             │
│  │ supplier                 │
│  │ last_restocked           │
│  │ created_at               │
│  └──────────────────────────┘
│
└─────────────────────────────────────┘
```

### SQL Schema (Prisma Schema Language)

```prisma
// ============================================
// CLINICS (Admin Tenant)
// ============================================
model Clinic {
  id            String   @id @default(cuid())
  name          String   @unique
  domain        String   @unique  // clinic.domain.com
  phone         String?
  email         String?
  address       String?
  logo_url      String?
  theme         String   @default("light")
  subscription_status String @default("active") // active | suspended | inactive
  subscription_tier    String @default("basic")  // basic | pro | enterprise
  next_payment_date    DateTime?
  contract_start_date  DateTime?
  
  created_by    String?  // Admin ID who registered
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
  
  // Relations
  users         User[]
  patients      Patient[]
  appointments  Appointment[]
  payments      Payment[]
  payment_histories PaymentHistory[]
  treatments    Treatment[]
  radiographs   Radiograph[]
  odontograms   Odontogram[]
  consents      Consent[]
  inventory_items InventoryItem[]

  @@index([domain])
}

// ============================================
// USERS (Con aislamiento multitenant)
// ============================================
model User {
  id            String   @id @default(cuid())
  clinic_id     String   // OBLIGATORIO - aislamiento tenant
  username      String?  @unique
  email         String?  @unique
  password_hash String?
  role          String   @default("doctor")  // admin | clinic_owner | doctor | assistant | technician
  full_name     String?
  dni           String?  @unique
  colegiatura   String?  // Número de colegiatura (doctores)
  phone         String?
  address       String?
  photo_url     String?
  status        String   @default("active")  // active | inactive | blocked
  
  // Auditoria
  last_login    DateTime?
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
  
  // Relations
  clinic        Clinic   @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  appointments_as_doctor Appointment[] @relation("doctor")
  consents_signed Consent[] @relation("signed_by")

  @@unique([clinic_id, email])  // Email único por clinic
  @@index([clinic_id])
  @@index([dni])
  @@index([role])
}

// ============================================
// PATIENTS
// ============================================
model Patient {
  id              String   @id @default(cuid())
  clinic_id       String   // OBLIGATORIO
  dni             String
  full_name       String
  first_name      String?
  last_name       String?
  email           String?
  phone           String
  phone_secondary String?
  address         String
  address_number  String?
  city            String?
  state           String?
  postal_code     String?
  photo_url       String?
  birth_date      DateTime?
  gender          String?  // Male | Female | Other
  
  // Datos médicos
  under_treatment     Boolean @default(false)
  prone_to_bleeding   Boolean @default(false)
  allergic_to_meds    Boolean @default(false)
  allergies_detail    String?
  hypertensive        Boolean @default(false)
  diabetic            Boolean @default(false)
  pregnant            Boolean @default(false)
  medical_observations String?
  
  // Datos de registro
  registered_by   String?
  registration_date DateTime @default(now())
  status          String @default("active")  // active | inactive
  
  // Auditoria
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt
  
  // Relations
  clinic          Clinic   @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  appointments    Appointment[]
  payments        Payment[]
  radiographs     Radiograph[]
  odontograms     Odontogram[]
  consents        Consent[]

  @@unique([clinic_id, dni])  // DNI único por clinic
  @@index([clinic_id])
  @@index([dni])
  @@fulltext([full_name])  // Búsqueda de texto completo
}

// ============================================
// TREATMENTS (Catálogo de servicios)
// ============================================
model Treatment {
  id            String   @id @default(cuid())
  clinic_id     String   // OBLIGATORIO
  name          String
  description   String?
  price         Decimal  @db.Decimal(10, 2)  // ⚠️ NUNCA Float para dinero
  category      String?  // Operatoria | Cirugía | Ortodoncia | etc
  estimated_time Int?    // en minutos
  status        String   @default("active")
  
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
  
  // Relations
  clinic        Clinic   @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  appointments  Appointment[]

  @@unique([clinic_id, name])
  @@index([clinic_id])
}

// ============================================
// APPOINTMENTS (Citas)
// ============================================
model Appointment {
  id              String   @id @default(cuid())
  clinic_id       String   // OBLIGATORIO
  patient_id      String
  doctor_id       String
  treatment_id    String?
  
  date            DateTime
  time            String   // HH:mm
  duration_minutes Int @default(30)
  status          String   @default("scheduled")  // scheduled | completed | cancelled | no-show
  
  cost            Decimal  @db.Decimal(10, 2)
  apply_discount  Boolean  @default(false)
  discount_amount Decimal  @db.Decimal(10, 2) @default(0)
  observations    String?
  
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt
  
  // Relations
  clinic          Clinic   @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  patient         Patient  @relation(fields: [patient_id], references: [id], onDelete: Cascade)
  doctor          User     @relation("doctor", fields: [doctor_id], references: [id])
  treatment       Treatment? @relation(fields: [treatment_id], references: [id])
  payments        Payment[]
  radiographs     Radiograph[]
  odontograms     Odontogram[]
  consents        Consent[]

  @@unique([clinic_id, id])
  @@index([clinic_id])
  @@index([patient_id])
  @@index([doctor_id])
  @@index([date])
  @@index([status])
}

// ============================================
// PAYMENTS & PAYMENT_HISTORY
// ============================================
model Payment {
  id                  String   @id @default(cuid())
  clinic_id           String   // OBLIGATORIO
  patient_id          String
  appointment_id      String
  
  amount              Decimal  @db.Decimal(10, 2)
  total_cost          Decimal  @db.Decimal(10, 2)
  total_paid          Decimal  @db.Decimal(10, 2) @default(0)
  balance             Decimal  @db.Decimal(10, 2)
  
  payment_status      String   @default("pending")  // pending | partial | completed
  payment_method      String?  // cash | card | transfer | etc
  
  notes               String?
  due_date            DateTime?
  
  created_at          DateTime @default(now())
  updated_at          DateTime @updatedAt
  
  // Relations
  clinic              Clinic   @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  patient             Patient  @relation(fields: [patient_id], references: [id], onDelete: Cascade)
  appointment         Appointment @relation(fields: [appointment_id], references: [id], onDelete: Cascade)
  payment_histories   PaymentHistory[]

  @@unique([clinic_id, id])
  @@index([clinic_id])
  @@index([patient_id])
  @@index([payment_status])
  @@index([created_at])
}

model PaymentHistory {
  id              String   @id @default(cuid())
  clinic_id       String   // OBLIGATORIO
  payment_id      String
  
  amount_paid     Decimal  @db.Decimal(10, 2)
  payment_date    DateTime
  payment_method  String
  reference       String?  // receipt number, transaction id, etc
  
  created_at      DateTime @default(now())
  
  // Relations
  clinic          Clinic   @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  payment         Payment  @relation(fields: [payment_id], references: [id], onDelete: Cascade)

  @@index([clinic_id])
  @@index([payment_id])
  @@index([payment_date])
}

// ============================================
// RADIOGRAPHS
// ============================================
model Radiograph {
  id              String   @id @default(cuid())
  clinic_id       String   // OBLIGATORIO
  patient_id      String
  appointment_id  String?
  
  file_url        String   // URL en S3/GCS (NOT en DB)
  file_name       String
  file_size       Int      // bytes
  mime_type       String?  // image/jpeg
  type            String   // panoramic | periapical | bitewing | etc
  
  notes           String?
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt
  
  // Relations
  clinic          Clinic   @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  patient         Patient  @relation(fields: [patient_id], references: [id], onDelete: Cascade)
  appointment     Appointment? @relation(fields: [appointment_id], references: [id], onDelete: SetNull)

  @@index([clinic_id])
  @@index([patient_id])
  @@index([type])
}

// ============================================
// ODONTOGRAMS (Dientes)
// ============================================
model Odontogram {
  id              String   @id @default(cuid())
  clinic_id       String   // OBLIGATORIO
  patient_id      String
  appointment_id  String?
  
  data_json       Json     // { teeth: { 11: { status: "cavidad" }, ... } }
  notes           String?
  
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt
  
  // Relations
  clinic          Clinic   @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  patient         Patient  @relation(fields: [patient_id], references: [id], onDelete: Cascade)
  appointment     Appointment? @relation(fields: [appointment_id], references: [id], onDelete: SetNull)

  @@index([clinic_id])
  @@index([patient_id])
}

// ============================================
// CONSENTS (Consentimientos)
// ============================================
model Consent {
  id              String   @id @default(cuid())
  clinic_id       String   // OBLIGATORIO
  patient_id      String
  appointment_id  String?
  
  consent_type    String   // informed_consent | risk_agreement | privacy | etc
  accepted        Boolean  @default(false)
  accepted_at     DateTime?
  
  signed_by       String?  // User ID (doctor, parent if minor, etc)
  document_url    String?  // PDF en S3/GCS
  
  notes           String?
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt
  
  // Relations
  clinic          Clinic   @relation(fields: [clinic_id], references: [id], onDelete: Cascade)
  patient         Patient  @relation(fields: [patient_id], references: [id], onDelete: Cascade)
  appointment     Appointment? @relation(fields: [appointment_id], references: [id], onDelete: SetNull)
  signed_by_user  User?    @relation("signed_by", fields: [signed_by], references: [id], onDelete: SetNull)

  @@index([clinic_id])
  @@index([patient_id])
  @@index([consent_type])
}

// ============================================
// INVENTORY_ITEMS
// ============================================
model InventoryItem {
  id              String   @id @default(cuid())
  clinic_id       String   // OBLIGATORIO
  
  name            String
  description     String?
  quantity        Int
  unit_cost       Decimal  @db.Decimal(10, 2)
  min_quantity    Int @default(5)
  
  category        String?  // consumible | equipamiento | medicamento | etc
  supplier        String?
  supplier_contact String?
  
  last_restocked  DateTime?
  expiry_date     DateTime?
  
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt
  
  // Relations
  clinic          Clinic   @relation(fields: [clinic_id], references: [id], onDelete: Cascade)

  @@unique([clinic_id, name])
  @@index([clinic_id])
  @@index([quantity])
}
```

---

## 🗺️ HOJA DE RUTA CON FASES (ROADMAP COMPLETO) {#hoja-ruta}

### Cronograma Estimado
| Fase | Duración | Criterio de Éxito |
|------|----------|------------------|
| Fase 0 | 1 semana | Schema Prisma + Secrets configurados |
| Fase 1 | 2 semanas | API Auth + CRUD básicos funcionales |
| Fase 2 | 2 semanas | Frontend migrado a API (auth, pacientes) |
| Fase 3 | 2 semanas | Pagos y transacciones |
| Fase 4 | 1 semana | ETL de dados históricos |
| Fase 5 | 1 semana | Testing e2e + go-live |
| **TOTAL** | **~9 semanas** |  |

---

### ⚙️ FASE 0: Infraestructura y Configuración Inicial (1 semana)

**Objetivos:**
- ✅ Configurar MySQL localmente + variables de entorno
- ✅ Instalar y configurar Prisma ORM
- ✅ Crear schema inicial
- ✅ Configurar secrets (JWT, passwords)
- ✅ Validar conexión

**Tareas:**
1. Instalar MySQL 8.0+ localmente o en servidor
2. Crear base de datos: `kusko_dento_prod`
3. Instalar Prisma: `npm install @prisma/client prisma`
4. Crear archivo `prisma/schema.prisma` con modelo completo (arriba)
5. Crear `.env.local` con:
   ```
   DATABASE_URL="mysql://user:password@localhost:3306/kusko_dento_prod"
   NEXTAUTH_SECRET="$(openssl rand -base64 32)"
   JWT_SECRET="$(openssl rand -base64 32)"
   API_BASE_URL="http://localhost:3000"
   NODE_ENV="development"
   ```
6. Ejecutar: `npx prisma migrate dev --name init`
7. Ejecutar: `npx prisma generate`
8. Validar schema: `npx prisma studio` (UI gráfica)

**Entregables:**
- [ ] Base de datos MySQL creada y accesible
- [ ] Prisma configurado y generado
- [ ] Variables de entorno en `.env.local` y `.env.example`
- [ ] Seed script básico ejecutable

**Validación:**
```bash
npm run typecheck
npx prisma validate
npx prisma db push  # aplicar cambios
```

**Riesgos:**
- ❌ `DATABASE_URL` incorrecta → validar con `mysql -u user -p -h localhost`
- ❌ No instalar `@prisma/client` → falta en build

---

### 🔐 FASE 1: Backend API (Auth + CRUD básicos) (2 semanas)

**Objetivos:**
- ✅ Endpoint login seguro (JWT + HttpOnly)
- ✅ Middleware de autenticación
- ✅ CRUD para Clinic, User, Patient, Treatment
- ✅ Validación con Zod
- ✅ Manejo uniforme de errores

**Tareas Principales:**

#### 1.1 Estructura de Servicios
Crear `src/services/`:
- `auth.service.ts` - login, logout, refresh
- `clinic.service.ts` - CRUD clinics
- `user.service.ts` - CRUD users
- `patient.service.ts` - CRUD patients
- `treatment.service.ts` - CRUD treatments

#### 1.2 Validación con Zod
Crear `src/lib/validators.ts`:
```typescript
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  clinic_id: z.string().cuid(),
});

export const CreatePatientSchema = z.object({
  dni: z.string().min(5),
  full_name: z.string().min(2),
  phone: z.string(),
  address: z.string(),
  // ... resto de campos
});

// ... más schemas
```

#### 1.3 Middleware de Autenticación
Crear `src/middleware.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  // Excluir rutas públicas
  if (request.nextUrl.pathname === "/api/auth/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyJWT(token);
    // Adjuntar a headers para que API routes accedan
    request.headers.set("x-clinic-id", payload.clinic_id);
    request.headers.set("x-user-id", payload.sub);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
```

#### 1.4 Endpoints API
Crear rutas en `src/app/api/`:

**LOGIN**
```typescript
// src/app/api/auth/login/route.ts
import { LoginSchema } from "@/lib/validators";
import { authService } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = LoginSchema.parse(body);

    const result = await authService.login(
      data.email,
      data.password,
      data.clinic_id
    );

    // Cookie HttpOnly + Secure
    const response = NextResponse.json({
      user: result.user,
      clinic: result.clinic,
    });

    response.cookies.set("auth_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 días
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
```

**GET /api/patients?clinic_id=X**
```typescript
// src/app/api/patients/route.ts
import { patientService } from "@/services/patient.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clinicId = request.headers.get("x-clinic-id");
  const userId = request.headers.get("x-user-id");

  if (!clinicId || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const patients = await patientService.getByClinic(clinicId);
    return NextResponse.json(patients);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const clinicId = request.headers.get("x-clinic-id");

  try {
    const body = await request.json();
    const patient = await patientService.create(clinicId, body);
    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
```

#### 1.5 Servicios de Negocio

Ejemplo: `src/services/auth.service.ts`:
```typescript
import { prisma } from "@/lib/db";
import { hash, verify } from "bcrypt";
import { signJWT } from "@/lib/jwt";

class AuthService {
  async login(email: string, password: string, clinicId: string) {
    const user = await prisma.user.findFirst({
      where: { email, clinic_id: clinicId },
    });

    if (!user) throw new Error("Invalid credentials");

    const isValid = await verify(password, user.password_hash!);
    if (!isValid) throw new Error("Invalid credentials");

    // Update last_login
    await prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    });

    // Generar JWT
    const token = await signJWT({
      sub: user.id,
      clinic_id: clinicId,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
      clinic: { id: clinicId },
    };
  }

  async logout(userId: string) {
    // Lógica de logout (si usas token blacklist)
  }
}

export const authService = new AuthService();
```

**Entregables:**
- [ ] Endpoints `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- [ ] Endpoints `/api/patients`, `/api/treatments`, `/api/users`
- [ ] Middleware de autenticación funcionando
- [ ] Validación con Zod en todos los endpoints
- [ ] Tests básicos de API con cURL o Postman

**Validación:**
```bash
# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@clinic.com",
    "password": "securepass123",
    "clinic_id": "clinic123"
  }'

# Test get patients
curl http://localhost:3000/api/patients \
  -H "Cookie: auth_token=..."
```

**Riesgos:**
- ❌ Tokens sin expiración → agregar `expiresIn`
- ❌ Contraseñas sin hash → usar `bcrypt`
- ❌ Validación faltante → siempre usar Zod

---

### 🎨 FASE 2: Migración Frontend a API (2 semanas)

**Objetivos:**
- ✅ Cliente HTTP reutilizable
- ✅ Hooks de React para consumir API
- ✅ Migrar módulos: Auth → Pacientes → Citas
- ✅ Manejo de errores y loading states

**Tareas:**

#### 2.1 Cliente API Centralizado
Crear `src/lib/api-client.ts`:
```typescript
import { useRouter } from "next/navigation";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl;
  }

  async request(
    endpoint: string,
    options?: RequestInit
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include", // para enviar cookies
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "API Error");
      }

      return response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request(endpoint, { method: "GET" });
  }

  post<T>(endpoint: string, data: any): Promise<T> {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data: any): Promise<T> {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint: string): Promise<any> {
    return this.request(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
```

#### 2.2 Hooks Reutilizables
Crear `src/hooks/use-api.ts`:
```typescript
import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export function useApi<T>(
  endpoint: string,
  options?: { autoFetch?: boolean }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.get<T>(endpoint);
      setData(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  React.useEffect(() => {
    if (options?.autoFetch !== false) {
      fetch();
    }
  }, [fetch, options?.autoFetch]);

  return { data, loading, error, refetch: fetch };
}

export function useMutation<T, D>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE" = "POST"
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (payload?: D): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        let result;
        if (method === "POST") {
          result = await apiClient.post<T>(endpoint, payload);
        } else if (method === "PUT") {
          result = await apiClient.put<T>(endpoint, payload);
        } else {
          result = await apiClient.delete(endpoint);
        }
        return result;
      } catch (err) {
        setError((err as Error).message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, method]
  );

  return { mutate, loading, error };
}
```

#### 2.3 Refactor de Páginas
Ejemplo: `src/app/patients/page.tsx`
```typescript
"use client";

import { useApi, useMutation } from "@/hooks/use-api";
import { PatientCard } from "@/components/PatientCard";
import { CreatePatientForm } from "@/components/CreatePatientForm";
import { useState } from "react";

export default function PatientsPage() {
  const { data: patients, loading, error, refetch } = useApi(
    "/patients",
    { autoFetch: true }
  );
  
  const { mutate: createPatient } = useMutation("/patients", "POST");
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (formData: any) => {
    const result = await createPatient(formData);
    if (result) {
      setShowForm(false);
      refetch();
    }
  };

  return (
    <div>
      <h1>Pacientes</h1>
      <button onClick={() => setShowForm(!showForm)}>
        Nuevo Paciente
      </button>

      {showForm && <CreatePatientForm onSubmit={handleCreate} />}

      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid">
        {patients?.map((patient: any) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}
```

**Entregables:**
- [ ] Cliente API centralizado funcionando
- [ ] Hooks `useApi` y `useMutation` probados
- [ ] Módulo Auth consumiendo `/api/auth/login`
- [ ] Módulo Pacientes consumiendo `/api/patients`
- [ ] Módulo Citas consumiendo `/api/appointments`

**Validación:**
- Navegar por cada módulo y verificar que carga datos del servidor
- Crear/editar/eliminar elementos desde UI
- Network tab mostrando llamadas a `/api/*`

**Riesgos:**
- ❌ CORS si frontend y API están en dominios diferentes (usar `isLocalhost` en middleware)
- ❌ Cookies no se envían → verificar `credentials: "include"`
- ❌ Estados de loading/error no mostrados → proporciona feedback al usuario

---

### 💳 FASE 3: Pagos con Transacciones (1 semana)

**Objetivos:**
- ✅ Crear pago con garantía transaccional
- ✅ Historial de pagos auditado
- ✅ Cálculo de saldo atomiko
- ✅ Rate limit en creación de pagos

**Tareas:**

#### 3.1 Servicio de Pagos
Crear `src/services/payment.service.ts`:
```typescript
import { prisma } from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";

class PaymentService {
  async createPayment(clinicId: string, data: any) {
    return await prisma.$transaction(async (tx) => {
      // Validar que paciente existe
      const patient = await tx.patient.findFirst({
        where: { id: data.patient_id, clinic_id: clinicId },
      });
      if (!patient) throw new Error("Patient not found");

      // Validar que cita existe
      const appointment = await tx.appointment.findFirst({
        where: { id: data.appointment_id, clinic_id: clinicId },
      });
      if (!appointment) throw new Error("Appointment not found");

      // Crear pago
      const payment = await tx.payment.create({
        data: {
          clinic_id: clinicId,
          patient_id: data.patient_id,
          appointment_id: data.appointment_id,
          amount: new Decimal(data.amount),
          total_cost: appointment.cost,
          total_paid: data.amount,
          balance: new Decimal(appointment.cost).minus(data.amount),
          payment_status:
            data.amount >= appointment.cost ? "completed" : "partial",
          payment_method: data.payment_method,
        },
      });

      // Crear entrada en historial
      await tx.paymentHistory.create({
        data: {
          clinic_id: clinicId,
          payment_id: payment.id,
          amount_paid: new Decimal(data.amount),
          payment_date: new Date(),
          payment_method: data.payment_method,
          reference: data.reference,
        },
      });

      // Actualizar status de cita si está pagada
      if (
        new Decimal(data.amount).gte(appointment.cost)
      ) {
        await tx.appointment.update({
          where: { id: appointment.id },
          data: { status: "completed" },
        });
      }

      return payment;
    });
  }

  async getPatientBalance(clinicId: string, patientId: string) {
    const payments = await prisma.payment.findMany({
      where: { clinic_id: clinicId, patient_id: patientId },
    });

    const totalBalance = payments.reduce(
      (sum, p) => sum + p.balance.toNumber(),
      0
    );

    return totalBalance;
  }
}

export const paymentService = new PaymentService();
```

#### 3.2 Endpoint de Pagos
```typescript
// src/app/api/payments/route.ts
import { paymentService } from "@/services/payment.service";
import { rateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const clinicId = request.headers.get("x-clinic-id")!;
  const userId = request.headers.get("x-user-id")!;

  // Rate limit: máximo 10 pagos por minuto
  const rl = await rateLimit(userId, "payment_create", 10, 60);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const payment = await paymentService.createPayment(clinicId, body);
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const clinicId = request.headers.get("x-clinic-id")!;
  const patientId = request.nextUrl.searchParams.get("patient_id");

  try {
    if (!patientId) {
      // Todos los pagos de la clínica
      const payments = await prisma.payment.findMany({
        where: { clinic_id: clinicId },
      });
      return NextResponse.json(payments);
    }

    // Pagos de un paciente específico
    const balance = await paymentService.getPatientBalance(
      clinicId,
      patientId
    );
    const payments = await prisma.payment.findMany({
      where: { clinic_id: clinicId, patient_id: patientId },
    });

    return NextResponse.json({ payments, balance });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

**Entregables:**
- [ ] Servicio de pagos con transacciones
- [ ] Endpoint POST /api/payments
- [ ] Endpoint GET /api/payments?patient_id=X
- [ ] Rate limit implementado
- [ ] Tests de transaccionalidad

**Validación:**
- Crear pago y verificar en DB que `PaymentHistory` se creó
- Intentar pago con montos inválidos (debe rechazarse)
- Simular fallo de BD (transacción debe rollback)

**Riesgos:**
- ❌ Usar `Float` para montos → usar `Decimal` de Prisma
- ❌ Sin transacciones → datos inconsistentes
- ❌ Sin rate limit → spam de pagos

---

### 📥 FASE 4: ETL (Importar Datos Históricos) (1 semana)

**Objetivo:** Migrar datos del backup actual a MySQL sin pérdida.

**Asunción:** Tienes un export JSON del IndexedDB actual.

#### 4.1 Script ETL
Crear `scripts/etl-import-backup.ts`:
```typescript
import * as fs from "fs";
import * as path from "path";
import { prisma } from "@/lib/db";
import { hash } from "bcrypt";

interface LegacyUser {
  id: string;
  username?: string;
  password?: string;
  role: string;
  fullName?: string;
  clinicId?: string;
  // ... otros campos
}

interface LegacyPatient {
  id: string;
  dni: string;
  names: string;
  lastNames: string;
  clinicId?: string;
  // ... otros campos
}

async function importBackup(filePath: string) {
  console.log("📥 Iniciando importación desde:", filePath);

  try {
    // Leer archivo
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Crear reporte
    const report = {
      users_imported: 0,
      users_failed: 0,
      patients_imported: 0,
      patients_failed: 0,
      appointments_imported: 0,
      errors: [] as string[],
    };

    // 1. Importar Clinics (si no existen)
    console.log("🏥 Procesando clínicas...");
    const clinicMap = new Map(); // old_id -> new_id

    if (data.clinics) {
      for (const clinic of data.clinics) {
        try {
          const existing = await prisma.clinic.findUnique({
            where: { domain: clinic.domain },
          });

          if (existing) {
            clinicMap.set(clinic.id, existing.id);
          } else {
            const newClinic = await prisma.clinic.create({
              data: {
                name: clinic.name || `Clinic ${clinic.id}`,
                domain: clinic.domain || `clinic-${clinic.id}`,
                email: clinic.email,
                phone: clinic.phone,
                address: clinic.address,
              },
            });
            clinicMap.set(clinic.id, newClinic.id);
            console.log(`  ✅ Clínica creada: ${newClinic.name}`);
          }
        } catch (error) {
          report.errors.push(
            `Clinic import error: ${(error as Error).message}`
          );
        }
      }
    }

    // 2. Importar Users
    console.log("👤 Procesando usuarios...");
    const userMap = new Map();

    if (data.users) {
      for (const user of data.users as LegacyUser[]) {
        try {
          const clinicId =
            clinicMap.get(user.clinicId) || clinicMap.values().next().value;

          if (!clinicId) {
            throw new Error("No clinic found for user");
          }

          // Hash password
          const passwordHash = user.password
            ? await hash(user.password, 10)
            : null;

          const newUser = await prisma.user.create({
            data: {
              clinic_id: clinicId,
              username: user.username,
              email: user.username, // Usar username como email si no hay
              password_hash: passwordHash,
              role: user.role || "doctor",
              full_name: user.fullName,
              status: "active",
            },
          });

          userMap.set(user.id, newUser.id);
          report.users_imported++;
          console.log(`  ✅ Usuario: ${newUser.full_name}`);
        } catch (error) {
          report.users_failed++;
          report.errors.push(
            `User ${user.id}: ${(error as Error).message}`
          );
        }
      }
    }

    // 3. Importar Patients
    console.log("🦷 Procesando pacientes...");
    const patientMap = new Map();

    if (data.patients) {
      for (const patient of data.patients as LegacyPatient[]) {
        try {
          const clinicId =
            clinicMap.get(patient.clinicId) || clinicMap.values().next().value;

          const newPatient = await prisma.patient.create({
            data: {
              clinic_id: clinicId,
              dni: patient.dni || `TEMP-${patient.id}`,
              full_name:
                `${patient.names || ""} ${patient.lastNames || ""}`.trim(),
              first_name: patient.names,
              last_name: patient.lastNames,
              email: patient.email,
              phone: patient.phone || "N/A",
              address: patient.address || "N/A",
              registration_date: new Date(patient.registrationDate || Date.now()),
              status: "active",
            },
          });

          patientMap.set(patient.id, newPatient.id);
          report.patients_imported++;
        } catch (error) {
          report.patients_failed++;
          report.errors.push(
            `Patient ${patient.id}: ${(error as Error).message}`
          );
        }
      }
    }

    // 4. Importar Appointments
    console.log("📅 Procesando citas...");
    if (data.appointments) {
      for (const appt of data.appointments) {
        try {
          const clinicId =
            clinicMap.get(appt.clinicId) || clinicMap.values().next().value;
          const newPatientId = patientMap.get(appt.patientId);
          const newDoctorId = userMap.get(appt.doctorId);

          if (newPatientId && newDoctorId) {
            await prisma.appointment.create({
              data: {
                clinic_id: clinicId,
                patient_id: newPatientId,
                doctor_id: newDoctorId,
                date: new Date(appt.date),
                time: appt.time || "09:00",
                cost: appt.cost || 0,
                status: appt.status || "scheduled",
                observations: appt.observations,
              },
            });
            report.appointments_imported++;
          }
        } catch (error) {
          report.errors.push(
            `Appointment ${appt.id}: ${(error as Error).message}`
          );
        }
      }
    }

    // Generar reporte
    console.log("\n" + "=".repeat(60));
    console.log("📊 REPORTE DE IMPORTACIÓN");
    console.log("=".repeat(60));
    console.log(`Usuarios: ${report.users_imported} ✅ / ${report.users_failed} ❌`);
    console.log(
      `Pacientes: ${report.patients_imported} ✅ / ${report.patients_failed} ❌`
    );
    console.log(`Citas: ${report.appointments_imported} ✅`);

    if (report.errors.length > 0) {
      console.log("\n⚠️ Errores:");
      report.errors.forEach((e) => console.log(`  - ${e}`));
    }

    // Guardar reporte
    const reportPath = path.join(
      process.cwd(),
      `etl-report-${Date.now()}.json`
    );
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Reporte guardado en: ${reportPath}`);

    return report;
  } catch (error) {
    console.error("❌ Error durante importación:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar
const backupFile = process.argv[2] || "./backup.json";
importBackup(backupFile).catch(console.error);
```

#### 4.2 Script NPM
Agregar a `package.json`:
```json
{
  "scripts": {
    "etl:import": "ts-node scripts/etl-import-backup.ts",
    "etl:dry-run": "ts-node scripts/etl-import-backup.ts --dry-run"
  }
}
```

**Ejecución:**
```bash
npm run etl:import ./path/to/backup.json
```

**Entregables:**
- [ ] Script ETL funcional
- [ ] Reporte de importación generado
- [ ] Reconciliación de datos (antes vs después)
- [ ] Documentación del proceso

**Validación:**
- Contar registros antes y después
- Verificar DNIs y emails únicos
- Validar relaciones FK

---

### ✅ FASE 5: Testing e2e + Go-Live (1 semana)

**Objetivo:** Validar que todo funciona junto antes de producción.

**Tareas:**

#### 5.1 Checklist Técnico
- [ ] Build: `npm run build` sin errores
- [ ] Typecheck: `npm run typecheck` sin errores
- [ ] Lint: `npm run lint` sin warnings críticas
- [ ] Migraciones: `npx prisma migrate status` OK
- [ ] Health check: `GET /api/health` responde 200

#### 5.2 Pruebas Funcionales Manuales (Smoke Tests)
Crear documento `docs/SMOKE-TESTS.md`:
```markdown
## Smoke Tests Pre-Go-Live

### 1. Autenticación
- [ ] Login con credenciales válidas → redirect a dashboard
- [ ] Login con credenciales inválidas → error 401
- [ ] Logout limpia cookie auth_token
- [ ] Acceso a /dashboard sin token → redirect a /login

### 2. Pacientes
- [ ] Crear paciente → aparece en lista
- [ ] Editar paciente → cambios reflejados
- [ ] Buscar paciente por DNI → funciona
- [ ] Eliminar paciente → confirmación + eliminado

### 3. Citas
- [ ] Crear cita → asignada a doctor, fecha, paciente
- [ ] Cambiar status de cita → "completed"
- [ ] Listar citas del día → muestra correctamente

### 4. Pagos
- [ ] Crear pago → registrado en BD
- [ ] Ver historial de pagos → todas las transacciones
- [ ] Calcular saldo pendiente → correcto

### 5. Multitenant
- [ ] Clínica A no ve datos de Clínica B
- [ ] Cambiar clinic_id en header → acceso denegado
```

#### 5.3 Plan de Rollback
Crear documento `docs/ROLLBACK-PLAN.md`:
```markdown
## Plan de Rollback

Si algo falla en producción:

1. **Revert código:**
   ```bash
   git revert <commit-hash>
   npm run build
   npm run start
   ```

2. **Revert BD:**
   ```bash
   npx prisma migrate resolve --rolled-back init
   # Y restaurar desde backup anterior
   ```

3. **Comunicar a usuarios:**
   - Email a todos los admins
   - Banner en app si está online
```

**Entregables:**
- [ ] Reporte de tests ejecutados
- [ ] 0 errores críticos
- [ ] Plan de rollback documentado
- [ ] Backup de BD pre-go-live

---

## ⚠️ RIESGOS Y MITIGACIÓN {#riesgos}

| Riesgo | Severidad | Mitigación |
|--------|----------|-----------|
| Pérdida de datos en migración | 🔴 CRÍTICA | ETL con dry-run primero, backup completo antes |
| Contraseñas en texto plano | 🔴 CRÍTICA | NUNCA guardar sin bcrypt, validar en code review |
| SQL Injection | 🔴 CRÍTICA | Usar Prisma ORM (parametrizado automático) |
| XSS si datos de usuario | 🔴 CRÍTICA | React escapa HTML automáticamente, validar APIs |
| Rate limiting insuficiente | 🟡 ALTA | Implementar en middleware global |
| Backup no funciona | 🟡 ALTA | Probar restore cada mes |
| Escalabilidad de MySQL | 🟡 ALTA | Monitorear índices, ready for PostgreSQL después |
| Sesiones sin renovación | 🟡 MEDIA | Implementar refresh tokens |
| Downtime durante migración | 🟡 ALTA | Mantener IndexedDB como fallback 1 semana |

---

## ⚙️ CONFIGURACIÓN INICIAL PASO A PASO {#configuracion-inicial}

### Paso 1: Preparar entorno
```bash
# Ir a carpeta del proyecto
cd "d:\Asistencia program\KuskoDentoV.2"

# Instalar dependencias nuevas
npm install \
  @prisma/client prisma \
  bcryptjs jsonwebtoken \
  zod \
  redis                  # Para rate limiting
```

### Paso 2: Crear MySQL
```bash
# En terminal / cmd
mysql -u root -p

# En MySQL:
CREATE DATABASE kusko_dento_prod;
CREATE USER 'kusko_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON kusko_dento_prod.* TO 'kusko_user'@'localhost';
FLUSH PRIVILEGES;
```

### Paso 3: Configurar Prisma
```bash
# Crear directorio
mkdir -p prisma

# Crear schema.prisma (usar contenido de ## MODELO DE DATOS arriba)
# Crear .env.local:
cd "d:\Asistencia program\KuskoDentoV.2"
echo 'DATABASE_URL="mysql://kusko_user:StrongPassword123!@localhost:3306/kusko_dento_prod"
NEXTAUTH_SECRET="'$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")'"
JWT_SECRET="'$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")'"
API_BASE_URL="http://localhost:3000"
NODE_ENV="development"' > .env.local
```

### Paso 4: Ejecutar migraciones
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Paso 5: Validar
```bash
npx prisma studio  # Abrir UI en http://localhost:5555
npm run build
npm run typecheck
npm run dev         # Iniciar servidor en puerto 9002
```

---

## ✅ CHECKLIST PRE-IMPLEMENTACIÓN {#checklist}

Antes de empezar cualquier fase:

```
ANTES DE FASE 0:
☐ Backup completo de IndexedDB actual
☐ Equipo de desarrollo disponible 9 semanas
☐ MySQL 8.0+ en servidor (local o cloud)
☐ Node.js 18+ instalado

ANTES DE FASE 1:
☐ Base de datos creada y accesible
☐ Prisma migrado exitosamente
☐ Middleware de auth compilando
☐ Tests básicos pasando

ANTES DE FASE 2:
☐ Todos los endpoints CRUD de FASE 1 funcionando
☐ Token JWT generando y validando
☐ Cookies HttpOnly siendo enviadas correctamente

ANTES DE FASE 3:
☐ Todos los módulos frontend consumiendo API
☐ Error handling en UI completo
☐ Loading states en todos los botones

ANTES DE FASE 4:
☐ Backup del IndexedDB extraído a JSON
☐ Script ETL escrito y testeado en env dev
☐ Reporte de migración generado

ANTES DE FASE 5:
☐ Build de producción (`npm run build`) sin errores
☐ Todos los tests funcionales pasados
☐ Plan de rollback documentado y practicado
☐ Backup pre-go-live en sitio seguro
```

---

## 📞 PRÓXIMOS PASOS INMEDIATOS

### Semana 1 (Esta semana):
1. **Crear base de datos MySQL**
   - Instalar MySQL 8.0+ o contratar servicio cloud (AWS RDS, PlanetScale, Supabase)
   - Crear `kusko_dento_prod`
   - Anotar credenciales seguras

2. **Instalar Prisma y dependencias**
   ```bash
   npm install @prisma/client prisma bcryptjs jsonwebtoken zod redis
   ```

3. **Crear schema.prisma y migraciones**
   - Copiar modelo de datos de arriba
   - Ejecutar `npx prisma migrate dev --name init`

4. **Configurar variables de entorno**
   - Crear `.env.local` y `.env.example`

### Semana 2:
1. Implementar middleware de auth
2. Crear endpoints login/logout
3. Testar con Postman/curl

### Siguientes:
- Seguir roadmap de fases 1-5

---

## 📚 RECURSOS Y REFERENCIAS

- [Prisma ORM Docs](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [MySQL Multitenant Architecture](https://dev.mysql.com/doc/)
- [Rate Limiting en Node.js](https://github.com/animir/node-rate-limiter-flexible)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)

---

**Documento actualizado:** 24 de marzo de 2026  
**Estado:** 🟢 Listo para implementación  
**Siguiente paso:** Confirmación de equipo + inicio FASE 0
