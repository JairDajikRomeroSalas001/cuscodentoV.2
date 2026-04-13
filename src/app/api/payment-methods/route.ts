import { apiOk, apiError } from '@/lib/api-response';
import { getRequestContext } from '@/lib/request-context';
import { prisma } from '@/lib/prisma';

function resolveStatus(error: unknown): number {
  const message = error instanceof Error ? error.message : 'Error interno';
  if (message.includes('No autorizado')) return 401;
  if (message.includes('Permisos insuficientes')) return 403;
  if (message.includes('invalido')) return 400;
  return 500;
}

export async function GET(_: Request) {
  try {
    const rows = await prisma.paymentMethod.findMany({ orderBy: { createdAt: 'asc' } });
    const mapped = (rows || []).map((r) => ({
      id: r.id,
      type: r.qrImage ? 'qr' : 'bank',
      label: r.bank || '',
      value: r.accountNumber || '',
      qrImage: r.qrImage || undefined,
      holder: r.holderName || undefined,
      cci: r.cci || undefined,
    }));
    return apiOk(mapped);
  } catch (error) {
    return apiError('No se pudo leer medios de pago', 500);
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await getRequestContext();
    if (!userId) return apiError('No autorizado', 401);

    const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!actor || actor.role !== 'admin') return apiError('Permisos insuficientes', 403);

    const body = (await request.json()) as Record<string, unknown>;
    const id = String(body.id || crypto.randomUUID());

    const bank = String(body.label || '');
    const accountNumber = String(body.value || '');
    const qrImage = typeof body.qrImage === 'string' ? body.qrImage : null;
    const holderName = typeof body.holder === 'string' ? body.holder : null;
    const cci = typeof body.cci === 'string' ? body.cci : null;

    await prisma.paymentMethod.upsert({
      where: { id },
      create: {
        id,
        bank,
        accountNumber,
        qrImage: qrImage || undefined,
        holderName: holderName || undefined,
        cci: cci || undefined,
      },
      update: {
        bank,
        accountNumber,
        qrImage: qrImage || undefined,
        holderName: holderName || undefined,
        cci: cci || undefined,
      },
    });

    const rows = await prisma.paymentMethod.findMany({ orderBy: { createdAt: 'asc' } });
    const mapped = (rows || []).map((r) => ({
      id: r.id,
      type: r.qrImage ? 'qr' : 'bank',
      label: r.bank || '',
      value: r.accountNumber || '',
      qrImage: r.qrImage || undefined,
      holder: r.holderName || undefined,
      cci: r.cci || undefined,
    }));

    return apiOk(mapped);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error interno';
    return apiError(msg, resolveStatus(error));
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await getRequestContext();
    if (!userId) return apiError('No autorizado', 401);

    const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!actor || actor.role !== 'admin') return apiError('Permisos insuficientes', 403);

    const body = (await request.json()) as { id?: string };
    if (!body || !body.id) return apiError('id invalido', 400);

    await prisma.paymentMethod.deleteMany({ where: { id: body.id } });

    const rows = await prisma.paymentMethod.findMany({ orderBy: { createdAt: 'asc' } });
    const mapped = (rows || []).map((r) => ({
      id: r.id,
      type: r.qrImage ? 'qr' : 'bank',
      label: r.bank || '',
      value: r.accountNumber || '',
      qrImage: r.qrImage || undefined,
      holder: r.holderName || undefined,
      cci: r.cci || undefined,
    }));

    return apiOk(mapped);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error interno';
    return apiError(msg, resolveStatus(error));
  }
}
