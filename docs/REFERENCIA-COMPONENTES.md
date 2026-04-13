# 📋 REFERENCIA DE COMPONENTES Y UTILIDADES

## 🧩 Componentes UI Radix + shadcn

Esta sección documenta cómo usar cada componente de la UI library.

---

## 📝 COMPONENTES DE FORMULARIO

### Input

```tsx
import { Input } from "@/components/ui/input";

export function MyForm() {
  const [value, setValue] = useState("");

  return (
    <Input
      type="email"
      placeholder="tu@email.com"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      disabled={isLoading}
      className="border-red-200 focus:ring-red-500" // Tailwind
    />
  );
}
```

**Props disponibles:**
- `type`: text, email, password, number, tel, url, etc
- `placeholder`: Texto de ayuda
- `value`, `onChange`: Control de valor
- `disabled`: Deshabilitar
- `className`: Estilos Tailwind
- `autoFocus`, `required`, `maxLength`

---

### Textarea

```tsx
import { Textarea } from "@/components/ui/textarea";

export function ObservationsForm() {
  return (
    <Textarea
      placeholder="Notas del doctor..."
      rows={5}
      className="resize-none"
    />
  );
}
```

---

### Label

```tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function FormField() {
  return (
    <div className="space-y-2">
      <Label htmlFor="dni">Documento de Identidad</Label>
      <Input id="dni" type="text" />
    </div>
  );
}
```

---

### Select

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function RoleSelect() {
  const [role, setRole] = useState("doctor");

  return (
    <div>
      <Label htmlFor="role">Rol</Label>
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger id="role">
          <SelectValue /> {/* Muestra valor seleccionado */}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Administrador</SelectItem>
          <SelectItem value="doctor">Doctor</SelectItem>
          <SelectItem value="assistant">Asistente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

---

### Checkbox

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function AllergiesCheckbox() {
  const [allergic, setAllergic] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="allergic"
        checked={allergic}
        onCheckedChange={setAllergic}
      />
      <Label htmlFor="allergic" className="cursor-pointer">
        Alérgico a medicamentos
      </Label>
    </div>
  );
}
```

---

### Radio Group

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function GenderSelect() {
  const [gender, setGender] = useState("male");

  return (
    <RadioGroup value={gender} onValueChange={setGender}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="male" id="male" />
        <Label htmlFor="male">Masculino</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="female" id="female" />
        <Label htmlFor="female">Femenino</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="other" id="other" />
        <Label htmlFor="other">Otro</Label>
      </div>
    </RadioGroup>
  );
}
```

---

### Switch (Toggle)

```tsx
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ActiveToggle() {
  const [active, setActive] = useState(true);

  return (
    <div className="flex items-center gap-2">
      <Switch checked={active} onCheckedChange={setActive} />
      <Label>Estado: {active ? "Activo" : "Inactivo"}</Label>
    </div>
  );
}
```

---

### Calendar / Date Picker

```tsx
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export function DatePickerDemo() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CalendarIcon className="h-4 w-4" />
          {date ? format(date, 'dd/MM/yyyy') : 'Seleccionar fecha'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(date) => date > new Date()} // Deshabilitar fechas futuras
        />
      </PopoverContent>
    </Popover>
  );
}
```

---

### Slider

```tsx
import { Slider } from "@/components/ui/slider";

export function DiscountSlider() {
  const [value, setValue] = useState([0]);

  return (
    <div className="space-y-2">
      <label>Descuento: {value[0]}%</label>
      <Slider
        value={value}
        onValueChange={setValue}
        min={0}
        max={50}
        step={1}
      />
    </div>
  );
}
```

---

## 🎯 COMPONENTES DE NAVEGACIÓN

### Dialog (Modal)

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreatePatientDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nuevo Paciente</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Paciente</DialogTitle>
          <DialogDescription>
            Completa los datos del nuevo paciente
          </DialogDescription>
        </DialogHeader>
        
        <Input
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => { /* Guardar */ setOpen(false); }}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

### Alert Dialog (Confirmación)

```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DeletePatientButton({ patientId }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">Eliminar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no puede deshacer y eliminará permanentemente el registro.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-4">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deletePatient(patientId)}
            className="bg-red-600 hover:bg-red-700"
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

### Dropdown Menu

```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash } from "lucide-react";

export function PatientActions({ patient }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => editPatient(patient.id)}>
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => viewHistory(patient.id)}>
          Historial
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => deletePatient(patient.id)}
          className="text-red-600"
        >
          <Trash className="w-4 h-4 mr-2" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

### Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PatientTabs({ patient }) {
  return (
    <Tabs defaultValue="info">
      <TabsList>
        <TabsTrigger value="info">Información</TabsTrigger>
        <TabsTrigger value="appointments">Citas</TabsTrigger>
        <TabsTrigger value="payments">Pagos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="info">
        <CardContent>
          <p>Nombre: {patient.full_name}</p>
          <p>DNI: {patient.dni}</p>
          <p>Teléfono: {patient.phone}</p>
        </CardContent>
      </TabsContent>
      
      <TabsContent value="appointments">
        <AppointmentsList appointments={patient.appointments} />
      </TabsContent>
      
      <TabsContent value="payments">
        <PaymentsList payments={patient.payments} />
      </TabsContent>
    </Tabs>
  );
}
```

---

## 📊 COMPONENTES DE DATOS

### Table

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function PatientsTable({ patients }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>DNI</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell className="font-mono">{patient.dni}</TableCell>
            <TableCell className="font-medium">{patient.full_name}</TableCell>
            <TableCell>{patient.phone}</TableCell>
            <TableCell>
              <Badge>{patient.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <PatientActions patient={patient} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

### Card

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function StatCard({ title, value, description }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );
}

// Uso:
export function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Pacientes" value="248" description="datos 25 Mar" />
      <StatCard title="Citas Hoy" value="12" description="agenda de hoy" />
      <StatCard title="Ingresos" value="$2,450" description="mes actual" />
      <StatCard title="Balance Pendiente" value="$890" description="por cobrar" />
    </div>
  );
}
```

---

### Badge

```tsx
import { Badge } from "@/components/ui/badge";

export function StatusBadges() {
  return (
    <div className="space-y-2">
      {/* Diferentes variantes */}
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  );
}
```

---

### Progress

```tsx
import { Progress } from "@/components/ui/progress";

export function InventoryAlert({ item }) {
  const percentage = (item.quantity / item.min_quantity) * 100;
  
  return (
    <div className="space-y-2">
      <p>{item.name}: {item.quantity} unidades</p>
      <Progress value={percentage} className={percentage < 50 ? "bg-red-200" : ""} />
    </div>
  );
}
```

---

### Accordion

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function MedicalHistoryAccordion({ patient }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="allergies">
        <AccordionTrigger>Alergias</AccordionTrigger>
        <AccordionContent>
          {patient.allergic_to_meds ? (
            <p>⚠️ Alérgico: {patient.allergies_detail}</p>
          ) : (
            <p>✅ Sin alergias registradas</p>
          )}
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="conditions">
        <AccordionTrigger>Condiciones Médicas</AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1">
            {patient.diabetic && <li>• Diabético</li>}
            {patient.hypertensive && <li>• Hipertenso</li>}
            {patient.pregnant && <li>• Embarazada</li>}
            {patient.prone_to_bleeding && <li>• Propenso a sangrado</li>}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

---

## 🔔 COMPONENTES DE FEEDBACK

### Toast

```tsx
import { useToast } from "@/hooks/use-toast";

export function ToastExample() {
  const { toast } = useToast();

  return (
    <div className="space-y-2">
      <button
        onClick={() => toast({
          title: "Éxito",
          description: "Paciente creado correctamente",
          variant: "default"
        })}
      >
        Success Toast
      </button>

      <button
        onClick={() => toast({
          title: "Error",
          description: "No se pudo guardar el registro",
          variant: "destructive"
        })}
      >
        Error Toast
      </button>
    </div>
  );
}
```

---

### Alert

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, InfoIcon } from "lucide-react";

export function Alerts() {
  return (
    <div className="space-y-4">
      {/* Info */}
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Información</AlertTitle>
        <AlertDescription>
          Solo doctores pueden crear citas
        </AlertDescription>
      </Alert>

      {/* Error */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          La clínica está suspendida
        </AlertDescription>
      </Alert>

      {/* Success */}
      <Alert className="border-green-500 bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle>Éxito</AlertTitle>
        <AlertDescription>
          Pago registrado correctamente
        </AlertDescription>
      </Alert>
    </div>
  );
}
```

---

## 🎨 COMPONENTES DE VISUALIZACIÓN

### Chart (Recharts)

```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function RevenueChart() {
  const data = [
    { month: 'Ene', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5200 },
    { month: 'Abr', revenue: 4700 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="revenue" fill="#008080" />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

---

## 🛠️ FUNCIONES UTILITARIAS

### `lib/utils.ts`

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Combinar clases Tailwind inteligentemente
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Ejemplo:
export function Button({ className, ...props }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md",
        "bg-blue-500 hover:bg-blue-600",
        "text-white font-medium",
        className // Permite override
      )}
      {...props}
    />
  )
}
```

### `lib/validators.ts`

```typescript
import { z } from 'zod';

// Schemas reutilizables
export const dniSchema = z.string()
  .min(8, "DNI debe tener al menos 8 dígitos")
  .max(20, "DNI muy largo")
  .regex(/^[0-9]+$/, "DNI solo debe contener números");

export const emailSchema = z.string()
  .email("Email inválido");

export const phoneSchema = z.string()
  .regex(/^\+?[0-9]{7,15}$/, "Teléfono inválido");

// Schemas para modelos
export const createPatientSchema = z.object({
  dni: dniSchema,
  full_name: z.string().min(3).max(100),
  phone: phoneSchema,
  address: z.string().min(5),
  email: emailSchema.optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  birth_date: z.date().optional(),
  allergic_to_meds: z.boolean().default(false),
  diabetic: z.boolean().default(false),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
```

### `lib/api-response.ts`

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, any>;
}

export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

export function errorResponse(
  error: string,
  details?: Record<string, any>
): ApiResponse<null> {
  return {
    success: false,
    error,
    details,
  };
}

// En API routes:
export async function POST(req: NextRequest) {
  try {
    // ... lógica
    return Response.json(successResponse(result), { status: 201 });
  } catch (error) {
    return Response.json(
      errorResponse("Error al crear", { cause: error.message }),
      { status: 400 }
    );
  }
}
```

---

## 🔐 VALIDACIÓN Y SEGURIDAD

### Hash de Contraseñas

```typescript
import bcryptjs from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(plain, hash);
}

// En auth service:
async function register(email: string, password: string) {
  const hash = await hashPassword(password);
  return prisma.user.create({
    data: {
      email,
      password_hash: hash, // ✅ Nunca guardar plain
    }
  });
}
```

### JWT

```typescript
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function createToken(user: User, expiresIn = '24h'): Promise<string> {
  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
    clinic_id: user.clinic_id,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(SECRET);

  return token;
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, SECRET);
    return verified.payload;
  } catch (err) {
    return null;
  }
}

// Middleware de auth
export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest, payload: any) => Promise<Response>
) {
  const token = req.cookies.get('Authorization')?.value;
  
  if (!token) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return Response.json(
      { success: false, error: 'Invalid token' },
      { status: 401 }
    );
  }

  return handler(req, payload);
}

// Uso en API routes:
export async function GET(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    // user.sub, user.email, user.role disponibles
    return Response.json(successResponse({ authenticated: true }));
  });
}
```

---

## 🎯 EJEMPLOS COMPLETOS

### Ejemplo 1: Crear Paciente Completo

```typescript
// src/services/patient.service.ts
import { prisma } from '@/lib/prisma';
import { createPatientSchema } from '@/lib/validators';

export async function createPatient(
  clinic_id: string,
  data: unknown
) {
  // Validar datos
  const validated = createPatientSchema.parse(data);

  // Verificar DNI no existe
  const existing = await prisma.patient.findFirst({
    where: {
      clinic_id,
      dni: validated.dni,
    }
  });

  if (existing) {
    throw new Error('Paciente con este DNI ya existe');
  }

  // Crear paciente
  return prisma.patient.create({
    data: {
      clinic_id,
      ...validated,
    }
  });
}

// src/app/api/patients/route.ts
import { NextRequest } from 'next/server';
import { createPatient } from '@/services/patient.service';
import { successResponse, errorResponse } from '@/lib/api-response';
import { withAuth } from '@/lib/middleware';

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      const body = await req.json();
      
      const patient = await createPatient(user.clinic_id, body);
      
      return Response.json(
        successResponse(patient),
        { status: 201 }
      );
    } catch (error) {
      return Response.json(
        errorResponse(error.message),
        { status: 400 }
      );
    }
  });
}

// src/app/patients/page.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@/hooks/use-mutation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreatePatientForm() {
  const { toast } = useToast();
  const { mutate, isLoading } = useMutation('POST', '/api/patients');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    dni: '',
    full_name: '',
    phone: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutate(form);
      toast({ title: 'Éxito', description: 'Paciente creado' });
      setOpen(false);
      setForm({ dni: '', full_name: '', phone: '', address: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nuevo Paciente</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>DNI</Label>
            <Input
              value={form.dni}
              onChange={(e) => setForm({ ...form, dni: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Nombre Completo</Label>
            <Input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Dirección</Label>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Crear Paciente'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

Esta referencia cubre la mayoría de patrones usados en el proyecto.
Actualizar según nuevas necesidades.
