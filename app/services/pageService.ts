import { PageModel } from '../models/pageModel';
import type { CreatePageInput, UpdatePageInput, ReorderPageInput } from '../models/pageModel';

export const PageService = {
  create: async (data: CreatePageInput) => {
    try {
      const page = await PageModel.create(data);
      return { success: true, data: page };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getById: async (id: string) => {
    try {
      const page = await PageModel.findById(id);
      if (!page) return { success: false, error: 'Page introuvable' };
      return { success: true, data: page };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getBySlug: async (websiteId: string, slug: string) => {
    try {
      const page = await PageModel.findBySlug(websiteId, slug);
      if (!page) return { success: false, error: 'Page introuvable' };
      return { success: true, data: page };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getByWebsiteId: async (websiteId: string) => {
    try {
      const pages = await PageModel.findByWebsiteId(websiteId);
      return { success: true, data: pages };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getHomePage: async (websiteId: string) => {
    try {
      const page = await PageModel.findHomePage(websiteId);
      if (!page) return { success: false, error: 'Page d\'accueil introuvable' };
      return { success: true, data: page };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  update: async (id: string, data: UpdatePageInput) => {
    try {
      const page = await PageModel.update(id, data);
      return { success: true, data: page };
    } catch (error: any) {
      if (error.message === 'Page introuvable') {
        return { success: false, error: 'Page introuvable' };
      }
      if (error.message.includes('slug existe déjà')) {
        return { success: false, error: error.message };
      }
      return { success: false, error: error.message };
    }
  },

  reorder: async (data: ReorderPageInput) => {
    try {
      const page = await PageModel.reorder(data);
      return { success: true, data: page };
    } catch (error: any) {
      if (error.message === 'Page introuvable') {
        return { success: false, error: 'Page introuvable' };
      }
      return { success: false, error: error.message };
    }
  },

  delete: async (id: string) => {
    try {
      const result = await PageModel.delete(id);
      return { success: true, message: 'Page supprimée avec succès', data: result };
    } catch (error: any) {
      if (error.message === 'Page introuvable') {
        return { success: false, error: 'Page introuvable' };
      }
      if (error.message.includes('seule page d\'accueil')) {
        return { success: false, error: error.message };
      }
      return { success: false, error: error.message };
    }
  },

};