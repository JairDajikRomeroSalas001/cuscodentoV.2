import { apiError, apiOk } from '@/lib/api-response';
import { getRequestContext } from '@/lib/request-context';
import { appointmentService } from '@/services/appointment.service';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { clinicId } = await getRequestContext();
    if (!clinicId) return apiError('No autorizado', 401);

    const { id } = await params;
    const appointment = await appointmentService.getById(clinicId, id);

    if (!appointment) return apiError('Cita no encontrada', 404);
    return apiOk(appointment);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return apiError(message, 500);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { clinicId } = await getRequestContext();
    if (!clinicId) return apiError('No autorizado', 401);

    const body = await request.json();
    const status = typeof body?.status === 'string' ? body.status : '';
    if (!status) return apiError('Estado invalido', 400);

    const { id } = await params;
    const updated = await appointmentService.updateStatus(clinicId, id, status);
    return apiOk(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    const status = message === 'Cita no encontrada' ? 404 : 500;
    return apiError(message, status);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { clinicId } = await getRequestContext();
    if (!clinicId) return apiError('No autorizado', 401);

    const { id } = await params;
    const result = await appointmentService.remove(clinicId, id);
    return apiOk(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    const status = message === 'Cita no encontrada' ? 404 : 500;
    return apiError(message, status);
  }
}
