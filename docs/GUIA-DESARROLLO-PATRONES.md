# 🎯 GUÍA DE DESARROLLO Y PATRONES COMUNES

## Estructura de Carpetas Completa

```
KuskoDentoV.2/
│
├── 📦 node_modules/              # Dependencias (gitignored)
│
├── 🎨 public/                     # Assets estáticos
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── 🔧 prisma/                     # Schema y migraciones
│   ├── schema.prisma              # ⭐ Definición de modelos
│   ├── migrations/
│   │   ├── migration_lock.toml
│   │   └── [timestamp]_[name]/
│   │       └── migration.sql
│   └── seed.ts                    # Seed de datos
│
├── 🔨 scripts/                    # Scripts de utilidad
│   ├── backup.sh                  # Backup de BD
│   ├── backup.ps1                 # Backup (PowerShell)
│   ├── seed-phase1.js             # Datos iniciales
│   ├── etl-import-backup.ts       # Importar backups
│   ├── smoke-tests.ts             # Tests básicos
│   └── test-phase1-api.js         # Tests API
│
├── 📚 docs/                       # Documentación
│   ├── DOCUMENTACION-COMPLETA.md  # ⭐ ESTE ARCHIVO
│   ├── REFERENCIA-COMPONENTES.md  # ⭐ Componentes
│   ├── INDEX.md                   # Índice general
│   ├── RESUMEN-EJECUTIVO.md       # Overview
│   ├── QUICK-START-30MIN.md       # Setup rápido
│   ├── ARQUITECTURA-MULTITENANT.md # Arch detallada
│   ├── API-REFERENCE.md           # API docs
│   └── ... (más docs)
│
├── 💻 src/                        # CÓDIGO PRINCIPAL ⭐
│
│   ├── 🤖 ai/                     # AI/ML Integration (Genkit)
│   │   ├── dev.ts                 # Dev server
│   │   └── genkit.ts              # Genkit config
│   │
│   ├── 🎨 app/                    # Next.js App Router
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home (login)
│   │   ├── globals.css            # Estilos globales
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Dashboard principal
│   │   │
│   │   ├── patients/
│   │   │   ├── page.tsx           # Listar pacientes
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Detalle de paciente
│   │   │
│   │   ├── appointments/
│   │   │   ├── page.tsx           # Citas
│   │   │   └── [id]/
│   │   │
│   │   ├── treatments/
│   │   │   └── page.tsx           # Tratamientos
│   │   │
│   │   ├── payments/
│   │   │   └── page.tsx           # Pagos
│   │   │
│   │   ├── radiographs/
│   │   │   └── page.tsx           # Radiografías
│   │   │
│   │   ├── odontogram/
│   │   │   └── page.tsx           # Odontograma
│   │   │
│   │   ├── consents/
│   │   │   └── page.tsx           # Consentimientos
│   │   │
│   │   ├── inventory/
│   │   │   └── page.tsx           # Inventario
│   │   │
│   │   ├── backups/
│   │   │   └── page.tsx           # Respaldos
│   │   │
│   │   ├── profile/
│   │   │   └── page.tsx           # Perfil usuario
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx           # Login page
│   │   │
│   │   ├── admin/                 # Sección Admin
│   │   │   ├── users/
│   │   │   │   └── page.tsx       # Gestión usuarios
│   │   │   ├── billing/
│   │   │   │   └── page.tsx       # Facturación
│   │   │   ├── reports/
│   │   │   │   └── page.tsx       # Reportes
│   │   │   └── subscriptions/
│   │   │       └── page.tsx       # Suscripciones
│   │   │
│   │   └── 🔌 api/                # API Routes (Backend)
│   │       ├── auth/
│   │       │   ├── login/
│   │       │   │   └── route.ts
│   │       │   ├── logout/
│   │       │   │   └── route.ts
│   │       │   ├── me/
│   │       │   │   └── route.ts
│   │       │   └── refresh/
│   │       │       └── route.ts
│   │       │
│   │       ├── appointments/
│   │       │   ├── route.ts       # GET/POST
│   │       │   └── [id]/
│   │       │       └── route.ts   # GET/PUT/DELETE
│   │       │
│   │       ├── patients/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       │
│   │       ├── payments/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       │
│   │       ├── treatments/
│   │       │   └── route.ts
│   │       │
│   │       └── health/
│   │           └── route.ts       # Health check
│   │
│   ├── 🧩 components/             # Componentes React
│   │   ├── layout/
│   │   │   └── AppLayout.tsx      # Layout principal
│   │   │
│   │   └── ui/                    # Componentes Radix+shadcn
│   │       ├── accordion.tsx
│   │       ├── alert.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       └── tooltip.tsx
│   │
│   ├── 🪝 hooks/                  # Custom React Hooks
│   │   ├── use-api.ts             # Fetch datos
│   │   ├── use-auth.tsx           # Contexto auth
│   │   ├── use-mobile.tsx         # Detectar mobile
│   │   ├── use-mutation.ts        # POST/PUT/DELETE
│   │   └── use-toast.ts           # Notificaciones
│   │
│   ├── 🔧 lib/                    # Utilidades
│   │   ├── api-response.ts        # Respuesta API estandarizada
│   │   ├── db.ts                  # ⚠️ DEPRECATED
│   │   ├── hash.ts                # Hashing pwd
│   │   ├── jwt.ts                 # JWT generation/verify
│   │   ├── prisma.ts              # Prisma client
│   │   ├── rate-limit.ts          # Rate limiting
│   │   ├── request-context.ts     # Context de request
│   │   ├── utils.ts               # Funciones auxiliares
│   │   ├── validators.ts          # ⭐ Schemas Zod
│   │   ├── placeholder-images.ts  # Imágenes de demo
│   │   └── placeholder-images.json
│   │
│   └── 🎯 services/               # Business Logic ⭐
│       ├── appointment.service.ts # Lógica citas
│       ├── auth.service.ts        # Lógica autenticación
│       ├── clinic.service.ts      # Lógica clínicas
│       ├── patient.service.ts     # Lógica pacientes
│       ├── payment.service.ts     # Lógica pagos
│       └── treatment.service.ts   # Lógica tratamientos
│
├── ⚙️ Config files
│   ├── package.json               # Dependencias + scripts
│   ├── next.config.ts             # Configuración Next.js
│   ├── tsconfig.json              # Configuración TypeScript
│   ├── tailwind.config.ts         # Configuración Tailwind
│   ├── postcss.config.mjs         # PostCSS config
│   ├── prisma.config.ts           # ⚠️ NO ESTÁNDAR
│   ├── middleware.ts              # Middleware global (auth)
│   ├── next-env.d.ts              # Tipos Next.js auto
│   ├── .env.local                 # Variables de entorno (gitignored)
│   ├── .gitignore
│   └── README.md
│
└── 📄 Archivos raíz
    ├── apphosting.yaml            # Config Google App Hosting
    ├── backup-example.json        # Ejemplo de backup
    ├── components.json            # Config componentes
    ├── etl-report-*.json          # Reportes ETL
    └── ... (logs, etc)
```

---

## 📝 Crear Nueva Página/Feature

### Paso 1: Crear Página

Archivo: `src/app/[feature]/page.tsx`

```typescript
'use client';

import { useAuth } from '@/hooks/use-auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApi } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function FeaturePage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useApi('/api/[resource]');

  if (isLoading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Feature Name</h1>
        {/* Contenido */}
      </div>
    </AppLayout>
  );
}
```

### Paso 2: Crear API Route

Archivos:
- `src/app/api/[resource]/route.ts` (GET/POST)
- `src/app/api/[resource]/[id]/route.ts` (GET/PUT/DELETE)

```typescript
// src/app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { withAuth } from '@/lib/middleware';

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      // Lógica GET
      return NextResponse.json(successResponse(data));
    } catch (error) {
      return NextResponse.json(
        errorResponse(error.message),
        { status: 500 }
      );
    }
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      const body = await req.json();
      // Lógica POST
      return NextResponse.json(successResponse(result), { status: 201 });
    } catch (error) {
      return NextResponse.json(
        errorResponse(error.message),
        { status: 400 }
      );
    }
  });
}
```

### Paso 3: Crear Service (si hay lógica compleja)

Archivo: `src/services/[resource].service.ts`

```typescript
import { prisma } from '@/lib/prisma';

export async function getResourcesByClinic(clinic_id: string) {
  return prisma.[resource].findMany({
    where: { clinic_id },
    orderBy: { created_at: 'desc' }
  });
}

export async function createResource(
  clinic_id: string,
  data: any
) {
  return prisma.[resource].create({
    data: {
      clinic_id,
      ...data
    }
  });
}
```

### Paso 4: Crear Validadores (Zod)

Archivo: `src/lib/validators.ts` (actualizar)

```typescript
import { z } from 'zod';

export const createResourceSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().optional(),
  // ... otros campos
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
```

### Paso 5: Crear Componente (si es reutilizable)

Archivo: `src/components/[feature]/ResourceCard.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ResourceCard({ resource }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{resource.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{resource.description}</p>
      </CardContent>
    </Card>
  );
}
```

---

## 🔄 Patrones Comunes de Desarrollo

### Patrón 1: Listar con Búsqueda y Paginación

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/use-api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ResourceList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  
  const { data, isLoading } = useApi(
    '/api/resources',
    { search, page, limit: 20 }
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* Tabla/Grid */}
      {isLoading ? <Spinner /> : (
        <table>
          {/* Render */}
        </table>
      )}

      {/* Pagination */}
      <div className="flex gap-2">
        <Button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          <ChevronLeft /> Anterior
        </Button>
        <span>Página {page} de {data?.totalPages}</span>
        <Button
          disabled={page === data?.totalPages}
          onClick={() => setPage(page + 1)}
        >
          Siguiente <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
```

---

### Patrón 2: Crear/Editar con Modal

```typescript
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMutation } from '@/hooks/use-mutation';
import { useToast } from '@/hooks/use-toast';

export function ResourceForm({ resource, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(resource || {});
  const { mutate, isLoading } = useMutation(
    resource ? 'PUT' : 'POST',
    resource ? `/api/resources/${resource.id}` : '/api/resources'
  );
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutate(form);
      toast({ title: '✓ Éxito' });
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast({ title: '✗ Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{resource ? 'Editar' : 'Nuevo'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{resource ? 'Editar' : 'Crear'} Recurso</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos formulario */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

### Patrón 3: Eliminar con Confirmación

```typescript
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useMutation } from '@/hooks/use-mutation';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

export function DeleteButton({ id, onSuccess }) {
  const { mutate, isLoading } = useMutation('DELETE', `/api/resources/${id}`);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await mutate({});
      toast({ title: 'Eliminado' });
      onSuccess?.();
    } catch (error) {
      toast({ title: error.message, variant: 'destructive' });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no puede deshacerse.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-4">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600"
          >
            Eliminar
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

---

### Patrón 4: Form con React Hook Form

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createResourceSchema, type CreateResourceInput } from '@/lib/validators';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ResourceFormRHF() {
  const form = useForm<CreateResourceInput>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: {
      name: '',
      description: '',
    }
  });

  const onSubmit = async (data: CreateResourceInput) => {
    // Enviar
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del recurso" {...field} />
              </FormControl>
              <FormMessage /> {/* Errores automáticos */}
            </FormItem>
          )}
        />
        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  );
}
```

---

## 🔐 Autenticación y Control de Acceso

### Verificar Rol en Componente

```typescript
'use client';

import { useAuth } from '@/hooks/use-auth';
import { redirect } from 'next/navigation';

export function AdminOnlyPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Spinner />;

  if (user?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <AppLayout>
      {/* Contenido admin */}
    </AppLayout>
  );
}
```

### Proteger API Route

```typescript
// src/app/api/admin/route.ts
import { withAuth } from '@/lib/middleware';

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    // Verificar rol
    if (user.role !== 'admin') {
      return Response.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Lógica admin
  });
}
```

---

## 📊 Trabajar con Gráficos

```typescript
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Enero', revenue: 4000, patients: 24 },
  { month: 'Febrero', revenue: 3000, patients: 12 },
  { month: 'Marzo', revenue: 5200, patients: 35 },
];

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="revenue" fill="#008080" />
        <Bar dataKey="patients" fill="#00B294" />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

---

## 🐛 Debugging

### Logging Útil

```typescript
// En servicios/API routes:
console.log('🔍 DEBUG:', { clinic_id, user_id, data });
console.error('❌ ERROR:', error.message, error.stack);

// En componentes:
useEffect(() => {
  console.log('📊 Data actualizado:', data);
}, [data]);
```

### Ver DB en tiempo real

```bash
# Abrir Prisma Studio
npx prisma studio

# Se abrirá http://localhost:5555 con interfaz gráfica
```

### Inspeccionar Requests

```bash
# En browser DevTools > Network
# Ver request/response de cada API call
```

---

## ✅ Testing

### Smoke Tests

```bash
# Ejecutar tests básicos
npm run test:smoke
```

Archivo: `scripts/smoke-tests.ts`
```typescript
async function testHealthCheck() {
  const res = await fetch('http://localhost:3000/api/health');
  const ok = res.ok;
  console.log(`✓ Health Check: ${ok}`);
}

async function testPatientCreation() {
  const res = await fetch('http://localhost:3000/api/patients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clinic_id: 'clinic_test',
      dni: '12345678',
      full_name: 'Test Patient',
      phone: '+51987654321',
      address: 'Test Address'
    })
  });
  const ok = res.ok;
  console.log(`✓ Patient Creation: ${ok}`);
}
```

---

## 🚀 Performance

### Optimización de Imágenes

```typescript
import Image from 'next/image';

// ✅ BIEN - Next.js optimiza
<Image
  src="/radiograph.jpg"
  alt="Radiografía"
  width={800}
  height={600}
  priority // Cargar eager
  placeholder="blur" // Blur mientras carga
/>

// ❌ MAL
<img src="/radiograph.jpg" alt="Radiografía" />
```

### Lazy Loading

```typescript
import dynamic from 'next/dynamic';

// Cargará solo cuando sea necesario
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton />
});
```

### Memoization

```typescript
import { memo } from 'react';

// Evitar re-renders innecesarios
const PatientCard = memo(function PatientCard({ patient }) {
  return <div>{patient.name}</div>;
}, (prev, next) => prev.patient.id === next.patient.id);
```

---

## 📦 Desplegar Cambios

### Workflow Git

```bash
# 1. Crear rama
git checkout -b feature/new-feature

# 2. Hacer cambios y commit
git add .
git commit -m "feat: nueva funcionalidad"

# 3. Push a GitHub
git push origin feature/new-feature

# 4. Crear Pull Request en GitHub
# 5. Review y merge a main
# 6. Vercel auto-deploys

# En local, actualizar:
git checkout main
git pull origin main
```

### Build Local

```bash
# Probar build
npm run build

# Si hay errores:
npm run typecheck  # Ver errores TypeScript
npm run lint       # Ver warnings

# Corregir y reintentar
npm run build
```

---

Esta guía complementa la documentación. Actualizar según nuevos patrones descubiertos.
