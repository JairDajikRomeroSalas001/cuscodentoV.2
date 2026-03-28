import { prisma } from '@/lib/prisma';

export const treatmentService = {
  async getByClinic(clinicId: string) {
    return prisma.treatment.findMany({
      where: { clinic_id: clinicId },
      orderBy: { created_at: 'desc' },
    });
  },
};
