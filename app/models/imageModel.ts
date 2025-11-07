import prisma from '../services/prismaService';

export interface CreateImageInput {
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  alt?: string;
  userId: string;
}

export interface UpdateImageInput {
  filename?: string;
  url?: string;
  alt?: string;
}

export const ImageModel = {
  // Créer une image
  create: async (data: CreateImageInput) => {
    return await prisma.image.create({
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

  // Trouver par ID
  findById: async (id: string) => {
    return await prisma.image.findUnique({
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

  // Trouver toutes les images d'un utilisateur
  findByUserId: async (userId: string, options?: { limit?: number; offset?: number }) => {
    const { limit, offset } = options || {};

    const [images, total] = await Promise.all([
      prisma.image.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        ...(limit && { take: limit }),
        ...(offset && { skip: offset }),
      }),
      prisma.image.count({ where: { userId } }),
    ]);

    return { images, total };
  },

  // Trouver toutes les images (admin)
  findAll: async (options?: { limit?: number; offset?: number }) => {
    const { limit, offset } = options || {};

    const [images, total] = await Promise.all([
      prisma.image.findMany({
        orderBy: { createdAt: 'desc' },
        ...(limit && { take: limit }),
        ...(offset && { skip: offset }),
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      }),
      prisma.image.count(),
    ]);

    return { images, total };
  },

  // Rechercher des images par nom de fichier
  searchByFilename: async (userId: string, searchTerm: string) => {
    return await prisma.image.findMany({
      where: {
        userId,
        filename: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Mettre à jour une image
  update: async (id: string, data: UpdateImageInput) => {
    return await prisma.image.update({
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

  // Supprimer une image
  delete: async (id: string) => {
    const image = await prisma.image.findUnique({
      where: { id },
      select: { url: true },
    });

    if (!image) {
      throw new Error('Image introuvable');
    }

    await prisma.image.delete({
      where: { id },
    });

    return { id, deleted: true, url: image.url };
  },

  // Supprimer plusieurs images
  deleteMany: async (ids: string[], userId: string) => {
    const images = await prisma.image.findMany({
      where: {
        id: { in: ids },
        userId, // Sécurité : s'assurer que l'utilisateur possède ces images
      },
      select: { id: true, url: true },
    });

    if (images.length === 0) {
      throw new Error('Aucune image trouvée');
    }

    await prisma.image.deleteMany({
      where: {
        id: { in: images.map((img) => img.id) },
      },
    });

    return {
      deleted: images.length,
      urls: images.map((img) => img.url),
    };
  },

  // Obtenir les statistiques d'utilisation
  getStats: async (userId: string) => {
    const [totalImages, totalSize] = await Promise.all([
      prisma.image.count({ where: { userId } }),
      prisma.image.aggregate({
        where: { userId },
        _sum: { size: true },
      }),
    ]);

    return {
      totalImages,
      totalSize: totalSize._sum.size || 0,
      averageSize: totalImages > 0 ? Math.round((totalSize._sum.size || 0) / totalImages) : 0,
    };
  },

  // Obtenir les images par type MIME
  findByMimeType: async (userId: string, mimeType: string) => {
    return await prisma.image.findMany({
      where: {
        userId,
        mimeType: {
          startsWith: mimeType, // Ex: "image/" pour toutes les images
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};