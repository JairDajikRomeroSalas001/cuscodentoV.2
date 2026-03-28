import { CreatePaymentSchema } from '@/lib/validators';
import { apiError, apiOk } from '@/lib/api-response';
import { getRequestContext } from '@/lib/request-context';
import { paymentService } from '@/services/payment.service';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: Request) {
  try {
    const { clinicId } = await getRequestContext();
    if (!clinicId) return apiError('No autorizado', 401);

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patient_id');
    const paymentStatus = searchParams.get('status');

    const items = await paymentService.getByClinic(clinicId, patientId, paymentStatus);
    return apiOk({ items });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return apiError(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const { clinicId, userId } = await getRequestContext();
    if (!clinicId || !userId) return apiError('No autorizado', 401);

    const rl = await rateLimit(userId, 'payment_create', 10, 60);
    if (!rl.success) {
      return apiError('Demasiadas solicitudes de pago. Intente mas tarde.', 429);
    }

    const body = await request.json();
    const parsed = CreatePaymentSchema.safeParse(body);
    if (!parsed.success) {
      return apiError('Datos de pago invalidos', 400);
    }

    const created = await paymentService.createPayment(clinicId, parsed.data);
    return apiOk(created, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    const status = message === 'Paciente no encontrado' || message === 'Cita no encontrada' ? 404 : 500;
    return apiError(message, status);
  }
}
