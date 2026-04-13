const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Buscar o crear la clínica demo.local
  const clinic = await prisma.clinic.upsert({
    where: { domain: 'demo.local' },
    update: {},
    create: {
      name: 'Demo Clinic',
      domain: 'demo.local',
      subscription_status: 'active',
      subscription_tier: 'basic',
    },
  });

  const hash = await bcrypt.hash('Admin12345', 12);

  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {
      clinic_id: clinic.id,
      password_hash: hash,
      status: 'active',
      role: 'admin',
      full_name: 'Administrador General',
    },
    create: {
      clinic_id: clinic.id,
      email: 'admin@demo.com',
      password_hash: hash,
      status: 'active',
      role: 'admin',
      full_name: 'Administrador General',
    },
  });

  console.log('SEED_ADMIN_OK', clinic.id);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
