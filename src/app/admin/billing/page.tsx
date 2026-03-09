
"use client";

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { db, User, SubscriptionPayment } from '@/lib/db';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Landmark, History, ReceiptText, ShieldCheck, ShieldAlert, Ban, Wallet, MoreVertical, RefreshCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, isAfter, parseISO, addDays, addMonths, isValid } from 'date-fns';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

function BillingContent() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [clinics, setClinics] = useState<User[]>([]);
  const [history, setHistory] = useState<SubscriptionPayment[]>([]);
  const [search, setSearch] = useState('');
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<User | null>(null);
  const [payAmount, setPayAmount] = useState('0');
  const [nextDate, setNextDate] = useState('');
  const [installments, setInstallments] = useState('1');

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (selectedClinic && installments) {
      const currentExpiry = selectedClinic.nextPaymentDate ? parseISO(selectedClinic.nextPaymentDate) : new Date();
      const num = parseInt(installments) || 1;
      const calculatedNext = addMonths(isValid(currentExpiry) ? currentExpiry : new Date(), num);
      
      setNextDate(format(calculatedNext, 'yyyy-MM-dd'));
      setPayAmount(((selectedClinic.subscriptionFee || 0) * num).toString());
    }
  }, [selectedClinic, installments]);

  const load = async () => {
    const allUsers = await db.getAll<User>('users');
    const allHistory = await db.getAll<SubscriptionPayment>('subscription_payments');
    setClinics(allUsers.filter(u => u.role === 'clinic'));
    setHistory(allHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const safeFormatDate = (dateStr?: string) => {
    if (!dateStr) return '---';
    if (dateStr.includes('/')) return dateStr;
    try {
      const parsed = parseISO(dateStr);
      return isValid(parsed) ? format(parsed, 'dd/MM/yyyy') : dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  const handleRegisterPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClinic || !currentUser) return;

    const payment: SubscriptionPayment = {
      id: crypto.randomUUID(),
      clinicId: selectedClinic.id,
      clinicName: selectedClinic.fullName || selectedClinic.username || 'Clínica',
      amount: parseFloat(payAmount),
      date: new Date().toISOString().split('T')[0],
      concept: `Renovación: ${installments} cuota(s) mensuales. Próximo vencimiento: ${safeFormatDate(nextDate)}`,
      processedByAdminId: currentUser.username
    };

    await db.put('subscription_payments', payment);
    
    const updatedClinic: User = {
      ...selectedClinic,
      nextPaymentDate: nextDate,
      subscriptionStatus: 'active'
    };
    await db.put('users', updatedClinic);

    setIsPayOpen(false);
    toast({ 
      title: "Pago registrado con éxito", 
      description: `Acceso extendido hasta el ${safeFormatDate(nextDate)}` 
    });
    setInstallments('1');
    load();
  };

  const handleStatusChange = async (clinicId: string, newStatus: 'active' | 'suspended' | 'blocked') => {
    const clinic = clinics.find(c => c.id === clinicId);
    if (!clinic) return;
    const updated: User = { ...clinic, subscriptionStatus: newStatus };
    await db.put('users', updated);
    toast({ title: "Estado actualizado", description: `El consultorio ahora está ${newStatus === 'active' ? 'Activo' : newStatus === 'suspended' ? 'Suspendido' : 'Bloqueado'}` });
    load();
  };

  const getCalculatedStatus = (clinic: User) => {
    if (clinic.subscriptionStatus === 'blocked') return 'blocked';
    if (!clinic.nextPaymentDate) return 'active';
    try {
      const next = parseISO(clinic.nextPaymentDate);
      if (!isValid(next)) return 'active';
      const today = new Date();
      if (isAfter(today, addDays(next, 10))) return 'suspended';
      if (isAfter(today, next)) return 'overdue';
      return 'active';
    } catch (e) {
      return 'active';
    }
  };

  const filteredClinics = clinics.filter(c => 
    (c.fullName || c.username || '').toLowerCase().includes(search.toLowerCase()) || 
    (c.dni || '').includes(search)
  );

  if (currentUser?.role !== 'admin') return null;

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-primary">Control de Cobros</h2>
            <p className="text-muted-foreground mt-2">Gestión financiera y reactivación de consultorios (Regional DD/MM/AAAA)</p>
          </div>
          <div className="bg-primary/10 px-6 py-4 rounded-2xl border border-primary/20 flex items-center gap-4 shadow-sm">
            <ReceiptText className="w-8 h-8 text-primary" />
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Recaudación Total</p>
              <p className="text-3xl font-black text-primary">S/. {history.reduce((acc, h) => acc + h.amount, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-6 mb-6">
              <div>
                <CardTitle className="text-xl">Panel de Cobros</CardTitle>
                <CardDescription>Monitoreo de vencimientos y registro de cuotas mensuales</CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input 
                  placeholder="Buscar consultorio..." 
                  className="pl-10 h-10 w-full text-xs rounded-xl border bg-slate-50 focus:bg-white transition-all outline-none px-4" 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-slate-50/50">
                    <TableHead className="font-bold">Consultorio</TableHead>
                    <TableHead className="font-bold">Vencimiento</TableHead>
                    <TableHead className="font-bold">Estado</TableHead>
                    <TableHead className="text-right font-bold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClinics.map(c => {
                    const status = getCalculatedStatus(c);
                    return (
                      <TableRow key={c.id} className="group hover:bg-slate-50 transition-colors border-slate-100">
                        <TableCell>
                          <p className="font-bold text-sm text-slate-900">{c.fullName || c.username}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">S/. {c.subscriptionFee} mensual</p>
                        </TableCell>
                        <TableCell className="text-xs font-bold text-slate-600">
                          {safeFormatDate(c.nextPaymentDate)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={cn(
                              "text-[9px] h-5 font-black tracking-tighter px-2",
                              status === 'active' && "bg-emerald-100 text-emerald-700 border-emerald-200",
                              status === 'overdue' && "bg-amber-100 text-amber-700 border-amber-200",
                              status === 'suspended' && "bg-orange-100 text-orange-700 border-orange-200",
                              status === 'blocked' && "bg-red-100 text-red-700 border-red-200"
                            )}
                          >
                            {status === 'active' ? 'ACTIVA' : status === 'overdue' ? 'MORA' : status === 'suspended' ? 'SUSPENDIDA' : 'BLOQUEADA'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              className="h-9 px-4 gap-2 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/10 hover:scale-105 transition-all" 
                              onClick={() => {
                                setSelectedClinic(c);
                                setIsPayOpen(true);
                              }}
                            >
                              <Wallet className="w-4 h-4" />
                              Registrar Pago
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-white">
                                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-52 rounded-2xl shadow-xl border-slate-100 p-2">
                                <DropdownMenuLabel className="text-[10px] px-3 py-2 uppercase font-black text-muted-foreground tracking-widest">Control de Acceso</DropdownMenuLabel>
                                <DropdownMenuSeparator className="my-1" />
                                <DropdownMenuItem className="gap-3 py-2.5 rounded-xl cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50" onClick={() => handleStatusChange(c.id, 'active')}>
                                  <div className="p-1.5 bg-emerald-100 rounded-lg"><ShieldCheck className="w-4 h-4 text-emerald-600" /></div>
                                  <span className="font-bold text-sm text-emerald-900">Activar Servicio</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-3 py-2.5 rounded-xl cursor-pointer hover:bg-orange-50 focus:bg-orange-50" onClick={() => handleStatusChange(c.id, 'suspended')}>
                                  <div className="p-1.5 bg-orange-100 rounded-lg"><ShieldAlert className="w-4 h-4 text-orange-600" /></div>
                                  <span className="font-bold text-sm text-orange-900">Suspender Acceso</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1" />
                                <DropdownMenuItem className="gap-3 py-2.5 rounded-xl cursor-pointer hover:bg-red-50 focus:bg-red-50" onClick={() => handleStatusChange(c.id, 'blocked')}>
                                  <div className="p-1.5 bg-red-100 rounded-lg"><Ban className="w-4 h-4 text-red-600" /></div>
                                  <span className="font-bold text-sm text-red-900">Bloquear Cuenta</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="border-b pb-6 mb-6">
              <CardTitle className="text-lg flex items-center gap-2 font-bold"><History className="w-5 h-5 text-primary" /> Historial Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                {history.map(h => (
                  <div key={h.id} className="p-4 border rounded-2xl bg-slate-50/50 flex items-start justify-between hover:bg-white transition-all shadow-sm border-slate-100 group">
                    <div className="flex gap-3">
                      <div className="p-2 bg-white rounded-xl text-emerald-600 border border-emerald-50">
                        <ReceiptText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-xs truncate text-slate-900 uppercase">{h.clinicName}</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">{h.concept}</p>
                        {h.processedByAdminId && (
                          <p className="text-[8px] font-black text-primary uppercase mt-1">Por: {h.processedByAdminId}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-xs text-emerald-600">S/. {h.amount.toFixed(2)}</p>
                      <p className="text-[9px] font-bold text-muted-foreground">{safeFormatDate(h.date)}</p>
                    </div>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground bg-slate-50/50 rounded-2xl border-2 border-dashed">
                    <History className="w-10 h-10 mx-auto mb-2 opacity-10" />
                    <p className="text-xs font-bold uppercase tracking-widest">Sin abonos registrados</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog Registro Pago */}
      <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Landmark className="w-6 h-6 text-primary" /> Registrar Pago de Cuotas
            </DialogTitle>
          </DialogHeader>
          {selectedClinic && (
            <form onSubmit={handleRegisterPayment} className="space-y-6 py-4">
              <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10">
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Consultorio Dental</p>
                <p className="font-black text-lg text-primary truncate">{selectedClinic.fullName || selectedClinic.username}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Meses a Adelantar</Label>
                  <Select value={installments} onValueChange={setInstallments}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => i + 1).map(n => (
                        <SelectItem key={n} value={n.toString()}>{n} mes(es)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Monto Total (S/.)</Label>
                  <Input type="number" step="0.01" value={payAmount} readOnly className="bg-slate-50 font-black rounded-xl h-11 border-none shadow-inner" />
                </div>
              </div>
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <RefreshCcw className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="text-[10px] font-black text-emerald-800 uppercase leading-none tracking-widest">Nueva Vigencia</p>
                    <p className="text-lg font-black text-emerald-600 mt-1">{safeFormatDate(nextDate)}</p>
                  </div>
                </div>
              </div>
              <DialogFooter><Button type="submit" className="w-full h-14 text-lg font-black rounded-2xl shadow-xl shadow-primary/20">CONFIRMAR PAGO</Button></DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

export default function BillingPage() {
  return (
    <AuthProvider>
      <BillingContent />
    </AuthProvider>
  );
}
