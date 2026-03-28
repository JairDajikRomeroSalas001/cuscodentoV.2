import { AddPaymentHistorySchema } from '@/lib/validators';
import { apiError, apiOk } from '@/lib/api-response';
import { getRequestContext } from '@/lib/request-context';
import { paymentService } from '@/services/payment.service';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { clinicId } = await getRequestContext();
    if (!clinicId) return apiError('No autorizado', 401);

    const { id } = await params;
    const payment = await paymentService.getById(clinicId, id);
    if (!payment) return apiError('Pago no encontrado', 404);

    return apiOk({ items: payment.payment_histories, payment });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return apiError(message, 500);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { clinicId, userId } = await getRequestContext();
    if (!clinicId || !userId) return apiError('No autorizado', 401);

    const rl = await rateLimit(userId, 'payment_history_create', 20, 60);
    if (!rl.success) {
      return apiError('Demasiadas solicitudes de abono. Intente mas tarde.', 429);
    }

    const body = await request.json();
    const parsed = AddPaymentHistorySchema.safeParse(body);
    if (!parsed.success) {
      return apiError('Datos de abono invalidos', 400);
    }

    const { id } = await params;
    const updated = await paymentService.addPaymentHistory(clinicId, id, parsed.data);
    return apiOk(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    const status = message === 'Pago no encontrado' ? 404 : 500;
    return apiError(message, status);
  }
}
