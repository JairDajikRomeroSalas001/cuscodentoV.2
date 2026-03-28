import { apiError, apiOk } from '@/lib/api-response';
import { getRequestContext } from '@/lib/request-context';
import { adminService } from '@/services/admin.service';

function resolveStatus(error: unknown): number {
  const message = error instanceof Error ? error.message : 'Error interno';
  if (message.includes('No autorizado')) return 401;
  if (message.includes('Permisos insuficientes')) return 403;
  if (message.includes('no encontrado')) return 404;
  if (message.includes('obligatorio') || message.includes('invalido') || message.includes('clave')) return 400;
  if (message.includes('Unique constraint failed') || message.includes('already exists') || message.includes('ya existe')) return 409;
  return 500;
}

async function getActorOrError() {
  const { clinicId, userId } = await getRequestContext();
  if (!clinicId || !userId) {
    return { error: apiError('No autorizado', 401) };
  }

  const actor = await adminService.getActor(userId, clinicId);
  if (!actor) {
    return { error: apiError('No autorizado', 401) };
  }

  return { actor };
}

export async function GET() {
  try {
    const auth = await getActorOrError();
    if (auth.error) return auth.error;

    const items = await adminService.listUsers(auth.actor);
    return apiOk({ items });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return apiError(message, resolveStatus(error));
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getActorOrError();
    if (auth.error) return auth.error;

    const body = (await request.json()) as Record<string, unknown>;
    const created = await adminService.createUser(auth.actor, {
      username: typeof body.username === 'string' ? body.username : undefined,
      password: typeof body.password === 'string' ? body.password : undefined,
      fullName: typeof body.fullName === 'string' ? body.fullName : undefined,
      dni: typeof body.dni === 'string' ? body.dni : undefined,
      address: typeof body.address === 'string' ? body.address : undefined,
      colegiatura: typeof body.colegiatura === 'string' ? body.colegiatura : undefined,
      role: typeof body.role === 'string' ? (body.role as any) : undefined,
      subscriptionStatus:
        body.subscriptionStatus === 'active' || body.subscriptionStatus === 'suspended' || body.subscriptionStatus === 'blocked'
          ? body.subscriptionStatus
          : undefined,
      nextPaymentDate: typeof body.nextPaymentDate === 'string' ? body.nextPaymentDate : undefined,
      contractStartDate: typeof body.contractStartDate === 'string' ? body.contractStartDate : undefined,
      paymentFrequency: body.paymentFrequency === 'yearly' ? 'yearly' : 'monthly',
      photo: typeof body.photo === 'string' ? body.photo : undefined,
    });

    return apiOk(created, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return apiError(message, resolveStatus(error));
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await getActorOrError();
    if (auth.error) return auth.error;

    const body = (await request.json()) as Record<string, unknown>;
    const id = typeof body.id === 'string' ? body.id : undefined;
    if (!id) {
      return apiError('ID requerido', 400);
    }

    const updated = await adminService.updateUser(auth.actor, {
      id,
      username: typeof body.username === 'string' ? body.username : undefined,
      password: typeof body.password === 'string' ? body.password : undefined,
      fullName: typeof body.fullName === 'string' ? body.fullName : undefined,
      dni: typeof body.dni === 'string' ? body.dni : undefined,
      address: typeof body.address === 'string' ? body.address : undefined,
      colegiatura: typeof body.colegiatura === 'string' ? body.colegiatura : undefined,
      role: typeof body.role === 'string' ? (body.role as any) : undefined,
      subscriptionStatus:
        body.subscriptionStatus === 'active' || body.subscriptionStatus === 'suspended' || body.subscriptionStatus === 'blocked'
          ? body.subscriptionStatus
          : undefined,
      nextPaymentDate: typeof body.nextPaymentDate === 'string' ? body.nextPaymentDate : undefined,
      contractStartDate: typeof body.contractStartDate === 'string' ? body.contractStartDate : undefined,
      paymentFrequency: body.paymentFrequency === 'yearly' ? 'yearly' : 'monthly',
      photo: typeof body.photo === 'string' ? body.photo : undefined,
    });

    return apiOk(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return apiError(message, resolveStatus(error));
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await getActorOrError();
    if (auth.error) return auth.error;

    const body = (await request.json()) as Record<string, unknown>;
    const id = typeof body.id === 'string' ? body.id : undefined;
    if (!id) {
      return apiError('ID requerido', 400);
    }

    const result = await adminService.deleteUser(auth.actor, id);
    return apiOk(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return apiError(message, resolveStatus(error));
  }
}
