import prisma from '../services/prismaService';
import { ComponentType, Prisma } from '@prisma/client';

export interface CreateComponentInput {
  type: ComponentType;
  content: Prisma.InputJsonValue;
  sectionId: string;
  order?: number;
  styles?: Prisma.InputJsonValue;
}

export interface UpdateComponentInput {
  type?: ComponentType;
  content?: Prisma.InputJsonValue;
  order?: number;
  styles?: Prisma.InputJsonValue;
}

export interface ReorderComponentInput {
  id: string;
  newOrder: number;
}

export const ComponentModel = {
  // Créer un composant
  create: async (data: CreateComponentInput) => {
    const { order, styles, ...rest } = data;

    // Si order n'est pas fourni, mettre à la fin
    let finalOrder = order;
    if (finalOrder === undefined) {
      const lastComponent = await prisma.component.findFirst({
        where: { sectionId: data.sectionId },
        orderBy: { order: 'desc' },
      });
      finalOrder = lastComponent ? lastComponent.order + 1 : 0;
    } else {
      // Si l'ordre est spécifié, décaler les composants existants
      await prisma.component.updateMany({
        where: {
          sectionId: data.sectionId,
          order: { gte: finalOrder },
        },
        data: {
          order: { increment: 1 },
        },
      });
    }

    return await prisma.component.create({
      data: {
        ...rest,
        order: finalOrder,
        ...(styles && {
          styles: {
            create: styles as any,
          },
        }),
      },
      include: {
        styles: true,
      },
    });
  },

  // Trouver par ID
  findById: async (id: string) => {
    return await prisma.component.findUnique({
      where: { id },
      include: {
        styles: true,
        section: {
          include: {
            page: true,
            template: true,
          },
        },
      },
    });
  },

  // Trouver tous les composants d'une section
  findBySectionId: async (sectionId: string) => {
    return await prisma.component.findMany({
      where: { sectionId },
      orderBy: { order: 'asc' },
      include: {
        styles: true,
      },
    });
  },

  // Mettre à jour un composant
  update: async (id: string, data: UpdateComponentInput) => {
    const { order, styles, ...rest } = data;

    // Si on change l'ordre, utiliser la fonction de réorganisation
    if (order !== undefined) {
      const component = await prisma.component.findUnique({
        where: { id },
        select: { order: true, sectionId: true },
      });

      if (!component) {
        throw new Error('Composant introuvable');
      }

      if (component.order !== order) {
        await ComponentModel.reorder({ id, newOrder: order });
      }
    }

    // Mettre à jour les autres champs
    const updateData: any = { ...rest };

    if (styles !== undefined) {
      // Vérifier si des styles existent déjà
      const existingComponent = await prisma.component.findUnique({
        where: { id },
        include: { styles: true },
      });

      if (existingComponent?.styles) {
        updateData.styles = {
          update: styles as any,
        };
      } else {
        updateData.styles = {
          create: styles as any,
        };
      }
    }

    if (Object.keys(updateData).length > 0) {
      return await prisma.component.update({
        where: { id },
        data: updateData,
        include: {
          styles: true,
        },
      });
    }

    return await ComponentModel.findById(id);
  },

  // Réorganiser l'ordre (optimisé)
  reorder: async ({ id, newOrder }: ReorderComponentInput) => {
    return await prisma.$transaction(async (tx) => {
      const component = await tx.component.findUnique({
        where: { id },
        select: { order: true, sectionId: true },
      });

      if (!component) {
        throw new Error('Composant introuvable');
      }

      const oldOrder = component.order;
      const { sectionId } = component;

      // Si l'ordre ne change pas, ne rien faire
      if (oldOrder === newOrder) {
        return await tx.component.findUnique({
          where: { id },
          include: {
            styles: true,
          },
        });
      }

      // Cas 1: Déplacer vers le haut (oldOrder > newOrder)
      if (oldOrder > newOrder) {
        await tx.component.updateMany({
          where: {
            sectionId,
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
      else {
        await tx.component.updateMany({
          where: {
            sectionId,
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

      // Mettre à jour le composant cible
      return await tx.component.update({
        where: { id },
        data: { order: newOrder },
        include: {
          styles: true,
        },
      });
    });
  },

  // Supprimer un composant
  delete: async (id: string) => {
    return await prisma.$transaction(async (tx) => {
      const component = await tx.component.findUnique({
        where: { id },
        select: { order: true, sectionId: true },
      });

      if (!component) {
        throw new Error('Composant introuvable');
      }

      // Supprimer le composant (les styles seront supprimés en cascade)
      await tx.component.delete({
        where: { id },
      });

      // Réorganiser les composants restants
      await tx.component.updateMany({
        where: {
          sectionId: component.sectionId,
          order: { gt: component.order },
        },
        data: {
          order: { decrement: 1 },
        },
      });

      return { id, deleted: true };
    });
  },

  // Dupliquer un composant
  duplicate: async (id: string) => {
    return await prisma.$transaction(async (tx) => {
      const original = await tx.component.findUnique({
        where: { id },
        include: {
          styles: true,
        },
      });

      if (!original) {
        throw new Error('Composant introuvable');
      }

      // Décaler les composants suivants
      await tx.component.updateMany({
        where: {
          sectionId: original.sectionId,
          order: { gt: original.order },
        },
        data: {
          order: { increment: 1 },
        },
      });

      // Créer la copie
      const { id: _, createdAt, updatedAt, styles, ...componentData } = original;

      const newComponent = await tx.component.create({
        data: {
          ...componentData,
          content: (componentData as any).content as Prisma.InputJsonValue,
          order: original.order + 1,
          styles: styles
            ? {
                create: styles as any,
              }
            : undefined,
        },
        include: {
          styles: true,
        },
      });

      return newComponent;
    });
  },

  // Déplacer un composant vers une autre section
  moveToSection: async (id: string, targetSectionId: string, newOrder?: number) => {
    return await prisma.$transaction(async (tx) => {
      const component = await tx.component.findUnique({
        where: { id },
        select: { order: true, sectionId: true },
      });

      if (!component) {
        throw new Error('Composant introuvable');
      }

      // Réorganiser l'ancienne section
      await tx.component.updateMany({
        where: {
          sectionId: component.sectionId,
          order: { gt: component.order },
        },
        data: {
          order: { decrement: 1 },
        },
      });

      // Déterminer le nouvel ordre
      let finalOrder = newOrder;
      if (finalOrder === undefined) {
        const lastComponent = await tx.component.findFirst({
          where: { sectionId: targetSectionId },
          orderBy: { order: 'desc' },
        });
        finalOrder = lastComponent ? lastComponent.order + 1 : 0;
      } else {
        // Décaler les composants dans la nouvelle section
        await tx.component.updateMany({
          where: {
            sectionId: targetSectionId,
            order: { gte: finalOrder },
          },
          data: {
            order: { increment: 1 },
          },
        });
      }

      // Déplacer le composant
      return await tx.component.update({
        where: { id },
        data: {
          sectionId: targetSectionId,
          order: finalOrder,
        },
        include: {
          styles: true,
        },
      });
    });
  },
};