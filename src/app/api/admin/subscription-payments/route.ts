import { apiError, apiOk } from '@/lib/api-response';
import { getRequestContext } from '@/lib/request-context';
import { adminService } from '@/services/admin.service';

function resolveStatus(error: unknown): number {
  const message = error instanceof Error ? error.message : 'Error interno';
  if (message.includes('No autorizado')) return 401;
  if (message.includes('Permisos insuficientes')) return 403;
  if (message.includes('no encontrado')) return 404;
  if (message.includes('requerido') || message.includes('invalido')) return 400;
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

    const items = await adminService.listSubscriptionPayments(auth.actor);
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
    const clinicId = typeof body.clinicId === 'string' ? body.clinicId : undefined;
    if (!clinicId) {
      return apiError('clinicId requerido', 400);
    }

    const payment = await adminService.registerSubscriptionPayment(auth.actor, {
      clinicId,
      amount: typeof body.amount === 'number' ? body.amount : undefined,
      installments: typeof body.installments === 'number' ? body.installments : undefined,
      nextPaymentDate: typeof body.nextPaymentDate === 'string' ? body.nextPaymentDate : undefined,
      concept: typeof body.concept === 'string' ? body.concept : undefined,
    });

    return apiOk(payment, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return apiError(message, resolveStatus(error));
  }
}
