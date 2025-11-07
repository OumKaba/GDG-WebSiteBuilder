import { Type } from '@sinclair/typebox';

// Enum ComponentType
const ComponentTypeEnum = Type.Union([
  Type.Literal('HEADER'),
  Type.Literal('TEXT'),
  Type.Literal('BUTTON'),
  Type.Literal('IMAGE'),
  Type.Literal('CARD'),
  Type.Literal('COUNTDOWN'),
  Type.Literal('FORM'),
  Type.Literal('AGENDA'),
  Type.Literal('CAROUSEL'),
  Type.Literal('BULLET_LIST'),
  Type.Literal('TESTIMONIAL'),
  Type.Literal('GALLERY'),
  Type.Literal('SPEAKERS'),
  Type.Literal('COUNTER'),
  Type.Literal('NAVBAR'),
  Type.Literal('FOOTER'),
  Type.Literal('INNER_SECTION'),
]);

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
export const createComponentSchema = {
  tags: ['Component'],
  description: 'Créer un nouveau composant',
  body: Type.Object({
    type: ComponentTypeEnum,
    content: Type.Any({ description: 'Contenu JSON du composant' }),
    sectionId: Type.String({ description: 'ID de la section parent' }),
    order: Type.Optional(Type.Number({ minimum: 0 })),
    styles: Type.Optional(Type.Any({ description: 'Styles du composant' })),
  }),
  response: {
    200: SuccessResponse,
    400: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema GET BY ID
export const getComponentByIdSchema = {
  tags: ['Component'],
  description: 'Obtenir un composant par son ID',
  params: Type.Object({
    id: Type.String({ description: 'ID du composant' }),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema GET BY SECTION ID
export const getComponentsBySectionIdSchema = {
  tags: ['Component'],
  description: 'Obtenir tous les composants d\'une section',
  params: Type.Object({
    sectionId: Type.String({ description: 'ID de la section' }),
  }),
  response: {
    200: SuccessListResponse,
    500: ErrorResponse,
  },
};

// Schema UPDATE
export const updateComponentSchema = {
  tags: ['Component'],
  description: 'Mettre à jour un composant',
  params: Type.Object({
    id: Type.String({ description: 'ID du composant' }),
  }),
  body: Type.Object({
    type: Type.Optional(ComponentTypeEnum),
    content: Type.Optional(Type.Any({ description: 'Contenu JSON du composant' })),
    order: Type.Optional(Type.Number({ minimum: 0 })),
    styles: Type.Optional(Type.Any({ description: 'Styles du composant' })),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema REORDER
export const reorderComponentSchema = {
  tags: ['Component'],
  description: 'Réorganiser l\'ordre d\'un composant',
  body: Type.Object({
    id: Type.String({ description: 'ID du composant' }),
    newOrder: Type.Number({ minimum: 0, description: 'Nouvelle position' }),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema DELETE
export const deleteComponentSchema = {
  tags: ['Component'],
  description: 'Supprimer un composant',
  params: Type.Object({
    id: Type.String({ description: 'ID du composant' }),
  }),
  response: {
    200: DeleteResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema DUPLICATE
export const duplicateComponentSchema = {
  tags: ['Component'],
  description: 'Dupliquer un composant',
  params: Type.Object({
    id: Type.String({ description: 'ID du composant' }),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema MOVE TO SECTION
export const moveComponentToSectionSchema = {
  tags: ['Component'],
  description: 'Déplacer un composant vers une autre section',
  body: Type.Object({
    id: Type.String({ description: 'ID du composant' }),
    targetSectionId: Type.String({ description: 'ID de la section cible' }),
    newOrder: Type.Optional(Type.Number({ minimum: 0, description: 'Position dans la nouvelle section' })),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};