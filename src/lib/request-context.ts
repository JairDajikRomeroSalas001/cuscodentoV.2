import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';

export async function getRequestContext() {
  const h = await headers();
  let clinicId = h.get('x-clinic-id');
  let userId = h.get('x-user-id');

  // Fallback para dev/local cuando un proxy no propaga headers inyectados.
  if (!clinicId || !userId) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (token) {
      try {
        const payload = verifyJWT(
          token,
          process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret'
        );
        clinicId = payload.clinic_id;
        userId = payload.user_id;
      } catch {
        // Ignorado: el caller respondera con 401.
      }
    }
  }

  return { clinicId, userId };
}
