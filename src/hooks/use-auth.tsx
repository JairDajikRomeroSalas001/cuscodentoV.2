
"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { db, User } from '@/lib/db';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isLoading: boolean;
  lockoutUntil: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciales Maestras solicitadas
const MASTER_ADMINS = [
  { username: 'admin1', password: 'admin1', fullName: 'Administrador Principal' },
  { username: 'admin2', password: 'admin2', fullName: 'Administrador de Soporte' }
];

const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 2 * 60 * 1000; // 2 minutos de bloqueo

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lockoutUntil, setLockoutUntil] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const session = localStorage.getItem('kd_session');
      if (session) {
        try {
          const parsed = JSON.parse(session);
          setUser(parsed);
        } catch (e) {
          localStorage.removeItem('kd_session');
        }
      }

      const storedLockout = localStorage.getItem('kd_lockout_until');
      if (storedLockout) {
        const until = parseInt(storedLockout);
        if (until > Date.now()) {
          setLockoutUntil(until);
        } else {
          localStorage.removeItem('kd_lockout_until');
          localStorage.removeItem('kd_failed_attempts');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const now = Date.now();
    
    // Verificar si el sistema está bloqueado temporalmente
    if (now < lockoutUntil) {
      const remaining = Math.ceil((lockoutUntil - now) / 1000);
      return { 
        success: false, 
        message: `Sistema bloqueado. Reintente en ${remaining} segundos.` 
      };
    }

    // 1. Verificar si es un Administrador Maestro (Credenciales fijas)
    const masterMatch = MASTER_ADMINS.find(ma => ma.username === username && ma.password === password);
    let authenticatedUser: User | null = null;

    if (masterMatch) {
      authenticatedUser = { 
        id: `admin-${username}`, 
        username: masterMatch.username, 
        password: masterMatch.password,
        role: 'admin',
        fullName: masterMatch.fullName,
        status: 'active',
        lastLogin: new Date().toISOString(),
        subscriptionStatus: 'active'
      };
      // Persistir el admin en la base de datos local para reportes
      await db.put('users', authenticatedUser);
    } 
    else {
      // 2. Buscar en la base de datos de consultorios y personal
      const allUsers = await db.getAll<User>('users');
      const foundUser = allUsers.find(u => u.username === username && u.password === password);
      
      if (foundUser) {
        // Protección: Solo los masters pueden loguearse como admin si no están en la lista fija
        if (foundUser.role === 'admin' && !MASTER_ADMINS.some(m => m.username === username)) {
          return { success: false, message: 'Acceso Denegado: Credenciales no autorizadas.' };
        }

        if (foundUser.subscriptionStatus === 'blocked') {
          return { success: false, message: 'Cuenta Bloqueada. Contacte a soporte.' };
        }
        
        authenticatedUser = { 
          ...foundUser, 
          status: 'active', 
          lastLogin: new Date().toISOString() 
        };
        
        await db.put('users', authenticatedUser);
      }
    }

    if (authenticatedUser) {
      // Éxito en el login
      setUser(authenticatedUser);
      localStorage.setItem('kd_session', JSON.stringify(authenticatedUser));
      localStorage.removeItem('kd_failed_attempts');
      localStorage.removeItem('kd_lockout_until');
      setLockoutUntil(0);
      return { success: true };
    }
    
    // Gestión de intentos fallidos y bloqueo
    const attempts = parseInt(localStorage.getItem('kd_failed_attempts') || '0') + 1;
    localStorage.setItem('kd_failed_attempts', attempts.toString());

    if (attempts >= MAX_ATTEMPTS) {
      const lockUntil = Date.now() + LOCKOUT_MS;
      localStorage.setItem('kd_lockout_until', lockUntil.toString());
      setLockoutUntil(lockUntil);
      return { 
        success: false, 
        message: 'Demasiados intentos fallidos. Bloqueo de seguridad activado por 2 min.' 
      };
    }

    return { 
      success: false, 
      message: `Credenciales incorrectas. Intento ${attempts} de ${MAX_ATTEMPTS}.` 
    };
  };

  const logout = async () => {
    if (user) {
      const updatedUser = { ...user, status: 'inactive' };
      await db.put('users', updatedUser);
    }
    setUser(null);
    localStorage.removeItem('kd_session');
    router.push('/login');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('kd_session', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading, lockoutUntil }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
