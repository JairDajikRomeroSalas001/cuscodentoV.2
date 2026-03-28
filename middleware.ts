import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = new Set(['/api/health', '/api/auth/login']);

async function verifyToken(token: string) {
  const secretValue = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret';
  const secret = new TextEncoder().encode(secretValue);
  const { payload } = await jwtVerify(token, secret);

  return {
    user_id: String(payload.user_id || ''),
    clinic_id: String(payload.clinic_id || ''),
  };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'No autorizado', status: 401 }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token);
    if (!payload.user_id || !payload.clinic_id) {
      return NextResponse.json({ error: 'Token invalido', status: 401 }, { status: 401 });
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-clinic-id', payload.clinic_id);
    requestHeaders.set('x-user-id', payload.user_id);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch {
    return NextResponse.json({ error: 'Token invalido', status: 401 }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/:path*'],
};
