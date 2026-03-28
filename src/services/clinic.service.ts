import { prisma } from '@/lib/prisma';

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

function normalizeOptionalString(value?: string): string | null | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export const clinicService = {
  async getById(clinicId: string) {
    return prisma.clinic.findUnique({ where: { id: clinicId } });
  },

  async update(clinicId: string, data: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    logo_url?: string;
    theme?: string;
  }) {
    return prisma.clinic.update({
      where: { id: clinicId },
      data,
    });
  },

  async updateBranding(
    clinicId: string,
    data: {
      logo_url?: string;
      primary_color?: string;
      slogan?: string;
      theme?: 'light' | 'dark' | 'system';
      brandName?: string;
    }
  ) {
    const updateData: {
      logo_url?: string | null;
      primary_color?: string | null;
      slogan?: string | null;
      theme?: 'light' | 'dark' | 'system';
      name?: string;
    } = {};

    const logo = normalizeOptionalString(data.logo_url);
    if (logo !== undefined) {
      updateData.logo_url = logo;
    }

    const slogan = normalizeOptionalString(data.slogan);
    if (slogan !== undefined) {
      updateData.slogan = slogan;
    }

    const brandName = normalizeOptionalString(data.brandName);
    if (brandName) {
      updateData.name = brandName;
    }

    const color = normalizeOptionalString(data.primary_color);
    if (color !== undefined) {
      if (color !== null && !HEX_COLOR_REGEX.test(color)) {
        throw new Error('Color principal invalido');
      }
      updateData.primary_color = color;
    }

    if (data.theme !== undefined) {
      if (!['light', 'dark', 'system'].includes(data.theme)) {
        throw new Error('Tema invalido');
      }
      updateData.theme = data.theme;
    }

    return prisma.clinic.update({
      where: { id: clinicId },
      data: updateData,
      select: {
        id: true,
        name: true,
        domain: true,
        logo_url: true,
        primary_color: true,
        slogan: true,
        theme: true,
        subscription_status: true,
        next_payment_date: true,
      },
    });
  },
};
