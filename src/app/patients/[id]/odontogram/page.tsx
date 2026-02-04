"use client";

import { useState, useEffect, use } from 'react';
import { AuthProvider } from '@/hooks/use-auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { db, Patient, Odontogram } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, RotateCcw, Info } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Definición de estados de los dientes
const TOOTH_STATES = [
  { id: 'none', label: 'Sano', color: 'bg-white', stroke: 'stroke-slate-300' },
  { id: 'caries', label: 'Caries', color: 'bg-red-500', stroke: 'stroke-red-700' },
  { id: 'obturado', label: 'Obturado', color: 'bg-blue-500', stroke: 'stroke-blue-700' },
  { id: 'ausente', label: 'Ausente', color: 'bg-slate-800', stroke: 'stroke-slate-900' },
  { id: 'corona', label: 'Corona', color: 'bg-amber-500', stroke: 'stroke-amber-700' },
  { id: 'protesis', label: 'Prótesis', color: 'bg-purple-500', stroke: 'stroke-purple-700' },
];

function Tooth({ id, state, onClick }: { id: number, state: string, onClick: (id: number) => void }) {
  const currentState = TOOTH_STATES.find(s => s.id === state) || TOOTH_STATES[0];

  return (
    <div 
      className="flex flex-col items-center gap-1 cursor-pointer group" 
      onClick={() => onClick(id)}
    >
      <span className="text-[10px] font-bold group-hover:text-primary transition-colors">{id}</span>
      <div className={`w-10 h-12 border-2 rounded-t-lg rounded-b-sm shadow-sm transition-all flex items-center justify-center ${currentState.color} ${currentState.stroke} group-hover:scale-105`}>
        {state === 'caries' && <div className="w-3 h-3 rounded-full bg-white/30 animate-pulse" />}
        {state === 'ausente' && <div className="w-full h-[2px] bg-white/20 rotate-45" />}
        {state === 'corona' && <div className="w-6 h-1 bg-white/40 absolute top-2" />}
      </div>
    </div>
  );
}

export default function OdontogramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [toothStates, setToothStates] = useState<Record<number, string>>({});
  const [selectedState, setSelectedState] = useState<string>('caries');

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    const p = await db.getById<Patient>('patients', id);
    if (p) setPatient(p);

    const ods = await db.getAll<Odontogram>('odontograms');
    // Buscamos el odontograma más reciente para este paciente
    const patientOdontograms = ods.filter(o => o.patientId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (patientOdontograms.length > 0) {
      setToothStates(patientOdontograms[0].data);
    }
  };

  const handleToothClick = (toothId: number) => {
    const current = toothStates[toothId] || 'none';
    // Si ya tiene el estado seleccionado, lo resetea a sano, si no, aplica el seleccionado
    const newState = current === selectedState ? 'none' : selectedState;
    setToothStates({ ...toothStates, [toothId]: newState });
  };

  const handleSave = async () => {
    const od: Odontogram = {
      id: crypto.randomUUID(),
      patientId: id,
      data: toothStates,
      date: new Date().toISOString(), // Usar ISO para ordenar correctamente
    };
    await db.put('odontograms', od);
    toast({ 
      title: "Odontograma Guardado", 
      description: "El estado dental del paciente ha sido actualizado correctamente." 
    });
  };

  const resetOdontogram = () => {
    if (confirm("¿Está seguro de limpiar el odontograma? Esto no borrará el historial guardado anteriormente.")) {
      setToothStates({});
    }
  };

  if (!patient) return null;

  // Sistema FDI (Cuadrantes 1, 2, 3, 4)
  const quadrant1 = [18, 17, 16, 15, 14, 13, 12, 11];
  const quadrant2 = [21, 22, 23, 24, 25, 26, 27, 28];
  const quadrant4 = [48, 47, 46, 45, 44, 43, 42, 41];
  const quadrant3 = [31, 32, 33, 34, 35, 36, 37, 38];

  return (
    <AuthProvider>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon">
                <Link href={`/patients/${id}`}><ChevronLeft /></Link>
              </Button>
              <div>
                <h2 className="text-3xl font-bold text-primary">Odontograma Interactivo</h2>
                <p className="text-muted-foreground">Paciente: <span className="font-bold text-foreground">{patient.lastNames}, {patient.names}</span></p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
               <Button variant="outline" onClick={resetOdontogram} className="gap-2">
                 <RotateCcw className="w-4 h-4" /> Reiniciar
               </Button>
               <Button onClick={handleSave} className="gap-2 bg-primary hover:bg-primary/90">
                 <Save className="w-5 h-5" />
                 Guardar Estado Actual
               </Button>
            </div>
          </div>

          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  Herramientas de Diagnóstico
                </CardTitle>
                <div className="flex items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
                  <span className="text-sm font-medium text-muted-foreground px-2">Estado a aplicar:</span>
                  <div className="flex gap-2">
                    {TOOTH_STATES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedState(s.id)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border-2 ${selectedState === s.id ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${s.color} border shadow-inner`} />
                          {s.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-12">
              {/* Arcada Superior */}
              <div className="space-y-4">
                <h3 className="text-center font-bold text-muted-foreground text-sm uppercase tracking-wider">Arcada Superior</h3>
                <div className="flex justify-center items-end gap-1 md:gap-3 overflow-x-auto pb-4">
                  <div className="flex gap-1 md:gap-2">
                    {quadrant1.map(t => (
                      <Tooth key={t} id={t} state={toothStates[t] || 'none'} onClick={handleToothClick} />
                    ))}
                  </div>
                  <div className="w-1 md:w-4 border-r-2 border-dashed border-primary/20 h-16 self-center mx-2" />
                  <div className="flex gap-1 md:gap-2">
                    {quadrant2.map(t => (
                      <Tooth key={t} id={t} state={toothStates[t] || 'none'} onClick={handleToothClick} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Arcada Inferior */}
              <div className="space-y-4">
                <h3 className="text-center font-bold text-muted-foreground text-sm uppercase tracking-wider">Arcada Inferior</h3>
                <div className="flex justify-center items-start gap-1 md:gap-3 overflow-x-auto pb-4">
                  <div className="flex gap-1 md:gap-2">
                    {quadrant4.map(t => (
                      <Tooth key={t} id={t} state={toothStates[t] || 'none'} onClick={handleToothClick} />
                    ))}
                  </div>
                  <div className="w-1 md:w-4 border-r-2 border-dashed border-primary/20 h-16 self-center mx-2" />
                  <div className="flex gap-1 md:gap-2">
                    {quadrant3.map(t => (
                      <Tooth key={t} id={t} state={toothStates[t] || 'none'} onClick={handleToothClick} />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-none shadow-sm">
               <h4 className="font-bold mb-4 flex items-center gap-2">
                 <Info className="w-4 h-4 text-primary" />
                 Instrucciones de Uso
               </h4>
               <ul className="text-sm space-y-2 text-muted-foreground">
                 <li>1. Seleccione un estado clínico de la barra superior (ej. Caries).</li>
                 <li>2. Haga clic en el diente correspondiente para aplicar el estado.</li>
                 <li>3. Haga clic nuevamente en un diente marcado para quitar el estado y volver a "Sano".</li>
                 <li>4. Pulse "Guardar" para registrar los cambios en la historia clínica del paciente.</li>
               </ul>
            </Card>

            <Card className="p-6 border-none shadow-sm">
               <h4 className="font-bold mb-4">Resumen de Hallazgos</h4>
               <div className="flex flex-wrap gap-4">
                  {TOOTH_STATES.filter(s => s.id !== 'none').map(s => {
                    const count = Object.values(toothStates).filter(v => v === s.id).length;
                    if (count === 0) return null;
                    return (
                      <div key={s.id} className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full text-xs">
                        <div className={`w-3 h-3 rounded-full ${s.color}`} />
                        <span className="font-bold">{s.label}:</span> {count}
                      </div>
                    );
                  })}
                  {Object.values(toothStates).filter(v => v !== 'none').length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No se han registrado hallazgos clínicos aún.</p>
                  )}
               </div>
            </Card>
          </div>
        </div>
      </AppLayout>
    </AuthProvider>
  );
}
