import { createHash } from 'crypto';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

type HashAlgorithm = 'sha256' | 'sha384' | 'sha512';

function printUsage(): void {
  console.log('Uso: npm run security:sri -- <url-o-ruta> [--algo sha384] [--tag script|link]');
  console.log('Ejemplo: npm run security:sri -- https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js');
}

function parseArgs(args: string[]): { source?: string; algo: HashAlgorithm; tag: 'script' | 'link' } {
  const source = args[0];
  let algo: HashAlgorithm = 'sha384';
  let tag: 'script' | 'link' = 'script';

  for (let i = 1; i < args.length; i += 1) {
    const token = args[i];
    if (token === '--algo' && args[i + 1]) {
      const next = args[i + 1] as HashAlgorithm;
      if (next === 'sha256' || next === 'sha384' || next === 'sha512') {
        algo = next;
      }
      i += 1;
      continue;
    }
    if (token === '--tag' && args[i + 1]) {
      const next = args[i + 1];
      if (next === 'script' || next === 'link') {
        tag = next;
      }
      i += 1;
    }
  }

  return { source, algo, tag };
}

async function getBytes(source: string): Promise<Buffer> {
  if (/^https?:\/\//i.test(source)) {
    const response = await fetch(source, { redirect: 'follow' });
    if (!response.ok) {
      throw new Error(`No se pudo descargar recurso: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  const filePath = resolve(process.cwd(), source);
  return readFile(filePath);
}

function buildSnippet(tag: 'script' | 'link', source: string, integrity: string): string {
  if (tag === 'link') {
    return `<link rel="stylesheet" href="${source}" integrity="${integrity}" crossorigin="anonymous" />`;
  }

  return `<script src="${source}" integrity="${integrity}" crossorigin="anonymous"></script>`;
}

async function main(): Promise<void> {
  const { source, algo, tag } = parseArgs(process.argv.slice(2));
  if (!source) {
    printUsage();
    process.exit(1);
  }

  const bytes = await getBytes(source);
  const hash = createHash(algo).update(bytes).digest('base64');
  const integrity = `${algo}-${hash}`;

  console.log('\nIntegrity:');
  console.log(integrity);
  console.log('\nSnippet:');
  console.log(buildSnippet(tag, source, integrity));
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Error inesperado generando SRI';
  console.error(message);
  process.exit(1);
});
