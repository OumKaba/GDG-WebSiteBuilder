import prisma from '../services/prismaService';

export interface CreateTemplateInput {
  name: string;
  description?: string;
  type: string;
  thumbnail?: string;
  content: any;
  isPublic?: boolean;
  isPredefined?: boolean;
  userId?: string;
}

export interface UpdateTemplateInput {
  name?: string;
  description?: string | null;
  type?: string;
  thumbnail?: string | null;
  content?: any;
  isPublic?: boolean;
  isPredefined?: boolean;
  userId?: string | null;
}

export interface TemplateFilters {
  isPublic?: boolean;
  isPredefined?: boolean;
  type?: string;
}

export const TemplateModel = {
  // Créer un template
  create: async (data: CreateTemplateInput) => {
    return await prisma.template.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        thumbnail: data.thumbnail,
        content: data.content,
        isPublic: data.isPublic || false,
        isPredefined: data.isPredefined || false,
        userId: data.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  },

  // Trouver par ID
  findById: async (id: string) => {
    return await prisma.template.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  },

  // Trouver tous avec filtres optionnels
  findAll: async (filters?: TemplateFilters) => {
    const where: any = {};
    
    if (filters?.isPublic !== undefined) {
      where.isPublic = filters.isPublic;
    }
    if (filters?.isPredefined !== undefined) {
      where.isPredefined = filters.isPredefined;
    }
    if (filters?.type) {
      where.type = filters.type;
    }

    return await prisma.template.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Trouver par utilisateur
  findByUserId: async (userId: string) => {
    return await prisma.template.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Trouver par type
  findByType: async (type: string) => {
    return await prisma.template.findMany({
      where: { type },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Trouver les templates publics
  findPublic: async () => {
    return await prisma.template.findMany({
      where: { isPublic: true },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Mettre à jour
  update: async (id: string, data: UpdateTemplateInput) => {
    return await prisma.template.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  },

  // Supprimer
  delete: async (id: string) => {
    return await prisma.template.delete({
      where: { id },
    });
  },
};