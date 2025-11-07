import { TemplateModel } from '../models/templateModel';
import type { CreateTemplateInput, UpdateTemplateInput, TemplateFilters } from '../models/templateModel';

export const TemplateService = {
  create: async (data: CreateTemplateInput) => {
    try {
      const template = await TemplateModel.create(data);
      return { success: true, data: template };
    } catch (error: any) {
      throw new Error(error.message || 'Erreur création template');
    }
  },

  getById: async (id: string) => {
    try {
      const template = await TemplateModel.findById(id);
      if (!template) return { success: false, error: 'Template introuvable' };
      return { success: true, data: template };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getAll: async (filters?: TemplateFilters) => {
    try {
      const templates = await TemplateModel.findAll(filters);
      return { success: true, data: templates };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getByUserId: async (userId: string) => {
    try {
      const templates = await TemplateModel.findByUserId(userId);
      return { success: true, data: templates };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getByType: async (type: string) => {
    try {
      const templates = await TemplateModel.findByType(type);
      return { success: true, data: templates };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getPublic: async () => {
    try {
      const templates = await TemplateModel.findPublic();
      return { success: true, data: templates };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  update: async (id: string, data: UpdateTemplateInput) => {
    try {
      const template = await TemplateModel.update(id, data);
      return { success: true, data: template };
    } catch (error: any) {
      if (error.code === 'P2025') {
        return { success: false, error: 'Template introuvable' };
      }
      throw new Error(error.message);
    }
  },

  delete: async (id: string) => {
    try {
      await TemplateModel.delete(id);
      return { success: true, message: 'Template supprimé' };
    } catch (error: any) {
      if (error.code === 'P2025') {
        return { success: false, error: 'Template introuvable' };
      }
      throw new Error(error.message);
    }
  },
};