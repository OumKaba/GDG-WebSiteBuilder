import prisma from '../services/prismaService';

export interface CreateSectionInput {
  name: string;
  pageId?: string;
  templateId?: string;
  order?: number;
}

export interface UpdateSectionInput {
  name?: string;
  order?: number;
}

export interface ReorderSectionInput {
  id: string;
  newOrder: number;
}

export const SectionModel = {
  // Créer une section
  create: async (data: CreateSectionInput) => {
    const { pageId, templateId, order, ...rest } = data;

    // Vérifier qu'on a soit pageId soit templateId
    if (!pageId && !templateId) {
      throw new Error('pageId ou templateId est requis');
    }

    // Si order n'est pas fourni, mettre à la fin
    let finalOrder = order;
    if (finalOrder === undefined) {
      const lastSection = await prisma.section.findFirst({
        where: pageId ? { pageId } : { templateId },
        orderBy: { order: 'desc' },
      });
      finalOrder = lastSection ? lastSection.order + 1 : 0;
    } else {
      // Si l'ordre est spécifié, décaler les sections existantes
      await prisma.section.updateMany({
        where: {
          ...(pageId ? { pageId } : { templateId }),
          order: { gte: finalOrder },
        },
        data: {
          order: { increment: 1 },
        },
      });
    }

    return await prisma.section.create({
      data: {
        ...rest,
        order: finalOrder,
        ...(pageId && { pageId }),
        ...(templateId && { templateId }),
      },
      include: {
        components: {
          orderBy: { order: 'asc' },
          include: { styles: true },
        },
        styles: true,
      },
    });
  },

  // Trouver par ID
  findById: async (id: string) => {
    return await prisma.section.findUnique({
      where: { id },
      include: {
        components: {
          orderBy: { order: 'asc' },
          include: { styles: true },
        },
        styles: true,
        page: true,
        template: true,
      },
    });
  },

  // Trouver toutes les sections d'une page
  findByPageId: async (pageId: string) => {
    return await prisma.section.findMany({
      where: { pageId },
      orderBy: { order: 'asc' },
      include: {
        components: {
          orderBy: { order: 'asc' },
          include: { styles: true },
        },
        styles: true,
      },
    });
  },

  // Trouver toutes les sections d'un template
  findByTemplateId: async (templateId: string) => {
    return await prisma.section.findMany({
      where: { templateId },
      orderBy: { order: 'asc' },
      include: {
        components: {
          orderBy: { order: 'asc' },
          include: { styles: true },
        },
        styles: true,
      },
    });
  },

  // Mettre à jour une section
  update: async (id: string, data: UpdateSectionInput) => {
    const { order, ...rest } = data;

    // Si on change l'ordre, utiliser la fonction de réorganisation
    if (order !== undefined) {
      const section = await prisma.section.findUnique({
        where: { id },
        select: { order: true, pageId: true, templateId: true },
      });

      if (!section) {
        throw new Error('Section introuvable');
      }

      if (section.order !== order) {
        await SectionModel.reorder({ id, newOrder: order });
      }
    }

    // Mettre à jour les autres champs
    if (Object.keys(rest).length > 0) {
      return await prisma.section.update({
        where: { id },
        data: rest,
        include: {
          components: {
            orderBy: { order: 'asc' },
            include: { styles: true },
          },
          styles: true,
        },
      });
    }

    return await SectionModel.findById(id);
  },

  // Réorganiser l'ordre (optimisé)
  reorder: async ({ id, newOrder }: ReorderSectionInput) => {
    return await prisma.$transaction(async (tx) => {
      const section = await tx.section.findUnique({
        where: { id },
        select: { order: true, pageId: true, templateId: true },
      });

      if (!section) {
        throw new Error('Section introuvable');
      }

      const oldOrder = section.order;
      const { pageId, templateId } = section;

      // Si l'ordre ne change pas, ne rien faire
      if (oldOrder === newOrder) {
        return await tx.section.findUnique({
          where: { id },
          include: {
            components: {
              orderBy: { order: 'asc' },
              include: { styles: true },
            },
            styles: true,
          },
        });
      }

      const whereClause = pageId ? { pageId } : { templateId };

      // Cas 1: Déplacer vers le haut (oldOrder > newOrder)
      // Exemple: 4 -> 2, on incrémente les sections entre 2 et 3
      if (oldOrder > newOrder) {
        await tx.section.updateMany({
          where: {
            ...whereClause,
            order: {
              gte: newOrder,
              lt: oldOrder,
            },
          },
          data: {
            order: { increment: 1 },
          },
        });
      }
      // Cas 2: Déplacer vers le bas (oldOrder < newOrder)
      // Exemple: 2 -> 4, on décrémente les sections entre 3 et 4
      else {
        await tx.section.updateMany({
          where: {
            ...whereClause,
            order: {
              gt: oldOrder,
              lte: newOrder,
            },
          },
          data: {
            order: { decrement: 1 },
          },
        });
      }

      // Mettre à jour la section cible
      return await tx.section.update({
        where: { id },
        data: { order: newOrder },
        include: {
          components: {
            orderBy: { order: 'asc' },
            include: { styles: true },
          },
          styles: true,
        },
      });
    });
  },

  // Supprimer une section
  delete: async (id: string) => {
    return await prisma.$transaction(async (tx) => {
      const section = await tx.section.findUnique({
        where: { id },
        select: { order: true, pageId: true, templateId: true },
      });

      if (!section) {
        throw new Error('Section introuvable');
      }

      // Supprimer la section (les composants seront supprimés en cascade)
      await tx.section.delete({
        where: { id },
      });

      // Réorganiser les sections restantes
      const whereClause = section.pageId
        ? { pageId: section.pageId }
        : { templateId: section.templateId };

      await tx.section.updateMany({
        where: {
          ...whereClause,
          order: { gt: section.order },
        },
        data: {
          order: { decrement: 1 },
        },
      });

      return { id, deleted: true };
    });
  },

};