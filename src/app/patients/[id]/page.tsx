"use client";

import { useState, useEffect, use } from 'react';
import { AuthProvider } from '@/hooks/use-auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { db, Patient, Treatment, PatientTreatment, Payment, Radiograph, Consent, Appointment } from '@/lib/db';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, CreditCard, Stethoscope, Image as ImageIcon, FileText, Activity, ChevronLeft, Plus, Eye, History } from 'lucide-react';
import Link from 'next/link';

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [patientTreatments, setPatientTreatments] = useState<any[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [radiographs, setRadiographs] = useState<Radiograph[]>([]);
  const [consents, setConsents] = useState<Consent[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    loadAll();
  }, [id]);

  const loadAll = async () => {
    const p = await db.getById<Patient>('patients', id);
    if (!p) return;
    setPatient(p);

    const pts = await db.getAll<PatientTreatment>('patient_treatments');
    const trs = await db.getAll<Treatment>('treatments');
    
    const relevantPts = (pts || []).filter(pt => pt.patientId === id).map(pt => ({
      ...pt,
      treatmentName: trs.find(t => t.id === pt.treatmentId)?.name || 'Tratamiento Desconocido'
    }));
    setPatientTreatments(relevantPts);

    const allPayments = await db.getAll<Payment>('payments');
    setPayments((allPayments || []).filter(pay => pay.patientId === id));

    const allRad = await db.getAll<Radiograph>('radiographs');
    setRadiographs((allRad || []).filter(r => r.patientId === id));

    const allConsents = await db.getAll<Consent>('consents');
    setConsents((allConsents || []).filter(c => c.patientId === id));

    const allApp = await db.getAll<Appointment>('appointments');
    setAppointments((allApp || []).filter(a => a.patientId === id));
  };

  if (!patient) return null;

  return (
    <AuthProvider>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon">
                <Link href="/patients"><ChevronLeft /></Link>
              </Button>
              <div>
                <h2 className="text-3xl font-bold text-primary">{patient.lastNames}, {patient.names}</h2>
                <div className="flex gap-4 mt-1">
                  <Badge variant="outline" className="border-primary text-primary">DNI: {patient.dni}</Badge>
                  <Badge variant="outline" className="border-primary text-primary">{patient.age || 'N/A'} años</Badge>
                  <span className="text-sm text-muted-foreground">Registrado el {patient.registrationDate}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="gap-2">
                <Link href={`/patients/${id}/odontogram`}><Activity className="w-4 h-4" /> Ver Odontograma</Link>
              </Button>
              <Button asChild className="gap-2">
                 <Link href="/appointments"><Plus className="w-4 h-4" /> Nueva Cita</Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-muted p-1 rounded-xl h-auto flex flex-wrap justify-start gap-1">
              <TabsTrigger value="overview" className="gap-2 py-3 px-6"><Eye className="w-4 h-4" /> Historia Clínica</TabsTrigger>
              <TabsTrigger value="treatments" className="gap-2 py-3 px-6"><Stethoscope className="w-4 h-4" /> Tratamientos</TabsTrigger>
              <TabsTrigger value="payments" className="gap-2 py-3 px-6"><CreditCard className="w-4 h-4" /> Pagos</TabsTrigger>
              <TabsTrigger value="radiographs" className="gap-2 py-3 px-6"><ImageIcon className="w-4 h-4" /> Radiografías</TabsTrigger>
              <TabsTrigger value="consents" className="gap-2 py-3 px-6"><FileText className="w-4 h-4" /> Consentimientos</TabsTrigger>
              <TabsTrigger value="appointments" className="gap-2 py-3 px-6"><Calendar className="w-4 h-4" /> Citas</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card className="md:col-span-1 border-none shadow-sm">
                   <CardHeader className="bg-primary/5"><CardTitle className="text-lg">Ficha de Identificación</CardTitle></CardHeader>
                   <CardContent className="space-y-4 pt-6">
                     <div className="flex flex-col gap-1 border-b pb-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Teléfono</span>
                        <span className="font-medium text-primary">{patient.phone}</span>
                     </div>
                     <div className="flex flex-col gap-1 border-b pb-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Correo</span>
                        <span className="font-medium">{patient.email || 'No registrado'}</span>
                     </div>
                     <div className="flex flex-col gap-1 border-b pb-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Dirección</span>
                        <span className="font-medium">{patient.address}</span>
                     </div>
                     <div className="flex flex-col gap-1 border-b pb-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Atendido por</span>
                        <span className="font-medium">Dr. {patient.attendedBy}</span>
                     </div>
                   </CardContent>
                 </Card>

                 <Card className="md:col-span-2 border-none shadow-sm">
                   <CardHeader className="bg-amber-50/50"><CardTitle className="text-lg flex items-center gap-2"><History className="w-5 h-5 text-amber-600" /> Antecedentes Patológicos e Historial</CardTitle></CardHeader>
                   <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4 mb-8">
                         <div className={`p-3 rounded-lg border flex items-center justify-between ${patient.underTreatment ? 'bg-red-50 border-red-200' : 'bg-slate-50'}`}>
                            <span className="text-xs font-bold">Tratamiento Médico</span>
                            <Badge variant={patient.underTreatment ? 'destructive' : 'secondary'}>{patient.underTreatment ? 'SÍ' : 'NO'}</Badge>
                         </div>
                         <div className={`p-3 rounded-lg border flex items-center justify-between ${patient.proneToBleeding ? 'bg-red-50 border-red-200' : 'bg-slate-50'}`}>
                            <span className="text-xs font-bold">Hemorragias</span>
                            <Badge variant={patient.proneToBleeding ? 'destructive' : 'secondary'}>{patient.proneToBleeding ? 'SÍ' : 'NO'}</Badge>
                         </div>
                         <div className={`p-3 rounded-lg border flex items-center justify-between ${patient.hypertensive ? 'bg-red-50 border-red-200' : 'bg-slate-50'}`}>
                            <span className="text-xs font-bold">Hipertenso</span>
                            <Badge variant={patient.hypertensive ? 'destructive' : 'secondary'}>{patient.hypertensive ? 'SÍ' : 'NO'}</Badge>
                         </div>
                         <div className={`p-3 rounded-lg border flex items-center justify-between ${patient.diabetic ? 'bg-red-50 border-red-200' : 'bg-slate-50'}`}>
                            <span className="text-xs font-bold">Diabético</span>
                            <Badge variant={patient.diabetic ? 'destructive' : 'secondary'}>{patient.diabetic ? 'SÍ' : 'NO'}</Badge>
                         </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-muted/30 rounded-lg">
                           <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Motivo de consulta</h4>
                           <p className="text-sm font-medium">{patient.consultationReason}</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                           <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Diagnóstico Inicial</h4>
                           <p className="text-sm">{patient.diagnostic || 'Sin diagnóstico registrado'}</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                           <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Observaciones Médicas</h4>
                           <p className="text-sm">{patient.medicalObservations || 'Ninguna'}</p>
                        </div>
                        {patient.allergicToMeds && (
                           <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                              <h4 className="text-xs font-bold uppercase text-red-600 mb-2">ALERGIAS A MEDICAMENTOS</h4>
                              <p className="text-sm font-bold text-red-700">{patient.allergiesDetail}</p>
                           </div>
                        )}
                      </div>
                   </CardContent>
                 </Card>
               </div>
            </TabsContent>

            <TabsContent value="treatments">
               <Card className="border-none shadow-sm p-6">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold">Historial de Tratamientos</h3>
                   <Button size="sm" asChild className="gap-2"><Link href="/appointments"><Plus className="w-4 h-4" /> Agendar Tratamiento</Link></Button>
                 </div>
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Fecha</TableHead>
                       <TableHead>Tratamiento</TableHead>
                       <TableHead>Costo S/.</TableHead>
                       <TableHead>Estado Pago</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {patientTreatments.map(pt => (
                       <TableRow key={pt.id}>
                         <TableCell>{pt.date}</TableCell>
                         <TableCell className="font-medium">{pt.treatmentName}</TableCell>
                         <TableCell>S/. {pt.actualPrice?.toFixed(2) || '0.00'}</TableCell>
                         <TableCell>
                           <Badge className="bg-emerald-500">Completado</Badge>
                         </TableCell>
                       </TableRow>
                     ))}
                     {patientTreatments.length === 0 && (
                       <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">Sin tratamientos específicos registrados en tabla separada</TableCell></TableRow>
                     )}
                   </TableBody>
                 </Table>
               </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card className="border-none shadow-sm p-6">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold">Registro de Pagos y Saldos</h3>
                   <Button size="sm" asChild className="gap-2"><Link href="/payments"><Plus className="w-4 h-4" /> Gestionar Pagos</Link></Button>
                 </div>
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Fecha</TableHead>
                       <TableHead>Servicio</TableHead>
                       <TableHead>Abonado S/.</TableHead>
                       <TableHead>Saldo S/.</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {payments.map(p => (
                       <TableRow key={p.id}>
                         <TableCell>{p.date}</TableCell>
                         <TableCell className="text-xs">{p.treatmentName}</TableCell>
                         <TableCell className="font-bold text-emerald-600">S/. {p.amount.toFixed(2)}</TableCell>
                         <TableCell className="font-bold text-amber-600">S/. {p.balance.toFixed(2)}</TableCell>
                       </TableRow>
                     ))}
                     {payments.length === 0 && (
                       <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No se han registrado transacciones aún</TableCell></TableRow>
                     )}
                   </TableBody>
                 </Table>
              </Card>
            </TabsContent>

            <TabsContent value="radiographs">
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                 <div className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => alert('Función de subida disponible en versión de escritorio')}>
                    <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-xs font-bold">Subir Radiografía</span>
                 </div>
                 {radiographs.map(r => (
                   <Card key={r.id} className="overflow-hidden group relative border-none shadow-sm">
                     <div className="aspect-square bg-slate-900 flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-slate-700" />
                     </div>
                     <div className="p-2 text-center bg-white">
                        <p className="text-[10px] truncate font-bold">{r.fileName}</p>
                        <p className="text-[10px] text-muted-foreground">{r.date}</p>
                     </div>
                   </Card>
                 ))}
               </div>
            </TabsContent>
            
            <TabsContent value="consents">
               <Card className="border-none shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Consentimientos Firmados</h3>
                    <Button size="sm" className="gap-2" onClick={() => alert('Generando PDF...')}>
                      <Plus className="w-4 h-4" /> Generar Nuevo
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {consents.map(c => (
                      <div key={c.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-primary" />
                          <div>
                            <p className="font-bold text-sm">{c.fileName}</p>
                            <p className="text-[10px] text-muted-foreground">{c.date}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Ver Archivo</Button>
                      </div>
                    ))}
                    {consents.length === 0 && (
                      <div className="col-span-full text-center py-10 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">No hay documentos de consentimiento archivados</div>
                    )}
                  </div>
               </Card>
            </TabsContent>

            <TabsContent value="appointments">
               <Card className="border-none shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Agenda del Paciente</h3>
                    <Button size="sm" asChild className="gap-2"><Link href="/appointments"><Plus className="w-4 h-4" /> Programar Cita</Link></Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Médico</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Costo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map(a => (
                        <TableRow key={a.id}>
                          <TableCell className="font-medium">{a.date}</TableCell>
                          <TableCell>{a.time}</TableCell>
                          <TableCell>Dr. {a.doctorName}</TableCell>
                          <TableCell>
                            <Badge variant={a.status === 'Atendido' ? 'default' : 'secondary'}>
                              {a.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold">S/. {a.cost.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      {appointments.length === 0 && (
                        <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No hay citas registradas para este paciente</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
               </Card>
            </TabsContent>

          </Tabs>
        </div>
      </AppLayout>
    </AuthProvider>
  );
}
