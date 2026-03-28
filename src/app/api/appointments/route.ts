import { CreateAppointmentSchema } from '@/lib/validators';
import { apiError, apiOk } from '@/lib/api-response';
import { getRequestContext } from '@/lib/request-context';
import { appointmentService } from '@/services/appointment.service';

export async function GET(request: Request) {
  try {
    const { clinicId } = await getRequestContext();
    if (!clinicId) return apiError('No autorizado', 401);

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const status = searchParams.get('status');

    const items = await appointmentService.getByClinic(clinicId, date, status);
    return apiOk({ items });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return apiError(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const { clinicId } = await getRequestContext();
    if (!clinicId) return apiError('No autorizado', 401);

    const body = await request.json();
    const parsed = CreateAppointmentSchema.safeParse(body);
    if (!parsed.success) {
      return apiError('Datos de cita invalidos', 400);
    }

    const created = await appointmentService.create(clinicId, parsed.data);
    return apiOk(created, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return apiError(message, 500);
  }
}
