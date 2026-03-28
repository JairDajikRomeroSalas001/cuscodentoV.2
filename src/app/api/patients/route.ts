import { CreatePatientSchema } from '@/lib/validators';
import { apiError, apiOk } from '@/lib/api-response';
import { getRequestContext } from '@/lib/request-context';
import { patientService } from '@/services/patient.service';

export async function GET(request: Request) {
  try {
    const { clinicId } = await getRequestContext();
    if (!clinicId) return apiError('No autorizado', 401);

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (q) {
      const data = await patientService.search(clinicId, q);
      return apiOk({ items: data });
    }

    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 20);
    const data = await patientService.getByClinic(clinicId, page, limit);

    return apiOk(data);
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
    const parsed = CreatePatientSchema.safeParse(body);
    if (!parsed.success) {
      return apiError('Datos de paciente invalidos', 400);
    }

    const created = await patientService.create(clinicId, parsed.data);
    return apiOk(created, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    const status = message.includes('DNI ya registrado') ? 400 : 500;
    return apiError(message, status);
  }
}
