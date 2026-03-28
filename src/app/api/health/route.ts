import { prisma } from '@/lib/prisma';
import { apiError, apiOk } from '@/lib/api-response';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return apiOk({ status: 'ok', timestamp: new Date().toISOString(), database: 'connected' });
  } catch {
    return apiError('No se pudo conectar a la base de datos', 500);
  }
}
