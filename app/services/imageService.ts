import { ImageModel } from '../models/imageModel';
import type { CreateImageInput, UpdateImageInput } from '../models/imageModel';

export const ImageService = {
  create: async (data: CreateImageInput) => {
    try {
      const image = await ImageModel.create(data);
      return { success: true, data: image };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getById: async (id: string) => {
    try {
      const image = await ImageModel.findById(id);
      if (!image) return { success: false, error: 'Image introuvable' };
      return { success: true, data: image };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getByUserId: async (userId: string, limit?: number, offset?: number) => {
    try {
      const result = await ImageModel.findByUserId(userId, { limit, offset });
      return { success: true, data: result };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getAll: async (limit?: number, offset?: number) => {
    try {
      const result = await ImageModel.findAll({ limit, offset });
      return { success: true, data: result };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  search: async (userId: string, searchTerm: string) => {
    try {
      const images = await ImageModel.searchByFilename(userId, searchTerm);
      return { success: true, data: images };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getByMimeType: async (userId: string, mimeType: string) => {
    try {
      const images = await ImageModel.findByMimeType(userId, mimeType);
      return { success: true, data: images };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getStats: async (userId: string) => {
    try {
      const stats = await ImageModel.getStats(userId);
      return { success: true, data: stats };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  update: async (id: string, data: UpdateImageInput) => {
    try {
      const image = await ImageModel.update(id, data);
      return { success: true, data: image };
    } catch (error: any) {
      if (error.code === 'P2025') {
        return { success: false, error: 'Image introuvable' };
      }
      return { success: false, error: error.message };
    }
  },

  delete: async (id: string) => {
    try {
      const result = await ImageModel.delete(id);
      return { 
        success: true, 
        message: 'Image supprimée avec succès', 
        data: result 
      };
    } catch (error: any) {
      if (error.message === 'Image introuvable') {
        return { success: false, error: 'Image introuvable' };
      }
      return { success: false, error: error.message };
    }
  },

  deleteMany: async (ids: string[], userId: string) => {
    try {
      const result = await ImageModel.deleteMany(ids, userId);
      return { 
        success: true, 
        message: `${result.deleted} image(s) supprimée(s) avec succès`, 
        data: result 
      };
    } catch (error: any) {
      if (error.message === 'Aucune image trouvée') {
        return { success: false, error: 'Aucune image trouvée' };
      }
      return { success: false, error: error.message };
    }
  },
};