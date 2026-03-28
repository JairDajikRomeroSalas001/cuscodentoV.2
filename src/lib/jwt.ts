import jwt from 'jsonwebtoken';

export interface AuthJwtPayload {
  user_id: string;
  clinic_id: string;
  role: string;
  email: string;
}

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
    user_id: String(decoded.user_id),
    clinic_id: String(decoded.clinic_id),
    role: String(decoded.role),
    email: String(decoded.email),
  };
}
