import { Type } from '@sinclair/typebox';

// Schema de base User
const UserResponseSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  email: Type.String({ format: 'email' }),
  name: Type.Union([Type.String(), Type.Null()]),
  isVerified: Type.Boolean(),
});

// Réponse d'authentification complète (avec token)
const AuthSuccessResponse = Type.Object({
  success: Type.Literal(true),
  data: Type.Object({
    user: UserResponseSchema,
    token: Type.String({ description: 'JWT Token' }),
  }),
});

// Réponse d'erreur
const ErrorResponse = Type.Object({
  success: Type.Literal(false),
  error: Type.String(),
});

// REGISTER Schema
export const registerSchema = {
  tags: ['Auth'],
  description: 'Inscription avec email et mot de passe',
  body: Type.Object({
    email: Type.String({ format: 'email', description: 'Email de l\'utilisateur' }),
    password: Type.String({ 
      minLength: 8, 
      description: 'Mot de passe (min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre)' 
    }),
    name: Type.Optional(Type.String({ description: 'Nom de l\'utilisateur' })),
  }),
  response: {
    201: AuthSuccessResponse,
    400: ErrorResponse,
    500: ErrorResponse,
  },
};

// LOGIN Schema
export const loginSchema = {
  tags: ['Auth'],
  description: 'Connexion avec email et mot de passe',
  body: Type.Object({
    email: Type.String({ format: 'email', description: 'Email' }),
    password: Type.String({ description: 'Mot de passe' }),
  }),
  response: {
    200: AuthSuccessResponse,
    401: ErrorResponse,
    500: ErrorResponse,
  },
};

// GOOGLE AUTH Schema 
export const googleAuthSchema = {
  tags: ['Auth'],
  description: 'Authentification Google avec code OAuth',
  body: Type.Object({
    code: Type.String({ description: 'Code OAuth retourné par Google' }),
  }),
  response: {
    200: AuthSuccessResponse,
    400: ErrorResponse,
    500: ErrorResponse,
  },
};

export const getProfileSchema = {
  tags: ['Auth'],
  description: 'Obtenir le profil de l\'utilisateur connecté',
  headers: Type.Object({
    authorization: Type.String({ 
      description: 'Bearer token',
      pattern: '^Bearer .+',
      examples: ['Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...']
    }),
  }),
  response: {
    200: Type.Object({
      success: Type.Literal(true),
      data: UserResponseSchema,
    }),
    401: ErrorResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

export const logoutSchema = {
  tags: ['Auth'],
  description: 'Déconnexion (le frontend supprime le token du localStorage)',
  summary: 'Logout utilisateur',
  response: {
    200: Type.Object({
      success: Type.Literal(true),
      message: Type.String({ default: 'Déconnexion réussie' }),
    }),
  },
};