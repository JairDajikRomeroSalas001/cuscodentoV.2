import { NextResponse } from 'next/server';
import { LoginSchema } from '@/lib/validators';
import { apiError, apiOk } from '@/lib/api-response';
import { authService } from '@/services/auth.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return apiError('Datos de login invalidos', 400);
    }

    const result = await authService.login(parsed.data);

    const response = apiOk({ user: result.user, clinic: result.clinic });
    response.cookies.set('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    const status = message === 'Credenciales invalidas' ? 401 : 500;
    return apiError(message, status);
  }
}
