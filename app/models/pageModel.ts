import prisma from '../services/prismaService';

export interface CreatePageInput {
  name: string;
  slug: string;
  websiteId: string;
  isHome?: boolean;
  order?: number;
}

export interface UpdatePageInput {
  name?: string;
  slug?: string;
  isHome?: boolean;
  order?: number;
}

export interface ReorderPageInput {
  id: string;
  newOrder: number;
}

export const PageModel = {
  // Créer une page
  create: async (data: CreatePageInput) => {
    const { order, isHome, ...rest } = data;

    // Vérifier l'unicité du slug dans le website
    const existingPage = await prisma.page.findUnique({
      where: {
        websiteId_slug: {
          websiteId: data.websiteId,
          slug: data.slug,
        },
      },
    });

    if (existingPage) {
      throw new Error('Une page avec ce slug existe déjà dans ce site');
    }

    // Si isHome est true, retirer isHome des autres pages du même website
    if (isHome) {
      await prisma.page.updateMany({
        where: {
          websiteId: data.websiteId,
          isHome: true,
        },
        data: {
          isHome: false,
        },
      });
    }

    // Si order n'est pas fourni, mettre à la fin
    let finalOrder = order;
    if (finalOrder === undefined) {
      const lastPage = await prisma.page.findFirst({
        where: { websiteId: data.websiteId },
        orderBy: { order: 'desc' },
      });
      finalOrder = lastPage ? lastPage.order + 1 : 0;
    } else {
      // Si l'ordre est spécifié, décaler les pages existantes
      await prisma.page.updateMany({
        where: {
          websiteId: data.websiteId,
          order: { gte: finalOrder },
        },
        data: {
          order: { increment: 1 },
        },
      });
    }

    return await prisma.page.create({
      data: {
        ...rest,
        order: finalOrder,
        isHome: isHome || false,
      },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            components: {
              orderBy: { order: 'asc' },
              include: { styles: true },
            },
            styles: true,
          },
        },
        website: {
          select: {
            id: true,
            name: true,
            userId: true,
          },
        },
      },
    });
  },

  // Trouver par ID
  findById: async (id: string) => {
    return await prisma.page.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            components: {
              orderBy: { order: 'asc' },
              include: { styles: true },
            },
            styles: true,
          },
        },
        website: {
          select: {
            id: true,
            name: true,
            userId: true,
          },
        },
      },
    });
  },

  // Trouver par slug et websiteId
  findBySlug: async (websiteId: string, slug: string) => {
    return await prisma.page.findUnique({
      where: {
        websiteId_slug: {
          websiteId,
          slug,
        },
      },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            components: {
              orderBy: { order: 'asc' },
              include: { styles: true },
            },
            styles: true,
          },
        },
      },
    });
  },

  // Trouver toutes les pages d'un website
  findByWebsiteId: async (websiteId: string) => {
    return await prisma.page.findMany({
      where: { websiteId },
      orderBy: { order: 'asc' },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            components: {
              orderBy: { order: 'asc' },
              include: { styles: true },
            },
            styles: true,
          },
        },
      },
    });
  },

  // Trouver la page d'accueil
  findHomePage: async (websiteId: string) => {
    return await prisma.page.findFirst({
      where: {
        websiteId,
        isHome: true,
      },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            components: {
              orderBy: { order: 'asc' },
              include: { styles: true },
            },
            styles: true,
          },
        },
      },
    });
  },

  // Mettre à jour une page
  update: async (id: string, data: UpdatePageInput) => {
    const { order, slug, isHome, ...rest } = data;

    const page = await prisma.page.findUnique({
      where: { id },
      select: { order: true, websiteId: true, slug: true },
    });

    if (!page) {
      throw new Error('Page introuvable');
    }

    // Vérifier l'unicité du slug si modifié
    if (slug && slug !== page.slug) {
      const existingPage = await prisma.page.findUnique({
        where: {
          websiteId_slug: {
            websiteId: page.websiteId,
            slug,
          },
        },
      });

      if (existingPage) {
        throw new Error('Une page avec ce slug existe déjà dans ce site');
      }
    }

    // Si isHome devient true, retirer isHome des autres pages
    if (isHome === true) {
      await prisma.page.updateMany({
        where: {
          websiteId: page.websiteId,
          id: { not: id },
          isHome: true,
        },
        data: {
          isHome: false,
        },
      });
    }

    // Si on change l'ordre, utiliser la fonction de réorganisation
    if (order !== undefined && page.order !== order) {
      await PageModel.reorder({ id, newOrder: order });
    }

    // Mettre à jour les autres champs
    const updateData: any = { ...rest };
    if (slug) updateData.slug = slug;
    if (isHome !== undefined) updateData.isHome = isHome;

    if (Object.keys(updateData).length > 0) {
      return await prisma.page.update({
        where: { id },
        data: updateData,
        include: {
          sections: {
            orderBy: { order: 'asc' },
            include: {
              components: {
                orderBy: { order: 'asc' },
                include: { styles: true },
              },
              styles: true,
            },
          },
        },
      });
    }

    return await PageModel.findById(id);
  },

  // Réorganiser l'ordre (optimisé)
  reorder: async ({ id, newOrder }: ReorderPageInput) => {
    return await prisma.$transaction(async (tx) => {
      const page = await tx.page.findUnique({
        where: { id },
        select: { order: true, websiteId: true },
      });

      if (!page) {
        throw new Error('Page introuvable');
      }

      const oldOrder = page.order;
      const { websiteId } = page;

      // Si l'ordre ne change pas, ne rien faire
      if (oldOrder === newOrder) {
        return await tx.page.findUnique({
          where: { id },
          include: {
            sections: {
              orderBy: { order: 'asc' },
              include: {
                components: {
                  orderBy: { order: 'asc' },
                  include: { styles: true },
                },
                styles: true,
              },
            },
          },
        });
      }

      // Cas 1: Déplacer vers le haut (oldOrder > newOrder)
      if (oldOrder > newOrder) {
        await tx.page.updateMany({
          where: {
            websiteId,
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
        await tx.page.updateMany({
          where: {
            websiteId,
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

      // Mettre à jour la page cible
      return await tx.page.update({
        where: { id },
        data: { order: newOrder },
        include: {
          sections: {
            orderBy: { order: 'asc' },
            include: {
              components: {
                orderBy: { order: 'asc' },
                include: { styles: true },
              },
              styles: true,
            },
          },
        },
      });
    });
  },

  // Supprimer une page
  delete: async (id: string) => {
    return await prisma.$transaction(async (tx) => {
      const page = await tx.page.findUnique({
        where: { id },
        select: { order: true, websiteId: true, isHome: true },
      });

      if (!page) {
        throw new Error('Page introuvable');
      }

      // Empêcher la suppression de la page d'accueil si c'est la seule page
      if (page.isHome) {
        const pageCount = await tx.page.count({
          where: { websiteId: page.websiteId },
        });

        if (pageCount === 1) {
          throw new Error('Impossible de supprimer la seule page d\'accueil du site');
        }

        // Si on supprime la page d'accueil, définir une autre page comme accueil
        const nextPage = await tx.page.findFirst({
          where: {
            websiteId: page.websiteId,
            id: { not: id },
          },
          orderBy: { order: 'asc' },
        });

        if (nextPage) {
          await tx.page.update({
            where: { id: nextPage.id },
            data: { isHome: true },
          });
        }
      }

      // Supprimer la page (les sections et composants seront supprimés en cascade)
      await tx.page.delete({
        where: { id },
      });

      // Réorganiser les pages restantes
      await tx.page.updateMany({
        where: {
          websiteId: page.websiteId,
          order: { gt: page.order },
        },
        data: {
          order: { decrement: 1 },
        },
      });

      return { id, deleted: true };
    });
  },

};