import { UserModel } from '../models/userModel';
import { PasswordUtils } from '../utils/password';
import { JwtUtils } from '../utils/jwt';

export const AuthService = {
  // Registration avec Email
  register: async (email: string, password: string, name?: string) => {
    try {
      // Vérifier si l'email existe déjà
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return { success: false, error: 'Cet email est déjà utilisé' };
      }

      // Valider le mot de passe
      const passwordValidation = PasswordUtils.validate(password);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.message };
      }

      // Hasher le mot de passe
      const hashedPassword = await PasswordUtils.hash(password);

      // Créer l'utilisateur
      const user = await UserModel.create({
        email,
        password: hashedPassword,
        name,
        provider: 'email',
      });

      // Générer le token
      const token = JwtUtils.generateToken({
        userId: user.id,
        email: user.email,
        provider: user.provider,
      });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isVerified: user.isVerified,
          },
          token,
        },
      };
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de l\'inscription');
    }
  },

  // Login avec Email
  login: async (email: string, password: string) => {
    try {
      // Trouver l'utilisateur
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return { success: false, error: 'Email ou mot de passe incorrect' };
      }

      // Vérifier que c'est un compte email (pas Google)
      if (user.provider !== 'email') {
        return { 
          success: false, 
          error: `Ce compte utilise l'authentification ${user.provider}` 
        };
      }

      // Vérifier le mot de passe
      if (!user.password) {
        return { success: false, error: 'Mot de passe non défini' };
      }

      const isPasswordValid = await PasswordUtils.compare(password, user.password);
      if (!isPasswordValid) {
        return { success: false, error: 'Email ou mot de passe incorrect' };
      }

      // Générer le token
      const token = JwtUtils.generateToken({
        userId: user.id,
        email: user.email,
        provider: user.provider,
      });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isVerified: user.isVerified,
          },
          token,
        },
      };
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de la connexion');
    }
  },

  // Login/Register avec Google
  googleAuth: async (googleProfile: any) => {
    try {
      const { id: googleId, email, name, picture } = googleProfile;

      // Chercher si l'utilisateur existe déjà
      let user = await UserModel.findByGoogleId(googleId);

      if (!user) {
        // Vérifier si un compte existe avec cet email
        const existingEmailUser = await UserModel.findByEmail(email);
        
        if (existingEmailUser) {
          return { 
            success: false, 
            error: 'Un compte existe déjà avec cet email' 
          };
        }

        // Créer un nouveau compte
        user = await UserModel.create({
          email,
          name,
          provider: 'google',
          providerId: googleId,
        });
      }

      // Générer le token
      const token = JwtUtils.generateToken({
        userId: user.id,
        email: user.email,
        provider: user.provider,
      });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isVerified: user.isVerified,
          },
          token,
        },
      };
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de l\'authentification Google');
    }
  },

  // Get user profile
  getProfile: async (userId: string) => {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return { success: false, error: 'Utilisateur introuvable' };
      }

      return { success: true, data: user };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};