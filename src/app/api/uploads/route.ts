import { apiOk, apiError, apiErrorFromUnknown } from '@/lib/api-response';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file') as unknown;

    if (!file || typeof (file as any).name !== 'string') {
      return apiError('Archivo no proporcionado', 400);
    }

    const name = (file as any).name as string;
    const contentType = (file as any).type as string | undefined;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (contentType && !allowed.includes(contentType)) {
      return apiError('Tipo de archivo no permitido', 400);
    }

    const arrayBuffer = await (file as any).arrayBuffer();
    const size = arrayBuffer.byteLength;
    if (size > 2 * 1024 * 1024) return apiError('Archivo demasiado grande', 400);

    const ext = path.extname(name).toLowerCase() || (contentType === 'image/png' ? '.png' : '.jpg');
    const base = path.basename(name, ext).replace(/[^\w\d-_]/g, '_').slice(0, 50);
    const filename = `${Date.now()}-${base}${ext}`;

    const outDir = path.join(process.cwd(), 'public', 'files');
    await fs.mkdir(outDir, { recursive: true });
    const outPath = path.join(outDir, filename);

    await fs.writeFile(outPath, Buffer.from(arrayBuffer));

    const url = `/files/${filename}`;
    return apiOk({ url }, 201);
  } catch (error) {
    return apiErrorFromUnknown(error, 500, 'api/uploads.POST');
  }
}
