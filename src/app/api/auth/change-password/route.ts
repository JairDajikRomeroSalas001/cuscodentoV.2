import { getRequestContext } from '@/lib/request-context';
import { apiError, apiErrorFromUnknown, apiOk } from '@/lib/api-response';
import { ChangePasswordSchema } from '@/lib/validators';
import { prisma } from '@/lib/prisma';
import { verifyPassword, hashPassword } from '@/lib/hash';

export async function POST(request: Request) {
  try {
    const { clinicId, userId } = await getRequestContext();
    if (!clinicId || !userId) return apiError('No autorizado', 401);

    const body = await request.json();
    const parsed = ChangePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return apiError('Datos invalidos', 400);
    }

    const { current_password, new_password } = parsed.data;

    const user = await prisma.user.findFirst({ where: { id: userId, clinic_id: clinicId } });
    if (!user || !user.password_hash) {
      return apiError('No se pudo verificar la contraseña actual', 400);
    }

    const valid = await verifyPassword(current_password, user.password_hash);
    if (!valid) return apiError('Contraseña actual incorrecta', 401);

    const newHash = await hashPassword(new_password);
    await prisma.user.update({ where: { id: user.id }, data: { password_hash: newHash } });

    return apiOk({ message: 'Contraseña actualizada' });
  } catch (error) {
    return apiErrorFromUnknown(error, 500, 'api/auth/change-password#post');
  }
}
