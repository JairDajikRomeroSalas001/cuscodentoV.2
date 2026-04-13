import { getRequestContext } from '@/lib/request-context';
import { apiError, apiErrorFromUnknown, apiOk } from '@/lib/api-response';
import { authService } from '@/services/auth.service';

export async function GET() {
  try {
    const { clinicId, userId } = await getRequestContext();
    if (!clinicId || !userId) {
      return apiError('No autorizado', 401);
    }

    const data = await authService.me(userId, clinicId);
    return apiOk(data);
  } catch (error) {
    return apiErrorFromUnknown(error, 500, 'api/auth/me#get');
  }
}
