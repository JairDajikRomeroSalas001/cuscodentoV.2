
"use client";

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { db, Patient, User } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { UserPlus, Search, Eye, Camera, Trash2, ShieldAlert } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

function PatientsContent() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Security states for deletion
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');

  const clinicId = user?.role === 'clinic' ? user.id : user?.clinicId;

  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    dni: '',
    names: '',
    lastNames: '',
    email: '',
    phone: '',
    address: '',
    underTreatment: false,
    proneToBleeding: false,
    allergicToMeds: false,
    allergiesDetail: '',
    hypertensive: false,
    diabetic: false,
    pregnant: false,
    consultationReason: '',
    diagnostic: '',
    medicalObservations: '',
    attendedBy: '',
  });

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user || !clinicId) return;
    const allP = await db.getAll<Patient>('patients');
    const allU = await db.getAll<User>('users');
    
    setPatients(allP.filter(p => p.clinicId === clinicId));
    setUsers(allU.filter(u => u.id === clinicId || u.clinicId === clinicId));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicId) return;

    const dniFinal = newPatient.dni?.trim() === '' ? '00000000' : newPatient.dni;
    
    const patient: Patient = {
      ...(newPatient as Patient),
      id: crypto.randomUUID(),
      dni: dniFinal || '00000000',
      photo: photoPreview || undefined,
      registrationDate: new Date().toLocaleDateString('es-PE'),
      clinicId: clinicId
    };

    await db.put('patients', patient);
    setIsRegisterOpen(false);
    resetForm();
    toast({ title: "Paciente Registrado", description: "La historia clínica ha sido creada con éxito." });
    loadData();
  };

  const resetForm = () => {
    setNewPatient({
      dni: '', names: '', lastNames: '', email: '', phone: '', address: '',
      underTreatment: false, proneToBleeding: false, allergicToMeds: false,
      allergiesDetail: '', hypertensive: false, diabetic: false, pregnant: false,
      consultationReason: '', diagnostic: '', medicalObservations: '', attendedBy: '',
    });
    setPhotoPreview(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setPatientToDelete(id);
    setConfirmPassword('');
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!user) return;
    
    // SECURITY: Validate password for deletion
    if (user.password === confirmPassword) {
      if (patientToDelete) {
        await db.delete('patients', patientToDelete);
        setIsDeleteOpen(false);
        setPatientToDelete(null);
        toast({ title: "Registro Eliminado", variant: "destructive" });
        loadData();
      }
    } else {
      toast({ variant: 'destructive', title: 'Error de Seguridad', description: 'Contraseña incorrecta. El registro no fue eliminado.' });
    }
  };

  const filteredPatients = patients.filter(p => 
    p.names.toLowerCase().includes(search.toLowerCase()) || 
    p.lastNames.toLowerCase().includes(search.toLowerCase()) ||
    p.dni.includes(search)
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary">Directorio de Pacientes</h2>
            <p className="text-muted-foreground mt-1">Gestión segura de historias clínicas digitales</p>
          </div>
          <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 h-12 shadow-lg shadow-primary/20">
                <UserPlus className="w-5 h-5" />
                Nuevo Paciente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[95vw] md:max-w-[1000px] h-[90vh] overflow-y-auto rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Registro de Paciente e Historia Clínica</DialogTitle>
                <DialogDescription>Complete todos los campos para el expediente legal del paciente.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2 text-primary">Datos Personales</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dni">DNI / Pasaporte (Opcional)</Label>
                      <Input id="dni" value={newPatient.dni} onChange={e => setNewPatient({...newPatient, dni: e.target.value.replace(/\D/g, '').slice(0, 12)})} placeholder="00000000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Celular de Contacto</Label>
                      <Input id="phone" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="names">Nombres</Label>
                      <Input id="names" value={newPatient.names} onChange={e => setNewPatient({...newPatient, names: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastNames">Apellidos Completos</Label>
                      <Input id="lastNames" value={newPatient.lastNames} onChange={e => setNewPatient({...newPatient, lastNames: e.target.value})} required />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input id="email" type="email" value={newPatient.email} onChange={e => setNewPatient({...newPatient, email: e.target.value})} />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="address">Dirección de Domicilio</Label>
                      <Input id="address" value={newPatient.address} onChange={e => setNewPatient({...newPatient, address: e.target.value})} required />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Fotografía del Paciente</Label>
                      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border-2 border-dashed">
                        <div className="w-20 h-20 rounded-lg bg-white border flex items-center justify-center overflow-hidden shadow-sm">
                          {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 opacity-20" />}
                        </div>
                        <Input type="file" accept="image/*" onChange={handlePhotoUpload} className="flex-1 h-10 border-none bg-transparent" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2 text-primary">Anamnesis / Historia Médica</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-xl bg-slate-50/50">
                      <Label className="text-xs font-bold">Bajo tratamiento</Label>
                      <Switch checked={newPatient.underTreatment} onCheckedChange={v => setNewPatient({...newPatient, underTreatment: v})} />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-xl bg-slate-50/50">
                      <Label className="text-xs font-bold text-red-600">Hemorragias</Label>
                      <Switch checked={newPatient.proneToBleeding} onCheckedChange={v => setNewPatient({...newPatient, proneToBleeding: v})} />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-xl bg-slate-50/50">
                      <Label className="text-xs font-bold">Hipertenso</Label>
                      <Switch checked={newPatient.hypertensive} onCheckedChange={v => setNewPatient({...newPatient, hypertensive: v})} />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-xl bg-slate-50/50">
                      <Label className="text-xs font-bold">Diabético</Label>
                      <Switch checked={newPatient.diabetic} onCheckedChange={v => setNewPatient({...newPatient, diabetic: v})} />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-xl bg-slate-50/50 col-span-2">
                      <Label className="text-xs font-bold">¿En periodo de embarazo?</Label>
                      <Switch checked={newPatient.pregnant} onCheckedChange={v => setNewPatient({...newPatient, pregnant: v})} />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-xl bg-red-50 border-red-100">
                        <Label className="text-xs font-black text-red-700">ALÉRGICO A MEDICAMENTOS</Label>
                        <Switch checked={newPatient.allergicToMeds} onCheckedChange={v => setNewPatient({...newPatient, allergicToMeds: v})} />
                      </div>
                      {newPatient.allergicToMeds && (
                        <Input placeholder="Especifique los medicamentos..." value={newPatient.allergiesDetail} onChange={e => setNewPatient({...newPatient, allergiesDetail: e.target.value})} className="border-red-200 focus:ring-red-200" />
                      )}
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Motivo de consulta</Label>
                      <Input value={newPatient.consultationReason} onChange={e => setNewPatient({...newPatient, consultationReason: e.target.value})} required className="h-11 rounded-xl" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Diagnóstico Preliminar</Label>
                      <Textarea value={newPatient.diagnostic} onChange={e => setNewPatient({...newPatient, diagnostic: e.target.value})} className="rounded-xl min-h-[80px]" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Médico Tratante</Label>
                      <Select onValueChange={v => setNewPatient({...newPatient, attendedBy: v})}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Seleccione Odontólogo" /></SelectTrigger>
                        <SelectContent>
                          {users.map(u => <SelectItem key={u.id} value={u.fullName || u.username || 'Odontólogo'}>{u.fullName || u.username}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <DialogFooter className="col-span-full pt-6 border-t mt-4">
                  <Button type="submit" className="w-full h-14 text-lg font-black rounded-2xl shadow-xl shadow-primary/20">REGISTRAR HISTORIA CLÍNICA</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-8 border-none shadow-sm rounded-[2rem]">
          <div className="relative mb-8 max-w-2xl">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar por DNI, Nombres o Apellidos..." 
              className="pl-12 h-12 rounded-2xl bg-slate-50 border-none shadow-inner text-base"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="border rounded-[1.5rem] overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Documento</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Paciente</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Celular</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Médico Asignado</TableHead>
                  <TableHead className="text-right font-black uppercase text-[10px] tracking-widest">Acciones de Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((p) => (
                    <TableRow key={p.id} className="group hover:bg-slate-50 transition-colors">
                      <TableCell className="font-mono text-xs">{p.dni}</TableCell>
                      <TableCell className="font-black text-slate-800">{p.lastNames}, {p.names}</TableCell>
                      <TableCell className="text-sm font-medium">{p.phone}</TableCell>
                      <TableCell className="text-sm">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10">Dr. {p.attendedBy || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="secondary" size="sm" className="gap-2 h-9 rounded-xl font-bold">
                            <Link href={`/patients/${p.id}`}>
                              <Eye className="w-4 h-4" /> Ver Historial
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteRequest(p.id)} className="h-9 w-9 text-destructive opacity-0 group-hover:opacity-100 transition-opacity rounded-xl hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-24 text-muted-foreground bg-slate-50/30">
                       <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-10" />
                       <p className="font-bold uppercase tracking-widest text-xs">No se encontraron registros</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* SECURITY: Password Confirmation for Deletion */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-destructive text-xl font-black">
              <div className="p-2 bg-red-100 rounded-lg"><ShieldAlert className="w-6 h-6" /></div>
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription className="text-base font-medium pt-2">
              Esta acción es irreversible y eliminará todo el historial clínico, odontogramas y pagos del paciente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-6">
            <div className="space-y-3">
              <Label htmlFor="pass-confirm" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Ingrese su contraseña de acceso</Label>
              <Input 
                id="pass-confirm" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="••••••••"
                className="h-12 rounded-xl bg-slate-50 focus:bg-white transition-all border-none shadow-inner"
              />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="h-12 rounded-xl font-bold flex-1">Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete} className="h-12 rounded-xl font-black flex-1 shadow-lg shadow-red-500/20">ELIMINAR PERMANENTE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

export default function PatientsPage() {
  return (
    <AuthProvider>
      <PatientsContent />
    </AuthProvider>
  );
}
