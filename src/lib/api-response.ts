import { NextResponse } from 'next/server';
import { getErrorMessage, logSanitizedError, toClientSafeMessage } from '@/lib/error-sanitizer';

export function apiError(message: string, status: number) {
  const safeMessage = toClientSafeMessage(message, status);
  return NextResponse.json({ error: safeMessage, status }, { status });
}

export function apiOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function apiErrorFromUnknown(
  error: unknown,
  status = 500,
  context = 'api',
  fallback = 'Error interno'
) {
  logSanitizedError(context, error);
  const message = getErrorMessage(error, fallback);
  return apiError(message, status);
}
