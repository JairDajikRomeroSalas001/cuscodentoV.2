import { cookies } from 'next/headers';
import { apiError, apiOk } from '@/lib/api-response';
import { signJWT, verifyJWT } from '@/lib/jwt';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return apiError('No autorizado', 401);
    }

    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret';
    const payload = verifyJWT(token, secret);
    const nextToken = signJWT(payload, secret);

    const response = apiOk({ refreshed: true });
    response.cookies.set('auth_token', nextToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch {
    return apiError('Token invalido', 401);
  }
}
