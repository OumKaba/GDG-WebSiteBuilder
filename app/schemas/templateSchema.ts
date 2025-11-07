import { Type } from '@sinclair/typebox';

// Schema de base Template
const TemplateSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  type: Type.String(),
  thumbnail: Type.Union([Type.String(), Type.Null()]),
  content: Type.Any(),
  isPublic: Type.Boolean(),
  isPredefined: Type.Boolean(),
  userId: Type.Union([Type.String({ format: 'uuid' }), Type.Null()]),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  user: Type.Optional(Type.Union([
    Type.Object({
      id: Type.String({ format: 'uuid' }),
      email: Type.String({ format: 'email' }),
      name: Type.Union([Type.String(), Type.Null()]),
    }),
    Type.Null(),
  ])),
});

// Réponses communes
const SuccessResponse = Type.Object({
  success: Type.Literal(true),
  data: TemplateSchema,
});

const SuccessListResponse = Type.Object({
  success: Type.Literal(true),
  data: Type.Array(TemplateSchema),
});

const ErrorResponse = Type.Object({
  success: Type.Literal(false),
  error: Type.String(),
});

const DeleteResponse = Type.Object({
  success: Type.Literal(true),
  message: Type.String(),
});

// Schema CREATE
export const createTemplateSchema = {
  tags: ['Template'],
  description: 'Créer un nouveau template',
  body: Type.Object({
    name: Type.String({ minLength: 1, maxLength: 100, description: 'Nom du template' }),
    description: Type.Optional(Type.String({ maxLength: 500, description: 'Description du template' })),
    type: Type.String({ minLength: 1, description: 'Type du template (landing, blog, portfolio, etc.)' }),
    thumbnail: Type.Optional(Type.String({ description: 'URL de l\'image de prévisualisation' })),
    content: Type.Any({ description: 'Contenu JSON du template' }),
    isPublic: Type.Optional(Type.Boolean({ default: false, description: 'Template public ou privé' })),
    isPredefined: Type.Optional(Type.Boolean({ default: false, description: 'Template prédéfini par le système' })),
    userId: Type.Optional(Type.String({ format: 'uuid', description: 'ID de l\'utilisateur créateur' })),
  }),
  response: {
    201: SuccessResponse,
    500: ErrorResponse,
  },
};

// Schema GET BY ID
export const getTemplateByIdSchema = {
  tags: ['Template'],
  description: 'Obtenir un template par son ID',
  params: Type.Object({
    id: Type.String({ format: 'uuid', description: 'ID du template' }),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema GET ALL
export const getAllTemplatesSchema = {
  tags: ['Template'],
  description: 'Obtenir tous les templates',
  querystring: Type.Optional(Type.Object({
    isPublic: Type.Optional(Type.Boolean({ description: 'Filtrer par templates publics' })),
    isPredefined: Type.Optional(Type.Boolean({ description: 'Filtrer par templates prédéfinis' })),
    type: Type.Optional(Type.String({ description: 'Filtrer par type de template' })),
  })),
  response: {
    200: SuccessListResponse,
    500: ErrorResponse,
  },
};

// Schema GET BY USER
export const getUserTemplatesSchema = {
  tags: ['Template'],
  description: 'Obtenir tous les templates d\'un utilisateur',
  params: Type.Object({
    userId: Type.String({ format: 'uuid', description: 'ID de l\'utilisateur' }),
  }),
  response: {
    200: SuccessListResponse,
    500: ErrorResponse,
  },
};

// Schema GET BY TYPE
export const getTemplatesByTypeSchema = {
  tags: ['Template'],
  description: 'Obtenir les templates par type',
  params: Type.Object({
    type: Type.String({ description: 'Type du template' }),
  }),
  response: {
    200: SuccessListResponse,
    500: ErrorResponse,
  },
};

// Schema GET PUBLIC
export const getPublicTemplatesSchema = {
  tags: ['Template'],
  description: 'Obtenir tous les templates publics',
  response: {
    200: SuccessListResponse,
    500: ErrorResponse,
  },
};

// Schema UPDATE
export const updateTemplateSchema = {
  tags: ['Template'],
  description: 'Mettre à jour un template',
  params: Type.Object({
    id: Type.String({ format: 'uuid', description: 'ID du template' }),
  }),
  body: Type.Object({
    name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
    description: Type.Optional(Type.Union([Type.String({ maxLength: 500 }), Type.Null()])),
    type: Type.Optional(Type.String()),
    thumbnail: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    content: Type.Optional(Type.Any()),
    isPublic: Type.Optional(Type.Boolean()),
    isPredefined: Type.Optional(Type.Boolean()),
    userId: Type.Optional(Type.Union([Type.String({ format: 'uuid' }), Type.Null()])),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema DELETE
export const deleteTemplateSchema = {
  tags: ['Template'],
  description: 'Supprimer un template',
  params: Type.Object({
    id: Type.String({ format: 'uuid', description: 'ID du template' }),
  }),
  response: {
    200: DeleteResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};