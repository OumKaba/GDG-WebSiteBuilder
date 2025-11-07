import { Type } from '@sinclair/typebox';

// Schema de base Image
const ImageSchema = Type.Object({
  id: Type.String(),
  filename: Type.String(),
  url: Type.String(),
  size: Type.Number(),
  mimeType: Type.String(),
  alt: Type.Union([Type.String(), Type.Null()]),
  userId: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
});

// Réponses communes
const SuccessResponse = Type.Object({
  success: Type.Literal(true),
  data: Type.Any(),
});

const SuccessListResponse = Type.Object({
  success: Type.Literal(true),
  data: Type.Object({
    images: Type.Array(Type.Any()),
    total: Type.Number(),
  }),
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
    url: Type.String(),
  }),
});

const DeleteManyResponse = Type.Object({
  success: Type.Literal(true),
  message: Type.String(),
  data: Type.Object({
    deleted: Type.Number(),
    urls: Type.Array(Type.String()),
  }),
});

// Schema CREATE
export const createImageSchema = {
  tags: ['Image'],
  description: 'Uploader une nouvelle image',
  body: Type.Object({
    filename: Type.String({ minLength: 1, maxLength: 255 }),
    url: Type.String({ format: 'uri' }),
    size: Type.Number({ minimum: 0 }),
    mimeType: Type.String({ pattern: '^image/' }),
    alt: Type.Optional(Type.String({ maxLength: 500 })),
    userId: Type.String(),
  }),
  response: {
    200: SuccessResponse,
    400: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema GET BY ID
export const getImageByIdSchema = {
  tags: ['Image'],
  description: 'Obtenir une image par son ID',
  params: Type.Object({
    id: Type.String({ description: 'ID de l\'image' }),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema GET BY USER ID
export const getImagesByUserIdSchema = {
  tags: ['Image'],
  description: 'Obtenir toutes les images d\'un utilisateur',
  params: Type.Object({
    userId: Type.String({ description: 'ID de l\'utilisateur' }),
  }),
  querystring: Type.Object({
    limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Number({ minimum: 0 })),
  }),
  response: {
    200: SuccessListResponse,
    500: ErrorResponse,
  },
};

// Schema GET ALL (admin)
export const getAllImagesSchema = {
  tags: ['Image'],
  description: 'Obtenir toutes les images (admin)',
  querystring: Type.Object({
    limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Number({ minimum: 0 })),
  }),
  response: {
    200: SuccessListResponse,
    500: ErrorResponse,
  },
};

// Schema SEARCH
export const searchImagesSchema = {
  tags: ['Image'],
  description: 'Rechercher des images par nom de fichier',
  params: Type.Object({
    userId: Type.String({ description: 'ID de l\'utilisateur' }),
  }),
  querystring: Type.Object({
    search: Type.String({ minLength: 1, description: 'Terme de recherche' }),
  }),
  response: {
    200: Type.Object({
      success: Type.Literal(true),
      data: Type.Array(Type.Any()),
    }),
    500: ErrorResponse,
  },
};

// Schema GET BY MIME TYPE
export const getImagesByMimeTypeSchema = {
  tags: ['Image'],
  description: 'Obtenir les images par type MIME',
  params: Type.Object({
    userId: Type.String({ description: 'ID de l\'utilisateur' }),
  }),
  querystring: Type.Object({
    mimeType: Type.String({ description: 'Type MIME (ex: image/png)' }),
  }),
  response: {
    200: Type.Object({
      success: Type.Literal(true),
      data: Type.Array(Type.Any()),
    }),
    500: ErrorResponse,
  },
};

// Schema GET STATS
export const getImageStatsSchema = {
  tags: ['Image'],
  description: 'Obtenir les statistiques d\'utilisation des images',
  params: Type.Object({
    userId: Type.String({ description: 'ID de l\'utilisateur' }),
  }),
  response: {
    200: Type.Object({
      success: Type.Literal(true),
      data: Type.Object({
        totalImages: Type.Number(),
        totalSize: Type.Number(),
        averageSize: Type.Number(),
      }),
    }),
    500: ErrorResponse,
  },
};

// Schema UPDATE
export const updateImageSchema = {
  tags: ['Image'],
  description: 'Mettre à jour une image',
  params: Type.Object({
    id: Type.String({ description: 'ID de l\'image' }),
  }),
  body: Type.Object({
    filename: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
    url: Type.Optional(Type.String({ format: 'uri' })),
    alt: Type.Optional(Type.String({ maxLength: 500 })),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema DELETE
export const deleteImageSchema = {
  tags: ['Image'],
  description: 'Supprimer une image',
  params: Type.Object({
    id: Type.String({ description: 'ID de l\'image' }),
  }),
  response: {
    200: DeleteResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema DELETE MANY
export const deleteManyImagesSchema = {
  tags: ['Image'],
  description: 'Supprimer plusieurs images',
  body: Type.Object({
    ids: Type.Array(Type.String(), { minItems: 1, maxItems: 100 }),
    userId: Type.String({ description: 'ID de l\'utilisateur' }),
  }),
  response: {
    200: DeleteManyResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};