import { apiError, apiOk } from '@/lib/api-response';
import { getRequestContext } from '@/lib/request-context';
import { adminService } from '@/services/admin.service';

function resolveStatus(error: unknown): number {
  const message = error instanceof Error ? error.message : 'Error interno';
  if (message.includes('No autorizado')) return 401;
  if (message.includes('Permisos insuficientes')) return 403;
  return 500;
}

export async function GET() {
  try {
    const { clinicId, userId } = await getRequestContext();
    if (!clinicId || !userId) {
      return apiError('No autorizado', 401);
    }

    const actor = await adminService.getActor(userId, clinicId);
    if (!actor) {
      return apiError('No autorizado', 401);
    }

    const data = await adminService.getReports(actor);
    return apiOk(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return apiError(message, resolveStatus(error));
  }
}
