import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/authService';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
  registerSchema,
  loginSchema,
  googleAuthSchema,  
  getProfileSchema,
  logoutSchema,      
} from '../schemas/authSchema';

export async function authRoutes(fastify: FastifyInstance) {
  
  // REGISTER avec Email
  fastify.post('/auth/register', {
    schema: registerSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password, name } = request.body as any;
      const result = await AuthService.register(email, password, name);
      
      if (!result.success) {
        return reply.code(400).send(result);
      }
      
      return reply.code(201).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // LOGIN avec Email
  fastify.post('/auth/login', {
    schema: loginSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = request.body as any;
      const result = await AuthService.login(email, password);
      
      if (!result.success) {
        return reply.code(401).send(result);
      }
      
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GOOGLE AUTH 
  fastify.post('/auth/google', {
    schema: googleAuthSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { code } = request.body as any;
      
      if (!code) {
        return reply.code(400).send({ 
          success: false, 
          error: 'Code Google manquant' 
        });
      }

      // Exchange code for token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          grant_type: 'authorization_code',
        }),
      });

      const tokens = await tokenResponse.json() as any;
      
      if (!tokens.access_token) {
        return reply.code(400).send({
          success: false,
          error: 'Échec de l\'obtention du token Google',
        });
      }

      // Get user info from Google
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      const googleProfile = await userResponse.json() as any;
      
      // Authenticate or create user
      const result = await AuthService.googleAuth(googleProfile);
      
      if (!result.success) {
        return reply.code(400).send(result);
      }

      return reply.code(200).send(result);
      
    } catch (error: any) {
      return reply.code(500).send({ 
        success: false, 
        error: error.message || 'Erreur lors de l\'authentification Google' 
      });
    }
  });

  // GET PROFILE (Protected Route avec token)
  fastify.get('/auth/profile', {
    schema: getProfileSchema,
    preHandler: [authMiddleware],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await AuthService.getProfile(request.user!.userId);
      
      if (!result.success) {
        return reply.code(404).send(result);
      }
      
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // LOGOUT (pas de paramètres)
  fastify.post('/auth/logout', {
    schema: logoutSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    // Avec JWT, le logout est géré côté client
    // Le frontend supprime simplement le token du localStorage
    return reply.code(200).send({
      success: true,
      message: 'Déconnexion réussie',
    });
  });
}