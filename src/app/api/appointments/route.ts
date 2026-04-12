import { CreateAppointmentSchema } from '@/lib/validators';
import { apiError, apiErrorFromUnknown, apiOk } from '@/lib/api-response';
import { getRequestContext } from '@/lib/request-context';
import { appointmentService } from '@/services/appointment.service';
import type { AppointmentsListView } from '@/types/dto';

function resolveAppointmentsView(value: string | null): AppointmentsListView {
  return value === 'billing' ? 'billing' : 'calendar';
}

export async function GET(request: Request) {
  try {
    const { clinicId } = await getRequestContext();
    if (!clinicId) return apiError('No autorizado', 401);

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    const patientId = searchParams.get('patient_id');
    const view = resolveAppointmentsView(searchParams.get('view'));

    const items = await appointmentService.getByClinic(clinicId, date, status, patientId, view);
    return apiOk({ items });
  } catch (error) {
    return apiErrorFromUnknown(error, 500, 'api/appointments#get');
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

    // Normalizar fecha recibida (YYYY-MM-DD) a un instante seguro (mediodía UTC)
    // para evitar desfaces por zonas horarias al guardar y mostrar la fecha.
    const payload = parsed.data as unknown as { date: string } & Record<string, any>;
    const parts = payload.date.split('-').map((s: string) => parseInt(s, 10));
    if (parts.length !== 3 || parts.some(isNaN)) {
      return apiError('Formato de fecha invalido', 400);
    }
    const [y, m, d] = parts;
    const normalizedDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));

    const createData = {
      patient_id: payload.patient_id,
      doctor_id: payload.doctor_id,
      treatment_id: payload.treatment_id,
      date: normalizedDate,
      time: payload.time,
      cost: payload.cost,
      status: payload.status,
      observations: typeof payload.observations === 'string' ? payload.observations : undefined,
    };

    const created = await appointmentService.create(clinicId, createData as any);
    return apiOk(created, 201);
  } catch (error) {
    return apiErrorFromUnknown(error, 500, 'api/appointments#post');
  }
}
