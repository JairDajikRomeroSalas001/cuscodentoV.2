import { getRequestContext } from '@/lib/request-context';
import { apiError, apiErrorFromUnknown, apiOk } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/hash';
import { z } from 'zod';

const VerifyPasswordSchema = z.object({ password: z.string().min(8) });

export async function POST(request: Request) {
  try {
    const { clinicId, userId } = await getRequestContext();
    if (!clinicId || !userId) return apiError('No autorizado', 401);

    const body = await request.json();
    const parsed = VerifyPasswordSchema.safeParse(body);
    if (!parsed.success) return apiError('Datos invalidos', 400);

    const { password } = parsed.data;

    const user = await prisma.user.findFirst({ where: { id: userId, clinic_id: clinicId } });
    if (!user || !user.password_hash) return apiError('No se pudo verificar la contraseña', 400);

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) return apiError('Contraseña incorrecta', 401);

    return apiOk({ valid: true });
  } catch (error) {
    return apiErrorFromUnknown(error, 500, 'api/auth/verify-password#post');
  }
}
