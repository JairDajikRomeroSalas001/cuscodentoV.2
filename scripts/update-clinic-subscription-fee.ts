import { prisma } from '../src/lib/prisma';

async function main() {
  const clinicIdArg = process.argv[2];

  const clinic = clinicIdArg
    ? await prisma.clinic.findUnique({
        where: { id: clinicIdArg },
        select: { id: true, name: true, subscription_fee: true },
      })
    : await prisma.clinic.findFirst({
        select: { id: true, name: true, subscription_fee: true },
        orderBy: { created_at: 'asc' },
      });

  if (!clinic) {
    throw new Error(
      clinicIdArg
        ? `No se encontró consultorio con id: ${clinicIdArg}`
        : 'No hay consultorios registrados en la base de datos.'
    );
  }

  console.log('1) Consultorio leído:', {
    id: clinic.id,
    name: clinic.name,
    subscription_fee: clinic.subscription_fee.toString(),
  });

  const updated = await prisma.clinic.update({
    where: { id: clinic.id },
    data: { subscription_fee: 100 },
    select: { id: true, name: true, subscription_fee: true },
  });

  const isSuccess = Number(updated.subscription_fee.toString()) === 100;

  if (!isSuccess) {
    throw new Error(
      `La actualización no aplicó correctamente. Valor actual: ${updated.subscription_fee.toString()}`
    );
  }

  console.log('2) Operación exitosa: subscription_fee actualizado a 100', {
    id: updated.id,
    name: updated.name,
    subscription_fee: updated.subscription_fee.toString(),
  });
}

main()
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error(`3) Error exacto: ${error.name}: ${error.message}`);
    } else {
      console.error(`3) Error exacto: ${JSON.stringify(error)}`);
    }
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Prisma desconectado.');
  });
