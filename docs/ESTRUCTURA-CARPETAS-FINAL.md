# 🗂️ ESTRUCTURA DE CARPETAS FINAL (Después de todas las fases)

Así se vería tu proyecto al completar las 5 fases.

```
d:\Asistencia program\KuskoDentoV.2\
│
├── src/
│   ├── app/                                  # Next.js App Router (Frontend + Backend API)
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx                 # UI de login
│   │   │   └── logout/
│   │   │       └── route.ts                 # Endpoint POST /api/logout
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                   # Layout con AppLayout.tsx
│   │   │   ├── page.tsx                     # Page.tsx refactorizado (dashboard)
│   │   │   │
│   │   │   ├── patients/
│   │   │   │   ├── page.tsx                 # Lista de pacientes (NEW: consume /api/patients)
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx             # Formulario crear paciente
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx             # Detalle paciente
│   │   │   │       ├── edit/
│   │   │   │       │   └── page.tsx         # Editar paciente
│   │   │   │       └── odontogram/
│   │   │   │           └── page.tsx         # Odontograma del paciente
│   │   │   │
│   │   │   ├── appointments/
│   │   │   │   ├── page.tsx                 # Lista de citas (NEW: /api/appointments)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── payments/
│   │   │   │   ├── page.tsx                 # Pagos (NEW: /api/payments)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── radiographs/
│   │   │   │   ├── page.tsx                 # (NEW: /api/radiographs)
│   │   │   │   └── upload/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── treatments/
│   │   │   │   ├── page.tsx                 # Catálogo (NEW: /api/treatments)
│   │   │   │   └── [id]/
│   │   │   │
│   │   │   ├── consents/
│   │   │   │   └── page.tsx                 # (NEW: /api/consents)
│   │   │   │
│   │   │   ├── inventory/
│   │   │   │   └── page.tsx                 # (NEW: /api/inventory)
│   │   │   │
│   │   │   ├── odontogram/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── admin/
│   │   │   │   ├── users/
│   │   │   │   │   └── page.tsx             # (NEW: /api/users)
│   │   │   │   ├── billing/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── subscriptions/
│   │   │   │   │   └── page.tsx             # (NEW: /api/subscriptions)
│   │   │   │   └── reports/
│   │   │   │       └── page.tsx             # (NEW: /api/reports/*)
│   │   │   │
│   │   │   ├── backups/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   └── page.tsx                 # Perfil de usuario
│   │   │   │
│   │   │   └── layout.tsx                   # Dashboard layout (AppLayout)
│   │   │
│   │   ├── api/                             # ⭐ NUEVA: Backend API
│   │   │   ├── health/
│   │   │   │   └── route.ts                 # GET /api/health
│   │   │   │
│   │   │   ├── auth/                        # AUTENTICACIÓN
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts             # POST /api/auth/login
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts             # POST /api/auth/logout
│   │   │   │   ├── me/
│   │   │   │   │   └── route.ts             # GET /api/auth/me
│   │   │   │   └── refresh/
│   │   │   │       └── route.ts             # POST /api/auth/refresh
│   │   │   │
│   │   │   ├── clinics/                     # CLÍNICAS (admin)
│   │   │   │   ├── route.ts                 # GET /api/clinics, POST /api/clinics
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts             # GET /api/clinics/[id]
│   │   │   │       ├── update/
│   │   │   │       │   └── route.ts         # PUT /api/clinics/[id]/update
│   │   │   │       └── stats/
│   │   │   │           └── route.ts         # GET /api/clinics/[id]/stats
│   │   │   │
│   │   │   ├── users/                       # USUARIOS
│   │   │   │   ├── route.ts                 # GET /api/users, POST /api/users
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts             # GET/PUT /api/users/[id]
│   │   │   │       └── deactivate/
│   │   │   │           └── route.ts         # POST /api/users/[id]/deactivate
│   │   │   │
│   │   │   ├── patients/                    # PACIENTES
│   │   │   │   ├── route.ts                 # GET /api/patients, POST /api/patients
│   │   │   │   ├── search/
│   │   │   │   │   └── route.ts             # GET /api/patients/search?q=dni
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts             # GET/PUT /api/patients/[id]
│   │   │   │       ├── appointments/
│   │   │   │       │   └── route.ts         # GET /api/patients/[id]/appointments
│   │   │   │       ├── balance/
│   │   │   │       │   └── route.ts         # GET /api/patients/[id]/balance
│   │   │   │       └── medical-history/
│   │   │   │           └── route.ts         # GET /api/patients/[id]/medical-history
│   │   │   │
│   │   │   ├── appointments/                # CITAS
│   │   │   │   ├── route.ts                 # GET /api/appointments, POST /api/appointments
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts             # GET/PUT /api/appointments/[id]
│   │   │   │       └── complete/
│   │   │   │           └── route.ts         # POST /api/appointments/[id]/complete
│   │   │   │
│   │   │   ├── treatments/                  # TRATAMIENTOS
│   │   │   │   ├── route.ts                 # GET /api/treatments, POST /api/treatments
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts             # GET/PUT /api/treatments/[id]
│   │   │   │
│   │   │   ├── payments/                    # PAGOS
│   │   │   │   ├── route.ts                 # GET /api/payments, POST /api/payments
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts             # GET /api/payments/[id]
│   │   │   │   │   └── history/
│   │   │   │   │       └── route.ts         # GET /api/payments/[id]/history
│   │   │   │   └── statistics/
│   │   │   │       └── route.ts             # GET /api/payments/statistics
│   │   │   │
│   │   │   ├── radiographs/                 # RADIOGRAFÍAS
│   │   │   │   ├── route.ts                 # GET /api/radiographs, POST /api/radiographs
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts             # GET/DELETE /api/radiographs/[id]
│   │   │   │
│   │   │   ├── odontograms/                 # ODONTOGRAMAS
│   │   │   │   ├── route.ts                 # GET /api/odontograms, POST /api/odontograms
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts             # GET/PUT /api/odontograms/[id]
│   │   │   │
│   │   │   ├── consents/                    # CONSENTIMIENTOS
│   │   │   │   ├── route.ts                 # GET /api/consents, POST /api/consents
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts             # GET/PUT /api/consents/[id]
│   │   │   │
│   │   │   ├── inventory/                   # INVENTARIO
│   │   │   │   ├── route.ts                 # GET /api/inventory, POST /api/inventory
│   │   │   │   ├── low-stock/
│   │   │   │   │   └── route.ts             # GET /api/inventory/low-stock
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts             # GET/PUT /api/inventory/[id]
│   │   │   │
│   │   │   └── reports/                     # REPORTES
│   │   │       ├── revenue/
│   │   │       │   └── route.ts             # GET /api/reports/revenue
│   │   │       ├── appointments/
│   │   │       │   └── route.ts             # GET /api/reports/appointments
│   │   │       ├── patients/
│   │   │       │   └── route.ts             # GET /api/reports/patients
│   │   │       └── inventory/
│   │   │           └── route.ts             # GET /api/reports/inventory
│   │   │
│   │   ├── globals.css                      # Estilos globales
│   │   └── layout.tsx                       # Root layout
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx                # Layout principal
│   │   │   ├── Navbar.tsx                   # ⭐ NEW: Navbar con logout
│   │   │   ├── Sidebar.tsx                  # ⭐ NEW: Sidebar menus
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── ui/
│   │   │   ├── accordion.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── spinner.tsx                  # ⭐ NEW: Loading indicator
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (resto de componentes Radix UI)
│   │   │
│   │   ├── forms/                           # ⭐ NEW: Formularios reutilizables
│   │   │   ├── PatientForm.tsx
│   │   │   ├── AppointmentForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   ├── TreatmentForm.tsx
│   │   │   └── UserForm.tsx
│   │   │
│   │   └── pages/                           # ⭐ NEW: Componentes de páginas
│   │       ├── PatientCard.tsx
│   │       ├── AppointmentCard.tsx
│   │       └── PaymentTable.tsx
│   │
│   ├── hooks/
│   │   ├── use-auth.tsx                     # 🔄 REFACTORIZADO: Usa API ahora
│   │   ├── use-api.ts                       # ⭐ NEW: Hook genérico para fetch
│   │   ├── use-patient.ts                   # ⭐ NEW: Lógica de pacientes
│   │   ├── use-appointment.ts               # ⭐ NEW: Lógica de citas
│   │   ├── use-payment.ts                   # ⭐ NEW: Lógica de pagos
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── services/                            # ⭐ NEW: Lógica de negocio
│   │   ├── auth.service.ts                  # Login, logout, JWT
│   │   ├── patient.service.ts               # CRUD pacientes
│   │   ├── appointment.service.ts           # CRUD citas
│   │   ├── payment.service.ts               # Pagos, transacciones
│   │   ├── treatment.service.ts             # CRUD tratamientos
│   │   ├── clinic.service.ts                # CRUD clínicas
│   │   ├── user.service.ts                  # CRUD usuarios
│   │   ├── radiograph.service.ts            # CRUD radiografías
│   │   ├── odontogram.service.ts            # CRUD odontogramas
│   │   └── consent.service.ts               # CRUD consentimientos
│   │
│   ├── lib/
│   │   ├── db.ts                            # 🔄 REFACTORIZADO: Tipos/interfaces solo
│   │   ├── prisma.ts                        # ⭐ NEW: Cliente Prisma singleton
│   │   ├── api-client.ts                    # ⭐ NEW: Cliente HTTP centralizado
│   │   ├── jwt.ts                           # ⭐ NEW: Funciones JWT
│   │   ├── hash.ts                          # ⭐ NEW: Hash de passwords (bcrypt)
│   │   ├── validators.ts                    # ⭐ NEW: Esquemas Zod validación
│   │   ├── rate-limit.ts                    # ⭐ NEW: Rate limiting
│   │   ├── error-handler.ts                 # ⭐ NEW: Manejo de errores uniforme
│   │   ├── logger.ts                        # ⭐ NEW: Sistema de logs
│   │   ├── utils.ts                         # Utilidades generales
│   │   ├── placeholder-images.json
│   │   ├── placeholder-images.ts
│   │   └── constants.ts                     # ⭐ NEW: Constantes (roles, estados)
│   │
│   ├── types/                               # ⭐ NEW: Tipos TypeScript centralizados
│   │   ├── clinic.types.ts
│   │   ├── patient.types.ts
│   │   ├── appointment.types.ts
│   │   ├── payment.types.ts
│   │   ├── user.types.ts
│   │   ├── api.types.ts                     # Tipos de API responses
│   │   └── index.ts                         # Exportar todo
│   │
│   ├── middleware.ts                        # ⭐ NEW: Middleware de autenticación
│   │
│   └── ai/
│       ├── dev.ts
│       └── genkit.ts
│
├── prisma/                                  # ⭐ NEW: Base de datos
│   ├── schema.prisma                        # Definición del schema MySQL
│   ├── seed.ts                              # ⭐ NEW: Datos iniciales
│   └── migrations/
│       ├── migration_lock.toml
│       └── [timestamp]_init/
│           └── migration.sql                # Migraciones versionadas
│
├── scripts/                                 # ⭐ NEW: Scripts de utilidad
│   ├── seed.ts                              # Poblar BD con datos iniciales
│   ├── migrate.ts                           # Ejecutar migraciones
│   └── etl-import-backup.ts                 # Importar datos históricos
│
├── docs/
│   ├── ANALISIS-ARQUITECTURA-MULTITENANT-MYSQL.md  # ⭐ (Este archivo)
│   ├── RESUMEN-EJECUTIVO.md                        # ⭐ Resumen ejecutivo
│   ├── QUICK-START-30MIN.md                        # ⭐ Quick start
│   ├── ESTRUCTURA-CARPETAS-FINAL.md                # ⭐ (Este archivo)
│   ├── API-ENDPOINTS.md                            # ⭐ NEW: Documentación de endpoints
│   ├── DATABASE-SCHEMA.md                          # ⭐ NEW: Esquema detallado
│   ├── MULTITENANT-SECURITY.md                     # ⭐ NEW: Estrategia de seguridad
│   ├── SMOKE-TESTS.md                              # ⭐ NEW: Pruebas manuales
│   ├── ROLLBACK-PLAN.md                            # ⭐ NEW: Plan de rollback
│   ├── blueprint.md
│   └── plan-refactor-postgres-ia.md
│
├── .env.local                               # ⭐ NEW: Variables de entorno (LOCAL)
├── .env.example                             # ⭐ NEW: Ejemplo de variables
├── .env.production                          # ⭐ NEW: Variables producción (CI/CD)
│
├── .gitignore                               # Actualizar para ignorar .env.local
├── package.json                             # Actualizar scripts
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── components.json
│
└── README.md                                # 🔄 Actualizar con nueva arquitectura
```

---

## 📊 Resumen de Cambios

### ✅ NUEVAS CARPETAS
- `src/app/api/` - Todos los endpoints backend
- `src/services/` - Lógica de negocio reutilizable
- `src/types/` - Tipos TypeScript centralizados
- `src/lib/prisma.ts`, `jwt.ts`, etc. - Utilidades servidor
- `prisma/` - ORM Prisma con schema
- `scripts/` - Utilidades (seed, ETL)
- `docs/API-ENDPOINTS.md` - Documentación API

### 🔄 REFACTORIZADOS
- `src/lib/db.ts` - De IndexedDB a tipos/interfaces
- Todas las páginas (page.tsx) - Consumen API, no IndexedDB
- `src/hooks/use-auth.tsx` - Ahora consume `/api/auth/login`
- `package.json` - Nuevos scripts npm

### ❌ ELIMINADAS (después de Fase 7)
- Dependencia de IndexedDB
- Lógica de negocio en componentes (movidaa services)
- Queries directas desde UI (ahora via API)

---

## 🎯 Estadísticas Finales

| Métrica | Antes | Después |
|---------|-------|---------|
| Líneas de código backend API | 0 | ~3000 |
| Endpoints REST | 0 | ~50 |
| Tablas BD | 0 | 13 |
| Servicios reutilizables | 0 | 8 |
| Tests posibles | No | Sí (E2E) |
| Seguridad | Baja ⚠️ | Alta ✅ |

---

**Documento actualizado:** 24 de marzo de 2026  
**Uso:** Referencia visual durante implementación
