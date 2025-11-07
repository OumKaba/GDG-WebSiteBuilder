import { Type } from '@sinclair/typebox';

// Réponses communes
const SuccessResponse = Type.Object({
  success: Type.Literal(true),
  data: Type.Any(),
});

const SuccessListResponse = Type.Object({
  success: Type.Literal(true),
  data: Type.Array(Type.Any()),
});

const ErrorResponse = Type.Object({
  success: Type.Literal(false),
  error: Type.String(),
});

const DeleteResponse = Type.Object({
  success: Type.Literal(true),
  message: Type.String(),
  data: Type.Object({
    id: Type.String(),
    deleted: Type.Boolean(),
  }),
});

// Schema CREATE
export const createPageSchema = {
  tags: ['Page'],
  description: 'Créer une nouvelle page',
  body: Type.Object({
    name: Type.String({ minLength: 1, maxLength: 200 }),
    slug: Type.String({ 
      minLength: 1, 
      maxLength: 200,
      pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
      description: 'Slug URL-friendly (ex: ma-page)'
    }),
    websiteId: Type.String({ description: 'ID du site web' }),
    isHome: Type.Optional(Type.Boolean({ description: 'Définir comme page d\'accueil' })),
    order: Type.Optional(Type.Number({ minimum: 0 })),
  }),
  response: {
    200: SuccessResponse,
    400: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema GET BY ID
export const getPageByIdSchema = {
  tags: ['Page'],
  description: 'Obtenir une page par son ID',
  params: Type.Object({
    id: Type.String({ description: 'ID de la page' }),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema GET BY SLUG
export const getPageBySlugSchema = {
  tags: ['Page'],
  description: 'Obtenir une page par son slug',
  params: Type.Object({
    websiteId: Type.String({ description: 'ID du site web' }),
    slug: Type.String({ description: 'Slug de la page' }),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema GET BY WEBSITE ID
export const getPagesByWebsiteIdSchema = {
  tags: ['Page'],
  description: 'Obtenir toutes les pages d\'un site web',
  params: Type.Object({
    websiteId: Type.String({ description: 'ID du site web' }),
  }),
  response: {
    200: SuccessListResponse,
    500: ErrorResponse,
  },
};

// Schema GET HOME PAGE
export const getHomePageSchema = {
  tags: ['Page'],
  description: 'Obtenir la page d\'accueil d\'un site',
  params: Type.Object({
    websiteId: Type.String({ description: 'ID du site web' }),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema UPDATE
export const updatePageSchema = {
  tags: ['Page'],
  description: 'Mettre à jour une page',
  params: Type.Object({
    id: Type.String({ description: 'ID de la page' }),
  }),
  body: Type.Object({
    name: Type.Optional(Type.String({ minLength: 1, maxLength: 200 })),
    slug: Type.Optional(Type.String({ 
      minLength: 1, 
      maxLength: 200,
      pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    })),
    isHome: Type.Optional(Type.Boolean()),
    order: Type.Optional(Type.Number({ minimum: 0 })),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    400: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema REORDER
export const reorderPageSchema = {
  tags: ['Page'],
  description: 'Réorganiser l\'ordre d\'une page',
  body: Type.Object({
    id: Type.String({ description: 'ID de la page' }),
    newOrder: Type.Number({ minimum: 0, description: 'Nouvelle position' }),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema DELETE
export const deletePageSchema = {
  tags: ['Page'],
  description: 'Supprimer une page',
  params: Type.Object({
    id: Type.String({ description: 'ID de la page' }),
  }),
  response: {
    200: DeleteResponse,
    404: ErrorResponse,
    400: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema DUPLICATE
export const duplicatePageSchema = {
  tags: ['Page'],
  description: 'Dupliquer une page avec toutes ses sections et composants',
  params: Type.Object({
    id: Type.String({ description: 'ID de la page' }),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};