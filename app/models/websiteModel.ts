import prisma from '../services/prismaService';

export interface CreateWebsiteInput {
  name: string;
  description?: string;
  content: any;
  theme?: string;
  status?: string;
  seoScore?: number;
  templateId?: string;
  userId: string;
}

export interface UpdateWebsiteInput {
  name?: string;
  description?: string;
  content?: any;
  theme?: string;
  status?: string;
  seoScore?: number;
  templateId?: string;
}

export const WebsiteModel = {
  create: async (data: CreateWebsiteInput) => {
    return await prisma.website.create({
      data: {
        name: data.name,
        description: data.description,
        content: data.content,
        theme: data.theme || 'light',
        status: data.status || 'draft',
        seoScore: data.seoScore,
        templateId: data.templateId,
        userId: data.userId,
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
        template: { select: { id: true, name: true, type: true } },
      },
    });
  },

  findById: async (id: string) => {
    return await prisma.website.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, name: true } },
        template: { select: { id: true, name: true, type: true } },
      },
    });
  },

  findAll: async () => {
    return await prisma.website.findMany({
      include: {
        user: { select: { id: true, email: true, name: true } },
        template: { select: { id: true, name: true, type: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  },

  findByUserId: async (userId: string) => {
    return await prisma.website.findMany({
      where: { userId },
      include: {
        template: { select: { id: true, name: true, type: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  },

  update: async (id: string, data: UpdateWebsiteInput) => {
    return await prisma.website.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, email: true, name: true } },
        template: { select: { id: true, name: true, type: true } },
      },
    });
  },

  delete: async (id: string) => {
    return await prisma.website.delete({ where: { id } });
  },
};

