// FICHIER 1: schemas/websiteSchema.ts
import { Type } from '@sinclair/typebox';

// Schema de base Website
const WebsiteSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  content: Type.Any(),
  theme: Type.String(),
  status: Type.String(),
  seoScore: Type.Union([Type.Number(), Type.Null()]),
  templateId: Type.Union([Type.String({ format: 'uuid' }), Type.Null()]),
  userId: Type.String({ format: 'uuid' }),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  user: Type.Optional(Type.Object({
    id: Type.String({ format: 'uuid' }),
    email: Type.String({ format: 'email' }),
    name: Type.Union([Type.String(), Type.Null()]),
  })),
  template: Type.Optional(Type.Union([
    Type.Object({
      id: Type.String({ format: 'uuid' }),
      name: Type.String(),
      type: Type.String(),
    }),
    Type.Null(),
  ])),
});

// Réponses communes
const SuccessResponse = Type.Object({
  success: Type.Literal(true),
  data: WebsiteSchema,
});

const SuccessListResponse = Type.Object({
  success: Type.Literal(true),
  data: Type.Array(WebsiteSchema),
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
export const createWebsiteSchema = {
  tags: ['Website'],
  description: 'Créer un nouveau site web',
  body: Type.Object({
    name: Type.String({ minLength: 1, maxLength: 100, description: 'Nom du site web' }),
    description: Type.Optional(Type.String({ maxLength: 500, description: 'Description du site' })),
    content: Type.Any({ description: 'Contenu JSON du site' }),
    theme: Type.Optional(Type.Union([
      Type.Literal('light'),
      Type.Literal('dark'),
      Type.Literal('custom'),
    ], { default: 'light', description: 'Thème du site' })),
    status: Type.Optional(Type.Union([
      Type.Literal('draft'),
      Type.Literal('published'),
      Type.Literal('archived'),
    ], { default: 'draft', description: 'Statut du site' })),
    seoScore: Type.Optional(Type.Number({ minimum: 0, maximum: 100, description: 'Score SEO' })),
    templateId: Type.Optional(Type.String({ format: 'uuid', description: 'ID du template utilisé' })),
    userId: Type.String({ format: 'uuid', description: 'ID de l\'utilisateur propriétaire' }),
  }),
  response: {
    201: SuccessResponse,
    500: ErrorResponse,
  },
};

// Schema GET BY ID
export const getWebsiteByIdSchema = {
  tags: ['Website'],
  description: 'Obtenir un site web par son ID',
  params: Type.Object({
    id: Type.String({ format: 'uuid', description: 'ID du site web' }),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema GET ALL
export const getAllWebsitesSchema = {
  tags: ['Website'],
  description: 'Obtenir tous les sites web',
  response: {
    200: SuccessListResponse,
    500: ErrorResponse,
  },
};

// Schema GET BY USER
export const getUserWebsitesSchema = {
  tags: ['Website'],
  description: 'Obtenir tous les sites web d\'un utilisateur',
  params: Type.Object({
    userId: Type.String({ format: 'uuid', description: 'ID de l\'utilisateur' }),
  }),
  response: {
    200: SuccessListResponse,
    500: ErrorResponse,
  },
};

// Schema UPDATE
export const updateWebsiteSchema = {
  tags: ['Website'],
  description: 'Mettre à jour un site web',
  params: Type.Object({
    id: Type.String({ format: 'uuid', description: 'ID du site web' }),
  }),
  body: Type.Object({
    name: Type.Optional(Type.String({ minLength: 1, maxLength: 100, description: 'Nom du site web' })),
    description: Type.Optional(Type.Union([Type.String({ maxLength: 500 }), Type.Null()])),
    content: Type.Optional(Type.Any({ description: 'Contenu JSON du site' })),
    theme: Type.Optional(Type.Union([
      Type.Literal('light'),
      Type.Literal('dark'),
      Type.Literal('custom'),
    ])),
    status: Type.Optional(Type.Union([
      Type.Literal('draft'),
      Type.Literal('published'),
      Type.Literal('archived'),
    ])),
    seoScore: Type.Optional(Type.Union([Type.Number({ minimum: 0, maximum: 100 }), Type.Null()])),
    templateId: Type.Optional(Type.Union([Type.String({ format: 'uuid' }), Type.Null()])),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema DELETE
export const deleteWebsiteSchema = {
  tags: ['Website'],
  description: 'Supprimer un site web',
  params: Type.Object({
    id: Type.String({ format: 'uuid', description: 'ID du site web' }),
  }),
  response: {
    200: DeleteResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

