
"use client";

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { db, User, PaymentMethod } from '@/lib/db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, ShieldCheck, AlertCircle, User as UserIcon, QrCode, Building2, Plus, Trash2, Camera, Wallet, Eye, Palette, Check, Sun, Moon, Laptop } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

function ProfileContent() {
  const { user, logout, updateUser } = useAuth();
  const { toast } = useToast();
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isChanging, setIsChanging] = useState(false);
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isMethodOpen, setIsMethodOpen] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(user?.primaryColor || '#008080');
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.photo || null);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>(user?.theme || 'light');

  const [newMethod, setNewMethod] = useState<Partial<PaymentMethod>>({ type: 'bank', label: '', value: '', qrImage: '' });

  useEffect(() => {
    if (user?.role === 'admin') loadMethods();
  }, [user]);

  const loadMethods = async () => {
    const all = await db.getAll<PaymentMethod>('payment_methods');
    setPaymentMethods(all);
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const isClinic = user.role === 'clinic';

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast({ variant: 'destructive', title: 'Error', description: 'Las contraseñas nuevas no coinciden.' });
      return;
    }
    if (passwords.current !== user.password) {
      toast({ variant: 'destructive', title: 'Error', description: 'La contraseña actual es incorrecta.' });
      return;
    }
    setIsChanging(true);
    try {
      const updatedUser: User = { ...user, password: passwords.new };
      await db.put('users', updatedUser);
      toast({ title: 'Éxito', description: 'Contraseña actualizada. Su sesión se cerrará en breve.' });
      setTimeout(() => logout(), 2000);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo actualizar la contraseña.' });
    } finally {
      setIsChanging(false);
    }
  };

  const handleSaveTheme = async () => {
    if (!user) return;
    setIsSavingTheme(true);
    try {
      const updatedUser: User = { 
        ...user, 
        primaryColor, 
        photo: photoPreview || undefined,
        theme: selectedTheme 
      };
      await db.put('users', updatedUser);
      updateUser(updatedUser);
      toast({ title: "Cambios Aplicados", description: "La personalización se ha guardado correctamente." });
    } catch (e) {
      toast({ variant: 'destructive', title: "Error", description: "No se pudieron guardar los cambios." });
    } finally {
      setIsSavingTheme(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    const method: PaymentMethod = {
      id: crypto.randomUUID(),
      type: newMethod.type as 'qr' | 'bank',
      label: newMethod.label || '',
      value: newMethod.value || '',
      qrImage: newMethod.qrImage
    };
    await db.put('payment_methods', method);
    setIsMethodOpen(false);
    setNewMethod({ type: 'bank', label: '', value: '', qrImage: '' });
    toast({ title: "Medio de pago agregado" });
    loadMethods();
  };

  const deleteMethod = async (id: string) => {
    if (confirm("¿Eliminar este medio de pago?")) {
      await db.delete('payment_methods', id);
      loadMethods();
    }
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewMethod(prev => ({ ...prev, qrImage: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary">Configuración de Perfil</h2>
            <p className="text-muted-foreground mt-2">Gestiona tu seguridad e identidad visual</p>
          </div>
          {isAdmin && <Badge className="bg-primary/10 text-primary border-primary/20 h-8 px-4 text-xs font-bold uppercase">Administrador</Badge>}
        </div>

        <Tabs defaultValue="security" className="space-y-6">
          <TabsList className="bg-muted p-1 rounded-xl h-auto">
            <TabsTrigger value="security" className="py-2.5 px-6 gap-2"><Lock className="w-4 h-4" /> Seguridad</TabsTrigger>
            <TabsTrigger value="appearance" className="py-2.5 px-6 gap-2"><Palette className="w-4 h-4" /> Personalización</TabsTrigger>
            {isAdmin && <TabsTrigger value="billing" className="py-2.5 px-6 gap-2"><Wallet className="w-4 h-4" /> Medios de Pago</TabsTrigger>}
          </TabsList>

          <TabsContent value="security">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow-sm h-fit">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Cambiar Contraseña</CardTitle></CardHeader>
                <form onSubmit={handleChangePassword}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2"><Label>Contraseña Actual</Label><Input type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} required className="rounded-xl h-11" /></div>
                    <div className="space-y-2"><Label>Nueva Contraseña</Label><Input type="password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} required className="rounded-xl h-11" /></div>
                    <div className="space-y-2"><Label>Confirmar Nueva Contraseña</Label><Input type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} required className="rounded-xl h-11" /></div>
                  </CardContent>
                  <CardFooter><Button type="submit" className="w-full h-12 text-lg font-bold rounded-xl" disabled={isChanging}>{isChanging ? 'Actualizando...' : 'Actualizar Contraseña'}</Button></CardFooter>
                </form>
              </Card>
              <Card className="border-none shadow-sm h-fit">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><UserIcon className="w-5 h-5 text-primary" /> Info de Cuenta</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex justify-between items-center"><span className="text-xs font-bold text-muted-foreground uppercase">Nombre:</span><span className="text-sm font-black">{user.fullName}</span></div>
                    <div className="flex justify-between items-center"><span className="text-xs font-bold text-muted-foreground uppercase">Usuario:</span><span className="text-sm font-black text-primary">{user.username}</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appearance">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow-sm overflow-hidden h-fit">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Palette className="w-5 h-5 text-primary" /> Apariencia</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  {isClinic && (
                    <div className="space-y-4">
                      <Label className="font-bold">Logo del Consultorio</Label>
                      <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-3xl bg-slate-50 dark:bg-slate-900">
                        <div className="w-48 h-20 bg-white rounded-xl shadow-inner border flex items-center justify-center overflow-hidden">
                          {photoPreview ? <img src={photoPreview} className="max-w-full max-h-full object-contain" /> : <Building2 className="w-10 h-10 opacity-20" />}
                        </div>
                        <Input type="file" accept="image/*" onChange={handlePhotoUpload} className="h-10 cursor-pointer" />
                      </div>
                      <div className="space-y-4 mt-6">
                        <Label className="font-bold">Color Primario</Label>
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl shadow-lg border-4 border-white dark:border-slate-800" style={{ backgroundColor: primaryColor }} />
                          <Input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-12 w-full cursor-pointer p-1 rounded-xl" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="space-y-4">
                    <Label className="font-bold">Tema del Sistema</Label>
                    <RadioGroup value={selectedTheme} onValueChange={(v: any) => setSelectedTheme(v)} className="grid grid-cols-3 gap-4">
                      <Label className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", selectedTheme === 'light' && "border-primary")}>
                        <RadioGroupItem value="light" className="sr-only" />
                        <Sun className="mb-3 h-6 w-6" />
                        <span className="text-xs font-bold uppercase tracking-widest">Claro</span>
                      </Label>
                      <Label className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", selectedTheme === 'dark' && "border-primary")}>
                        <RadioGroupItem value="dark" className="sr-only" />
                        <Moon className="mb-3 h-6 w-6" />
                        <span className="text-xs font-bold uppercase tracking-widest">Oscuro</span>
                      </Label>
                      <Label className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", selectedTheme === 'system' && "border-primary")}>
                        <RadioGroupItem value="system" className="sr-only" />
                        <Laptop className="mb-3 h-6 w-6" />
                        <span className="text-xs font-bold uppercase tracking-widest">Sistema</span>
                      </Label>
                    </RadioGroup>
                  </div>
                </CardContent>
                <CardFooter><Button onClick={handleSaveTheme} className="w-full h-12 text-lg font-bold rounded-xl" disabled={isSavingTheme}>{isSavingTheme ? 'Guardando...' : 'Aplicar Cambios'}</Button></CardFooter>
              </Card>
              <Card className="border-none shadow-sm h-fit">
                <CardHeader><CardTitle className="text-lg">Previsualización</CardTitle></CardHeader>
                <CardContent>
                  <div className={cn("border rounded-2xl overflow-hidden shadow-xl", selectedTheme === 'dark' && "dark")}>
                    <div className="h-10 border-b flex items-center px-4 bg-white dark:bg-slate-950">
                      <div className="w-3 h-3 rounded-full bg-red-400 mr-2" /><div className="w-3 h-3 rounded-full bg-amber-400 mr-2" /><div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex h-64 bg-background">
                      <div className="w-16 border-r flex flex-col items-center py-4 gap-4" style={{ backgroundColor: primaryColor + '10' }}>
                         <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: primaryColor }} />
                      </div>
                      <div className="flex-1 p-6 space-y-4">
                         <div className="h-4 w-3/4 rounded" style={{ backgroundColor: primaryColor + '20' }} />
                         <div className="h-10 w-full rounded-xl" style={{ backgroundColor: primaryColor }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="billing">
              <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div><CardTitle className="text-xl">Medios de Pago</CardTitle><CardDescription>Configura los datos para los consultorios.</CardDescription></div>
                  <Button onClick={() => setIsMethodOpen(true)} className="gap-2 h-11"><Plus className="w-5 h-5" /> Agregar</Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paymentMethods.map(m => (
                      <Card key={m.id} className="border-none shadow-sm bg-slate-50 dark:bg-slate-900 relative group">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl text-primary"><QrCode className="w-8 h-8" /></div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-sm uppercase text-slate-400">{m.label}</p>
                              <p className="text-lg font-black break-all">{m.value}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => deleteMethod(m.id)} className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-5 h-5" /></Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      <Dialog open={isMethodOpen} onOpenChange={setIsMethodOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader><DialogTitle className="text-xl font-bold flex items-center gap-2"><Plus className="text-primary w-6 h-6" /> Nuevo Medio de Pago</DialogTitle></DialogHeader>
          <form onSubmit={handleAddMethod} className="space-y-4 py-4">
            <div className="space-y-2"><Label>Tipo</Label><Select value={newMethod.type} onValueChange={v => setNewMethod({...newMethod, type: v as any})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="bank">Banco</SelectItem><SelectItem value="qr">QR</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Entidad</Label><Input value={newMethod.label} onChange={e => setNewMethod({...newMethod, label: e.target.value})} required className="h-11 rounded-xl" /></div>
            <div className="space-y-2"><Label>Valor</Label><Input value={newMethod.value} onChange={e => setNewMethod({...newMethod, value: e.target.value})} required className="h-11 rounded-xl" /></div>
            {newMethod.type === 'qr' && <div className="space-y-2"><Label>Imagen QR</Label><Input type="file" accept="image/*" onChange={handleQrUpload} className="h-11" /></div>}
            <DialogFooter><Button type="submit" className="w-full h-14 text-lg font-bold rounded-2xl">Guardar</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

export default function ProfilePage() {
  return (
    <AuthProvider>
      <ProfileContent />
    </AuthProvider>
  );
}
