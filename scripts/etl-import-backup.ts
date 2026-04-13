import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

interface BackupData {
  clinics?: any[];
  users?: any[];
  patients?: any[];
  treatments?: any[];
  appointments?: any[];
  payments?: any[];
}

interface ETLReport {
  timestamp: string;
  status: 'success' | 'partial' | 'error';
  stats: {
    clinics_imported: number;
    users_imported: number;
    patients_imported: number;
    treatments_imported: number;
    appointments_imported: number;
    payments_imported: number;
  };
  errors: string[];
  warnings: string[];
  validations: {
    users_have_password: number;
    users_have_clinic: number;
    patients_have_clinic: number;
    dni_unique_per_clinic: number;
    appointments_have_relations: number;
    payments_have_relations: number;
  };
}

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function validateBackup(data: BackupData): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  if (!data.clinics || data.clinics.length === 0) {
    errors.push('No clinics found in backup');
  }

  if (!data.users || data.users.length === 0) {
    errors.push('No users found in backup');
  }

  // Validar que cada usuario tiene clínica
  data.users?.forEach((user, idx) => {
    if (!user.clinic_id && !user.clinicId) {
      errors.push(`User ${idx} (${user.email}) has no clinic reference`);
    }
  });

  // Validar que pacientes tienen clínica
  data.patients?.forEach((patient, idx) => {
    if (!patient.clinic_id && !patient.clinicId) {
      errors.push(`Patient ${idx} (${patient.full_name}) has no clinic reference`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

async function importClinics(data: BackupData): Promise<Map<string, string>> {
  console.log('\n📋 Importando clínicas...');
  const clinicMap = new Map<string, string>(); // old_id -> new_id

  if (!data.clinics || data.clinics.length === 0) {
    console.log('   ⚠️  No clinics to import');
    return clinicMap;
  }

  for (const clinic of data.clinics) {
    try {
      const oldId = clinic.id || clinic._id;
      const existing = await prisma.clinic.findFirst({
        where: { domain: clinic.domain },
      });

      if (existing) {
        console.log(`   ✅ Clinic ${clinic.name} already exists (${existing.id})`);
        clinicMap.set(oldId, existing.id);
        continue;
      }

      const created = await prisma.clinic.create({
        data: {
          name: clinic.name || 'Imported Clinic',
          domain: clinic.domain || `clinic-${Date.now()}`,
          subscription_status: clinic.subscription_status || 'active',
          subscription_tier: clinic.subscription_tier || 'basic',
        },
      });

      clinicMap.set(oldId, created.id);
      console.log(`   ✅ Clinic "${created.name}" imported → ${created.id}`);
    } catch (err: any) {
      console.error(`   ❌ Error importing clinic: ${err.message}`);
      throw err;
    }
  }

  return clinicMap;
}

async function importUsers(data: BackupData, clinicMap: Map<string, string>): Promise<Map<string, string>> {
  console.log('\n👥 Importando usuarios...');
  const userMap = new Map<string, string>();

  if (!data.users || data.users.length === 0) {
    console.log('   ⚠️  No users to import');
    return userMap;
  }

  for (const user of data.users) {
    try {
      const oldId = user.id || user._id;
      const clinicId = clinicMap.get(user.clinic_id || user.clinicId);

      if (!clinicId) {
        console.warn(
          `   ⚠️  Skipping user ${user.email} - clinic not found (${user.clinic_id || user.clinicId})`
        );
        continue;
      }

      const existing = await prisma.user.findFirst({
        where: { email: user.email },
      });

      if (existing) {
        console.log(`   ⚠️  User ${user.email} already exists`);
        userMap.set(oldId, existing.id);
        continue;
      }

      const password_hash = user.password_hash
        ? user.password_hash.startsWith('$2') // bcrypt hash check
          ? user.password_hash
          : await hashPassword(user.password || 'TempPassword123!')
        : await hashPassword('TempPassword123!');

      const created = await prisma.user.create({
        data: {
          email: user.email,
          full_name: user.full_name || user.fullName || 'Imported User',
          password_hash,
          role: user.role || 'doctor',
          status: user.status || 'active',
          clinic_id: clinicId,
        },
      });

      userMap.set(oldId, created.id);
      console.log(`   ✅ User ${user.email} imported → ${created.id}`);
    } catch (err: any) {
      console.error(`   ❌ Error importing user: ${err.message}`);
      throw err;
    }
  }

  return userMap;
}

async function importPatients(
  data: BackupData,
  clinicMap: Map<string, string>
): Promise<Map<string, string>> {
  console.log('\n🏥 Importando pacientes...');
  const patientMap = new Map<string, string>();

  if (!data.patients || data.patients.length === 0) {
    console.log('   ⚠️  No patients to import');
    return patientMap;
  }

  for (const patient of data.patients) {
    try {
      const oldId = patient.id || patient._id;
      const clinicId = clinicMap.get(patient.clinic_id || patient.clinicId);

      if (!clinicId) {
        console.warn(
          `   ⚠️  Skipping patient ${patient.full_name} - clinic not found`
        );
        continue;
      }

      // Validar DNI único por clínica
      const existing = await prisma.patient.findFirst({
        where: {
          clinic_id: clinicId,
          dni: patient.dni,
        },
      });

      if (existing) {
        console.log(`   ⚠️  Patient DNI ${patient.dni} already exists in clinic`);
        patientMap.set(oldId, existing.id);
        continue;
      }

      const created = await prisma.patient.create({
        data: {
          clinic_id: clinicId,
          dni: patient.dni,
          full_name: patient.full_name || patient.fullName || 'Imported Patient',
          phone: patient.phone || '',
          address: patient.address || '',
          email: patient.email || null,
          first_name: patient.first_name || patient.firstName || undefined,
          last_name: patient.last_name || patient.lastName || undefined,
          city: patient.city || undefined,
          state: patient.state || undefined,
          postal_code: patient.postal_code || patient.postalCode || undefined,
          gender: patient.gender || undefined,
          medical_observations: patient.medical_observations || patient.medicalObservations || undefined,
        },
      });

      patientMap.set(oldId, created.id);
      console.log(`   ✅ Patient ${patient.full_name} (DNI: ${patient.dni}) imported → ${created.id}`);
    } catch (err: any) {
      console.error(`   ❌ Error importing patient: ${err.message}`);
      throw err;
    }
  }

  return patientMap;
}

async function importTreatments(
  data: BackupData,
  clinicMap: Map<string, string>
): Promise<Map<string, string>> {
  console.log('\n💊 Importando tratamientos...');
  const treatmentMap = new Map<string, string>();

  if (!data.treatments || data.treatments.length === 0) {
    console.log('   ⚠️  No treatments to import');
    return treatmentMap;
  }

  for (const treatment of data.treatments) {
    try {
      const oldId = treatment.id || treatment._id;
      const clinicId = clinicMap.get(treatment.clinic_id || treatment.clinicId);

      if (!clinicId) {
        console.warn(`   ⚠️  Skipping treatment "${treatment.name}" - clinic not found`);
        continue;
      }

      // Verificar si ya existe
      const existing = await prisma.treatment.findFirst({
        where: {
          clinic_id: clinicId,
          name: treatment.name || 'Imported Treatment',
        },
      });

      if (existing) {
        console.log(`   ⚠️  Treatment "${treatment.name}" already exists`);
        treatmentMap.set(oldId, existing.id);
        continue;
      }

      const created = await prisma.treatment.create({
        data: {
          clinic_id: clinicId,
          name: treatment.name || 'Imported Treatment',
          price: treatment.price || 0,
        },
      });

      treatmentMap.set(oldId, created.id);
      console.log(`   ✅ Treatment "${treatment.name}" imported → ${created.id}`);
    } catch (err: any) {
      console.error(`   ❌ Error importing treatment: ${err.message}`);
      throw err;
    }
  }

  return treatmentMap;
}

async function importAppointments(
  data: BackupData,
  clinicMap: Map<string, string>,
  patientMap: Map<string, string>,
  userMap: Map<string, string>,
  treatmentMap: Map<string, string>
): Promise<Map<string, string>> {
  console.log('\n📅 Importando citas...');
  const appointmentMap = new Map<string, string>();

  if (!data.appointments || data.appointments.length === 0) {
    console.log('   ⚠️  No appointments to import');
    return appointmentMap;
  }

  for (const appt of data.appointments) {
    try {
      const oldId = appt.id || appt._id;
      const clinicId = clinicMap.get(appt.clinic_id || appt.clinicId);
      const patientId = patientMap.get(appt.patient_id || appt.patientId);
      const doctorId = userMap.get(appt.doctor_id || appt.doctorId);
      const treatmentId = treatmentMap.get(appt.treatment_id || appt.treatmentId);

      if (!clinicId || !patientId || !doctorId) {
        console.warn(`   ⚠️  Skipping appointment - missing relations`);
        continue;
      }

      const created = await prisma.appointment.create({
        data: {
          clinic_id: clinicId,
          patient_id: patientId,
          doctor_id: doctorId,
          treatment_id: treatmentId || undefined,
          date: new Date(appt.date),
          time: appt.time || '09:00',
          cost: appt.cost || 0,
          status: appt.status || 'scheduled',
        },
      });

      appointmentMap.set(oldId, created.id);
      console.log(`   ✅ Appointment ${created.id} imported`);
    } catch (err: any) {
      console.error(`   ❌ Error importing appointment: ${err.message}`);
      throw err;
    }
  }

  return appointmentMap;
}

async function importPayments(
  data: BackupData,
  clinicMap: Map<string, string>,
  patientMap: Map<string, string>,
  appointmentMap: Map<string, string>
): Promise<number> {
  console.log('\n💳 Importando pagos...');
  let count = 0;

  if (!data.payments || data.payments.length === 0) {
    console.log('   ⚠️  No payments to import');
    return count;
  }

  for (const payment of data.payments) {
    try {
      const clinicId = clinicMap.get(payment.clinic_id || payment.clinicId);
      const patientId = patientMap.get(payment.patient_id || payment.patientId);
      const appointmentId = appointmentMap.get(payment.appointment_id || payment.appointmentId);

      if (!clinicId || !patientId || !appointmentId) {
        console.warn(`   ⚠️  Skipping payment - missing relations`);
        continue;
      }

      await prisma.payment.create({
        data: {
          clinic_id: clinicId,
          patient_id: patientId,
          appointment_id: appointmentId,
          amount: payment.amount || 0,
          total_cost: payment.total_cost || payment.amount || 0,
          total_paid: payment.total_paid || 0,
          balance: payment.balance || (payment.amount || 0),
          payment_status: payment.payment_status || 'pending',
          payment_method: payment.payment_method || 'cash',
        },
      });

      // Registrar en PaymentHistory si existe historial
      if (payment.payment_histories && Array.isArray(payment.payment_histories)) {
        for (const history of payment.payment_histories) {
          // Encontrar el pago creado para obtener su ID
          const createdPayment = await prisma.payment.findFirst({
            where: {
              clinic_id: clinicId,
              patient_id: patientId,
              appointment_id: appointmentId,
            },
          });

          if (createdPayment) {
            await prisma.paymentHistory.create({
              data: {
                clinic_id: clinicId,
                payment_id: createdPayment.id,
                amount_paid: history.amount_paid || 0,
                payment_date: new Date(history.payment_date),
                payment_method: history.payment_method || 'cash',
                reference: history.reference || null,
              },
            });
          }
        }
      }

      count++;
      console.log(`   ✅ Payment imported`);
    } catch (err: any) {
      console.error(`   ❌ Error importing payment: ${err.message}`);
      throw err;
    }
  }

  return count;
}

async function generateReport(
  stats: any,
  errors: string[],
  warnings: string[],
  validations: any
): Promise<ETLReport> {
  return {
    timestamp: new Date().toISOString(),
    status: errors.length === 0 ? 'success' : errors.length > 5 ? 'error' : 'partial',
    stats,
    errors,
    warnings,
    validations,
  };
}

async function main() {
  const backupPath = process.argv[2] || './backup.json';

  console.log(`🚀 ETL Import: Iniciando importación desde ${backupPath}`);

  if (!fs.existsSync(backupPath)) {
    console.error(`❌ Archivo de backup no encontrado: ${backupPath}`);
    process.exit(1);
  }

  const errors: string[] = [];
  const warnings: string[] = [];
  const validations: any = {};
  const stats = {
    clinics_imported: 0,
    users_imported: 0,
    patients_imported: 0,
    treatments_imported: 0,
    appointments_imported: 0,
    payments_imported: 0,
  };

  try {
    const backupContent = fs.readFileSync(backupPath, 'utf-8');
    const backupData: BackupData = JSON.parse(backupContent);

    console.log(`✅ Backup cargado: ${backupPath}`);
    console.log(`   Clinics: ${backupData.clinics?.length || 0}`);
    console.log(`   Users: ${backupData.users?.length || 0}`);
    console.log(`   Patients: ${backupData.patients?.length || 0}`);
    console.log(`   Treatments: ${backupData.treatments?.length || 0}`);
    console.log(`   Appointments: ${backupData.appointments?.length || 0}`);
    console.log(`   Payments: ${backupData.payments?.length || 0}`);

    // Validar antes de importar
    const validation = await validateBackup(backupData);
    if (!validation.valid) {
      console.warn('⚠️  Problemas encontrados en el backup:');
      validation.errors.forEach((e) => console.warn(`   - ${e}`));
      errors.push(...validation.errors);
    }

    // Importar en orden de dependencias
    const clinicMap = await importClinics(backupData);
    stats.clinics_imported = clinicMap.size;

    const userMap = await importUsers(backupData, clinicMap);
    stats.users_imported = userMap.size;

    const patientMap = await importPatients(backupData, clinicMap);
    stats.patients_imported = patientMap.size;

    const treatmentMap = await importTreatments(backupData, clinicMap);
    stats.treatments_imported = treatmentMap.size;

    const appointmentMap = await importAppointments(
      backupData,
      clinicMap,
      patientMap,
      userMap,
      treatmentMap
    );
    stats.appointments_imported = appointmentMap.size;

    stats.payments_imported = await importPayments(backupData, clinicMap, patientMap, appointmentMap);

    // Recopilación de validaciones
    validations.users_have_password = (backupData.users || []).filter((u) => u.password_hash).length;
    validations.users_have_clinic = (backupData.users || []).filter((u) => u.clinic_id || u.clinicId)
      .length;
    validations.patients_have_clinic = (backupData.patients || []).filter((p) => p.clinic_id || p.clinicId)
      .length;
    validations.appointments_have_relations = appointmentMap.size;

    const report = await generateReport(stats, errors, warnings, validations);

    // Guardar reporte
    const reportPath = `etl-report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('\n✅ Importación completada!');
    console.log(`\n📊 ESTADÍSTICAS:`);
    console.log(`   Clinics: ${stats.clinics_imported}`);
    console.log(`   Users: ${stats.users_imported}`);
    console.log(`   Patients: ${stats.patients_imported}`);
    console.log(`   Treatments: ${stats.treatments_imported}`);
    console.log(`   Appointments: ${stats.appointments_imported}`);
    console.log(`   Payments: ${stats.payments_imported}`);

    if (errors.length > 0) {
      console.log(`\n❌ Errores (${errors.length}):`);
      errors.slice(0, 5).forEach((e) => console.log(`   - ${e}`));
      if (errors.length > 5) console.log(`   ... y ${errors.length - 5} más`);
    }

    console.log(`\n📋 Reporte guardado: ${reportPath}`);
    process.exit(0);
  } catch (error: any) {
    console.error(`\n❌ Error crítico: ${error.message}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
