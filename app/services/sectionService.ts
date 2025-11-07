import { SectionModel } from '../models/sectionModel';
import type { CreateSectionInput, UpdateSectionInput, ReorderSectionInput } from '../models/sectionModel';

export const SectionService = {
  create: async (data: CreateSectionInput) => {
    try {
      const section = await SectionModel.create(data);
      return { success: true, data: section };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getById: async (id: string) => {
    try {
      const section = await SectionModel.findById(id);
      if (!section) return { success: false, error: 'Section introuvable' };
      return { success: true, data: section };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getByPageId: async (pageId: string) => {
    try {
      const sections = await SectionModel.findByPageId(pageId);
      return { success: true, data: sections };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getByTemplateId: async (templateId: string) => {
    try {
      const sections = await SectionModel.findByTemplateId(templateId);
      return { success: true, data: sections };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  update: async (id: string, data: UpdateSectionInput) => {
    try {
      const section = await SectionModel.update(id, data);
      return { success: true, data: section };
    } catch (error: any) {
      if (error.message === 'Section introuvable') {
        return { success: false, error: 'Section introuvable' };
      }
      return { success: false, error: error.message };
    }
  },

  reorder: async (data: ReorderSectionInput) => {
    try {
      const section = await SectionModel.reorder(data);
      return { success: true, data: section };
    } catch (error: any) {
      if (error.message === 'Section introuvable') {
        return { success: false, error: 'Section introuvable' };
      }
      return { success: false, error: error.message };
    }
  },

  delete: async (id: string) => {
    try {
      const result = await SectionModel.delete(id);
      return { success: true, message: 'Section supprimée avec succès', data: result };
    } catch (error: any) {
      if (error.message === 'Section introuvable') {
        return { success: false, error: 'Section introuvable' };
      }
      return { success: false, error: error.message };
    }
  },

};