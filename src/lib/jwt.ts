import jwt from 'jsonwebtoken';
import type { JwtClaimsDTO } from '@/types/dto';

export type AuthJwtPayload = JwtClaimsDTO;

const DEFAULT_EXPIRATION: jwt.SignOptions['expiresIn'] = '7d';

export function signJWT(
  payload: AuthJwtPayload,
  secret: string,
  expiresIn: jwt.SignOptions['expiresIn'] = DEFAULT_EXPIRATION
): string {
  return jwt.sign(payload, secret, { expiresIn, algorithm: 'HS256' });
}

export function verifyJWT(token: string, secret: string): AuthJwtPayload {
  const decoded = jwt.verify(token, secret);
  if (!decoded || typeof decoded === 'string') {
    throw new Error('Token invalido');
  }

  return {
    sub: String(decoded.sub),
    clinic_id: String(decoded.clinic_id),
    role: String(decoded.role),
  };
}
