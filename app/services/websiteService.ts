import { WebsiteModel } from '../models/websiteModel';
import type { CreateWebsiteInput, UpdateWebsiteInput } from '../models/websiteModel';

export const WebsiteService = {
  create: async (data: CreateWebsiteInput) => {
    try {
      const website = await WebsiteModel.create(data);
      return { success: true, data: website };
    } catch (error: any) {
      throw new Error(error.message || 'Erreur création site');
    }
  },

  getById: async (id: string) => {
    try {
      const website = await WebsiteModel.findById(id);
      if (!website) return { success: false, error: 'Site introuvable' };
      return { success: true, data: website };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getAll: async () => {
    try {
      const websites = await WebsiteModel.findAll();
      return { success: true, data: websites };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getByUserId: async (userId: string) => {
    try {
      const websites = await WebsiteModel.findByUserId(userId);
      return { success: true, data: websites };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  update: async (id: string, data: UpdateWebsiteInput) => {
    try {
      const website = await WebsiteModel.update(id, data);
      return { success: true, data: website };
    } catch (error: any) {
      if (error.code === 'P2025') {
        return { success: false, error: 'Site introuvable' };
      }
      throw new Error(error.message);
    }
  },

  delete: async (id: string) => {
    try {
      await WebsiteModel.delete(id);
      return { success: true, message: 'Site supprimé' };
    } catch (error: any) {
      if (error.code === 'P2025') {
        return { success: false, error: 'Site introuvable' };
      }
      throw new Error(error.message);
    }
  },
};
