/**
 * ❌ DEPRECATED: Este archivo es LEGACY y no debería usarse.
 * 
 * Las páginas en src/app/admin/ todavía lo importan pero DEBERÍAN:
 * 1. Usar la API en src/app/api/ en lugar de acceder a IndexedDB
 * 2. Usar los custom hooks: useApi() y useMutation() desde src/hooks/
 * 3. Eliminar imports de este archivo
 * 
 * @deprecated
 */

"use client";

// Tipos stub para compatibilidad con páginas admin legacy
// TODO: Remigrar estas páginas para usar API REST

export type UserRole = 'admin' | 'clinic' | 'doctor' | 'assistant' | 'technician';

export interface User {
  id: string;
  username?: string;
  password?: string;
  role: UserRole;
  fullName?: string;
  dni?: string;
  clinicId?: string;
  email?: string;
  status?: 'active' | 'inactive';
  subscriptionFee?: number;
  subscriptionStatus: 'active' | 'suspended' | 'blocked';
  nextPaymentDate?: string;
  contractStartDate?: string;
  paymentFrequency?: 'monthly' | 'yearly';
  registeredByAdminId?: string;
  primaryColor?: string;
  brandName?: string;
  slogan?: string;
  theme?: 'light' | 'dark' | 'system';
  lastLogin?: string;
  address?: string;
  colegiatura?: string;
  photo?: string;
}

export interface Patient {
  id: string;
  dni: string;
  names: string;
  lastNames: string;
  email?: string;
  phone: string;
  address: string;
  clinicId?: string;
  registrationDate?: string;
  attendedBy?: string;
  underTreatment?: boolean;
  proneToBleeding?: boolean;
  allergicToMeds?: boolean;
  consultationReason?: string;
  diagnostic?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  treatmentId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'Asignado' | 'Atendido';
  cost: number;
  clinicId?: string;
  observations?: string;
}

export interface Payment {
  id: string;
  patientId: string;
  appointmentId: string;
  treatmentName: string;
  totalPaid: number;
  balance: number;
  date: string;
  totalCost: number;
  history?: Array<{
    amount: number;
    date: string;
    method?: string;
  }>;
}

export interface SubscriptionPayment {
  id: string;
  clinicId?: string;
  clinicName?: string;
  amount: number;
  date: string;
  status?: 'pending' | 'paid';
  concept?: string;
  processedByAdminId?: string;
}

export interface Consent {
  id: string;
  patientId: string;
  type: string;
  date: string;
  fileBlob: Blob;
  fileType: string;
  fileName: string;
}

export interface Treatment {
  id: string;
  name: string;
  price: number;
  clinicId?: string;
}

export interface Radiograph {
  id: string;
  patientId: string;
  appointmentId?: string;
  fileUrl: string;
  type?: string;
  clinicId?: string;
  date: string;
  fileBlob: Blob;
  fileType: string;
  fileName: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit_cost?: number;
  minQuantity: number;
  clinicId?: string;
  category: string;
  unit: string;
  lastUpdated: string;
}

export interface Odontogram {
  id: string;
  patientId: string;
  appointmentId?: string;
  data_json?: unknown;
  clinicId?: string;
  date: string;
  data: Record<number, any>;
  diagnostic?: string;
}

export interface PaymentMethod {
  id: string;
  name?: string;
  type: 'cash' | 'card' | 'check' | 'transfer' | 'bank' | 'qr';
  active?: boolean;
  label?: string;
  value?: string;
  qrImage?: string;
}

// Stub db object (retorna arrays vacíos para que .filter() funcione)
// TODO: Reemplazar con llamadas a API
export const db = {
  async getAll<T = unknown>(table: string): Promise<T[]> {
    console.warn(`⚠️ db.getAll('${table}') es DEPRECATED. Usa fetch("/api/${table}") en lugar.`);
    return [] as T[];
  },
  async getAllUsers(): Promise<User[]> {
    console.warn('⚠️ db.getAllUsers() es DEPRECATED. Usa fetch("/api/users") en lugar.');
    return [];
  },
  async getAllPatients(): Promise<Patient[]> {
    console.warn('⚠️ db.getAllPatients() es DEPRECATED. Usa fetch("/api/patients") en lugar.');
    return [];
  },
  async getAllAppointments(): Promise<Appointment[]> {
    console.warn('⚠️ db.getAllAppointments() es DEPRECATED. Usa fetch("/api/appointments") en lugar.');
    return [];
  },
  async getAllPayments(): Promise<Payment[]> {
    console.warn('⚠️ db.getAllPayments() es DEPRECATED. Usa fetch("/api/payments") en lugar.');
    return [];
  },
  async getById<T = unknown>(table: string, id: string): Promise<T | null> {
    console.warn(`⚠️ db.getById('${table}', '${id}') es DEPRECATED. Usa fetch("/api/${table}/${id}") en lugar.`);
    return null;
  },
  async exportData(): Promise<string> {
    console.warn('⚠️ db.exportData() es DEPRECATED. Usa endpoint de backups en lugar.');
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      data: {},
    });
  },
  async importData(_data: unknown): Promise<void> {
    console.warn('⚠️ db.importData() es DEPRECATED. Usa endpoint de backups en lugar.');
  },
  put: async (tableOrData: string | unknown, maybeData?: unknown): Promise<null> => {
    const hasTable = typeof tableOrData === 'string';
    const target = hasTable ? tableOrData : 'unknown';
    const payload = hasTable ? maybeData : tableOrData;
    void payload;
    console.warn(`⚠️ db.put('${target}', data) es DEPRECATED. Usa useMutation() con endpoints POST/PUT en lugar.`);
    return null;
  },
  delete: async (table: string, id: string) => {
    console.warn(`⚠️ db.delete('${table}', '${id}') es DEPRECATED. Usa useMutation(..., 'DELETE') en lugar.`);
    return null;
  },
};

console.warn(
  '⚠️ [DEPRECATED] src/lib/db.ts es un archivo legacy. Las páginas admin deberían migrar a useApi/useMutation hooks.'
);
