import { UserModel } from '../models/userModel';
import type { UpdateUserInput } from '../models/userModel';


export const UserService = {
  getById: async (id: string) => {
    try {
      const user = await UserModel.findById(id);
      if (!user) return { success: false, error: 'Utilisateur introuvable' };
      return { success: true, data: user };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getByEmail: async (email: string) => {
    try {
      const user = await UserModel.findByEmail(email);
      if (!user) return { success: false, error: 'Utilisateur introuvable' };
      return { success: true, data: user };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  update: async (id: string, data: UpdateUserInput) => {
    try {
      const user = await UserModel.update(id, data);
      return { success: true, data: user };
    } catch (error: any) {
      if (error.code === 'P2025') {
        return { success: false, error: 'Utilisateur introuvable' };
      }
      throw new Error(error.message);
    }
  },

};