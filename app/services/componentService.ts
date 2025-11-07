import { ComponentModel } from '../models/componentModel';
import type { CreateComponentInput, UpdateComponentInput, ReorderComponentInput } from '../models/componentModel';

export const ComponentService = {
  create: async (data: CreateComponentInput) => {
    try {
      const component = await ComponentModel.create(data);
      return { success: true, data: component };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getById: async (id: string) => {
    try {
      const component = await ComponentModel.findById(id);
      if (!component) return { success: false, error: 'Composant introuvable' };
      return { success: true, data: component };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getBySectionId: async (sectionId: string) => {
    try {
      const components = await ComponentModel.findBySectionId(sectionId);
      return { success: true, data: components };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  update: async (id: string, data: UpdateComponentInput) => {
    try {
      const component = await ComponentModel.update(id, data);
      return { success: true, data: component };
    } catch (error: any) {
      if (error.message === 'Composant introuvable') {
        return { success: false, error: 'Composant introuvable' };
      }
      return { success: false, error: error.message };
    }
  },

  reorder: async (data: ReorderComponentInput) => {
    try {
      const component = await ComponentModel.reorder(data);
      return { success: true, data: component };
    } catch (error: any) {
      if (error.message === 'Composant introuvable') {
        return { success: false, error: 'Composant introuvable' };
      }
      return { success: false, error: error.message };
    }
  },

  delete: async (id: string) => {
    try {
      const result = await ComponentModel.delete(id);
      return { success: true, message: 'Composant supprimé avec succès', data: result };
    } catch (error: any) {
      if (error.message === 'Composant introuvable') {
        return { success: false, error: 'Composant introuvable' };
      }
      return { success: false, error: error.message };
    }
  },

  duplicate: async (id: string) => {
    try {
      const component = await ComponentModel.duplicate(id);
      return { success: true, data: component };
    } catch (error: any) {
      if (error.message === 'Composant introuvable') {
        return { success: false, error: 'Composant introuvable' };
      }
      return { success: false, error: error.message };
    }
  },

  moveToSection: async (id: string, targetSectionId: string, newOrder?: number) => {
    try {
      const component = await ComponentModel.moveToSection(id, targetSectionId, newOrder);
      return { success: true, data: component };
    } catch (error: any) {
      if (error.message === 'Composant introuvable') {
        return { success: false, error: 'Composant introuvable' };
      }
      return { success: false, error: error.message };
    }
  },
};