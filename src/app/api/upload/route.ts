import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No se envió archivo' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    const filePath = path.join(process.cwd(), 'public', 'files', fileName);
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/files/${fileName}`;
    return NextResponse.json({ url: fileUrl, name: file.name, size: file.size, type: file.type });
  } catch (error) {
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 });
  }
}
