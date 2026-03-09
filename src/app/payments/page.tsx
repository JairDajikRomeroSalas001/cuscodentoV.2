
"use client";

import { useState, useEffect } from 'react';
import { AuthProvider } from '@/hooks/use-auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { db, Payment, Patient, Appointment } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, ChevronLeft, ChevronRight, HandCoins } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, isValid } from 'date-fns';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 10;

function PaymentsContent() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPayment, setEditingPayment] = useState<any | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newAmo, setNewAmo] = useState(0);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const allP = await db.getAll<Payment>('payments');
    const allPatients = await db.getAll<Patient>('patients');
    
    const fullPayments = allP.map(p => {
      const patient = allPatients.find(pat => pat.id === p.patientId);
      return {
        ...p,
        patientName: patient ? `${patient.lastNames}, ${patient.names}` : 'Desconocido',
        patientDni: patient?.dni || '',
      };
    });

    setPayments(fullPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPayment) {
      const newPaid = editingPayment.totalPaid + newAmo;
      const newBalance = Math.max(0, editingPayment.totalCost - newPaid);
      const date = new Date().toISOString().split('T')[0];
      const time = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

      const updatedHistory = [...(editingPayment.history || [])];
      updatedHistory.push({ date, time, amount: newAmo });

      const updatedPayment: Payment = {
        ...editingPayment,
        totalPaid: newPaid,
        balance: newBalance,
        date: date,
        time: time,
        history: updatedHistory
      };

      await db.put('payments', updatedPayment);

      if (editingPayment.appointmentId) {
        const appointment = await db.getById<Appointment>('appointments', editingPayment.appointmentId);
        if (appointment) {
          await db.put('appointments', { 
            ...appointment, 
            paidAmount: newPaid, 
            balance: newBalance 
          });
        }
      }

      setIsEditOpen(false);
      setNewAmo(0);
      toast({ title: "Abono registrado", description: `Nuevo saldo: S/. ${newBalance.toFixed(2)}` });
      load();
    }
  };

  const safeFormatDate = (dateStr: string) => {
    if (!dateStr) return '---';
    if (dateStr.includes('/')) return dateStr;
    try {
      const parsed = parseISO(dateStr);
      return isValid(parsed) ? format(parsed, 'dd/MM/yyyy') : dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  const filtered = payments.filter(p => 
    p.patientName.toLowerCase().includes(search.toLowerCase()) || 
    p.treatmentName.toLowerCase().includes(search.toLowerCase()) ||
    p.patientDni.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedData = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const totalRecaudado = payments.reduce((acc, curr) => acc + curr.totalPaid, 0);
  const totalSaldos = payments.reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary">Seguimiento de Pagos</h2>
            <p className="text-muted-foreground mt-1">Control de presupuestos y abonos de pacientes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-primary/5">
             <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-muted-foreground">Recaudación</CardTitle></CardHeader>
             <CardContent><div className="text-2xl font-bold text-primary">S/. {totalRecaudado.toFixed(2)}</div></CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-amber-50">
             <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-amber-600">Por Cobrar</CardTitle></CardHeader>
             <CardContent><div className="text-2xl font-bold text-amber-600">S/. {totalSaldos.toFixed(2)}</div></CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-slate-50">
             <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-slate-600">Operaciones</CardTitle></CardHeader>
             <CardContent><div className="text-2xl font-bold text-slate-600">{payments.length}</div></CardContent>
          </Card>
        </div>

        <Card className="p-6 border-none shadow-sm">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="DNI o Nombre del Paciente..." 
                className="pl-10 h-11"
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>

          <div className="border rounded-xl overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Tratamiento</TableHead>
                  <TableHead>Presupuesto</TableHead>
                  <TableHead>Pagado</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-bold text-sm">{p.patientName}</div>
                      <div className="text-[10px] text-muted-foreground">DNI: {p.patientDni}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-[11px] uppercase truncate max-w-[150px]">{p.treatmentName}</div>
                      <div className="text-[10px] text-muted-foreground">{safeFormatDate(p.date)}</div>
                    </TableCell>
                    <TableCell className="text-sm">S/. {p.totalCost.toFixed(2)}</TableCell>
                    <TableCell className="font-bold text-emerald-600 text-sm">S/. {p.totalPaid.toFixed(2)}</TableCell>
                    <TableCell className="font-bold text-sm">S/. {p.balance.toFixed(2)}</TableCell>
                    <TableCell>
                       <Badge variant={p.balance > 0 ? 'outline' : 'default'} className={cn("text-[10px] h-5", p.balance > 0 ? 'text-amber-600 border-amber-600' : 'bg-emerald-500')}>
                         {p.balance > 0 ? 'PENDIENTE' : 'LIQUIDADO'}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="outline" size="sm" className="h-8 gap-2" onClick={() => { setEditingPayment(p); setIsEditOpen(true); }} disabled={p.balance === 0}>
                         <HandCoins className="w-4 h-4" /> Abono
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
               <span className="text-xs text-muted-foreground">Página {currentPage} de {totalPages}</span>
               <div className="flex gap-2">
                 <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                   <ChevronLeft className="w-4 h-4" />
                 </Button>
                 <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
                   <ChevronRight className="w-4 h-4" />
                 </Button>
               </div>
            </div>
          )}
        </Card>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
           <DialogContent className="sm:max-w-md">
             <DialogHeader><DialogTitle className="flex items-center gap-2"><HandCoins className="w-5 h-5 text-emerald-600" /> Registrar Abono</DialogTitle></DialogHeader>
             {editingPayment && (
               <form onSubmit={handleUpdate} className="space-y-4 py-2">
                 <div className="p-4 bg-muted/50 rounded-xl border space-y-2">
                   <p className="text-xs">Paciente: <b className="text-primary">{editingPayment.patientName}</b></p>
                   <p className="text-xs">Procedimiento: <b>{editingPayment.treatmentName}</b></p>
                   <p className="text-xs">Saldo Pendiente: <b className="text-amber-600">S/. {editingPayment.balance.toFixed(2)}</b></p>
                 </div>
                 <div className="space-y-2">
                   <Label>Monto del nuevo abono (S/.)</Label>
                   <Input 
                     type="number" 
                     step="0.01" 
                     max={editingPayment.balance}
                     value={newAmo} 
                     onChange={e => setNewAmo(parseFloat(e.target.value) || 0)} 
                   />
                 </div>
                 <div className="bg-emerald-50 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase text-emerald-700">Nuevo Saldo:</span>
                    <span className="text-sm font-bold text-emerald-600">S/. {Math.max(0, editingPayment.balance - newAmo).toFixed(2)}</span>
                 </div>
                 <DialogFooter>
                   <Button type="submit" className="w-full h-12 text-lg" disabled={newAmo <= 0 || newAmo > editingPayment.balance}>Registrar Pago</Button>
                 </DialogFooter>
               </form>
             )}
           </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

export default function PaymentsPage() {
  return (
    <AuthProvider>
      <PaymentsContent />
    </AuthProvider>
  );
}
