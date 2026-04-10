import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = new Set(['/api/health', '/api/auth/login']);

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function buildCsp(nonce: string, isDev: boolean): string {
  const scriptPolicy = isDev
    ? `'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  const connectPolicy = isDev ? `'self' https: http: ws: wss:` : `'self' https:`;

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    `script-src ${scriptPolicy}`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    `connect-src ${connectPolicy}`,
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ');
}

function applySecurityHeaders(response: NextResponse, csp: string): NextResponse {
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  return response;
}

function withSecurityContext(request: NextRequest, nonce: string): Headers {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  return requestHeaders;
}

async function verifyToken(token: string) {
  const secretValue = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret';
  const secret = new TextEncoder().encode(secretValue);
  const { payload } = await jwtVerify(token, secret);

  return {
    user_id: String(payload.sub || ''),
    clinic_id: String(payload.clinic_id || ''),
  };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const nonce = generateNonce();
  const isDev = process.env.NODE_ENV !== 'production';
  const csp = buildCsp(nonce, isDev);
  const requestHeaders = withSecurityContext(request, nonce);

  if (process.env.NODE_ENV === 'production' && pathname === '/_next/webpack-hmr') {
    return applySecurityHeaders(
      NextResponse.json({ error: 'No encontrado', status: 404 }, { status: 404 }),
      csp
    );
  }

  if (!pathname.startsWith('/api/')) {
    return applySecurityHeaders(
      NextResponse.next({ request: { headers: requestHeaders } }),
      csp
    );
  }

  if (PUBLIC_PATHS.has(pathname)) {
    return applySecurityHeaders(
      NextResponse.next({ request: { headers: requestHeaders } }),
      csp
    );
  }

  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    return applySecurityHeaders(
      NextResponse.json({ error: 'No autorizado', status: 401 }, { status: 401 }),
      csp
    );
  }

  try {
    const payload = await verifyToken(token);
    if (!payload.user_id || !payload.clinic_id) {
      return applySecurityHeaders(
        NextResponse.json({ error: 'Token invalido', status: 401 }, { status: 401 }),
        csp
      );
    }

    requestHeaders.set('x-clinic-id', payload.clinic_id);
    requestHeaders.set('x-user-id', payload.user_id);

    return applySecurityHeaders(
      NextResponse.next({
        request: { headers: requestHeaders },
      }),
      csp
    );
  } catch {
    return applySecurityHeaders(
      NextResponse.json({ error: 'Token invalido', status: 401 }, { status: 401 }),
      csp
    );
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
