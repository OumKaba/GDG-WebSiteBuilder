import { Type } from '@sinclair/typebox';

// Schema de base Section
const SectionSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  order: Type.Number(),
  pageId: Type.Union([Type.String(), Type.Null()]),
  templateId: Type.Union([Type.String(), Type.Null()]),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

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
export const createSectionSchema = {
  tags: ['Section'],
  description: 'Créer une nouvelle section',
  body: Type.Object({
    name: Type.String({ minLength: 1, maxLength: 200 }),
    pageId: Type.Optional(Type.String()),
    templateId: Type.Optional(Type.String()),
    order: Type.Optional(Type.Number({ minimum: 0 })),
  }),
  response: {
    200: SuccessResponse,
    400: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema GET BY ID
export const getSectionByIdSchema = {
  tags: ['Section'],
  description: 'Obtenir une section par son ID',
  params: Type.Object({
    id: Type.String({ description: 'ID de la section' }),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema GET BY PAGE ID
export const getSectionsByPageIdSchema = {
  tags: ['Section'],
  description: 'Obtenir toutes les sections d\'une page',
  params: Type.Object({
    pageId: Type.String({ description: 'ID de la page' }),
  }),
  response: {
    200: SuccessListResponse,
    500: ErrorResponse,
  },
};

// Schema GET BY TEMPLATE ID
export const getSectionsByTemplateIdSchema = {
  tags: ['Section'],
  description: 'Obtenir toutes les sections d\'un template',
  params: Type.Object({
    templateId: Type.String({ description: 'ID du template' }),
  }),
  response: {
    200: SuccessListResponse,
    500: ErrorResponse,
  },
};

// Schema UPDATE
export const updateSectionSchema = {
  tags: ['Section'],
  description: 'Mettre à jour une section',
  params: Type.Object({
    id: Type.String({ description: 'ID de la section' }),
  }),
  body: Type.Object({
    name: Type.Optional(Type.String({ minLength: 1, maxLength: 200 })),
    order: Type.Optional(Type.Number({ minimum: 0 })),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema REORDER
export const reorderSectionSchema = {
  tags: ['Section'],
  description: 'Réorganiser l\'ordre d\'une section',
  body: Type.Object({
    id: Type.String({ description: 'ID de la section' }),
    newOrder: Type.Number({ minimum: 0, description: 'Nouvelle position' }),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema DELETE
export const deleteSectionSchema = {
  tags: ['Section'],
  description: 'Supprimer une section',
  params: Type.Object({
    id: Type.String({ description: 'ID de la section' }),
  }),
  response: {
    200: DeleteResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema DUPLICATE
export const duplicateSectionSchema = {
  tags: ['Section'],
  description: 'Dupliquer une section',
  params: Type.Object({
    id: Type.String({ description: 'ID de la section' }),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};