import { apiOk } from '@/lib/api-response';

export async function POST() {
  const response = apiOk({ message: 'logged out' });
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
