import prisma from '../services/prismaService';

export interface CreateUserInput {
  email: string;
  password?: string;
  name?: string;
  provider: 'email' | 'google';
  providerId?: string;
}

export const UserModel = {
  // Créer un utilisateur
  create: async (data: CreateUserInput) => {
    return await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        provider: data.provider,
        providerId: data.providerId,
        isVerified: data.provider === 'google', // Google users auto-verified
      },
    });
  },

  // Trouver par email
  findByEmail: async (email: string) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  // Trouver par ID
  findById: async (id: string) => {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        provider: true,
        isVerified: true,
        createdAt: true,
      },
    });
  },

  // Trouver par Google ID
  findByGoogleId: async (googleId: string) => {
    return await prisma.user.findFirst({
      where: {
        provider: 'google',
        providerId: googleId,
      },
    });
  },

  // Mettre à jour
  update: async (id: string, data: any) => {
    return await prisma.user.update({
      where: { id },
      data,
    });
  },

  // Vérifier l'email
  verifyEmail: async (id: string) => {
    return await prisma.user.update({
      where: { id },
      data: { isVerified: true },
    });
  },
};