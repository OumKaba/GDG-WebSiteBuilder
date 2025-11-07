import { Type } from '@sinclair/typebox';

// Schema de base User
const UserSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  email: Type.String({ format: 'email' }),
  name: Type.Union([Type.String(), Type.Null()]),
  provider: Type.String(),
  isVerified: Type.Boolean(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

// Réponses communes
const SuccessResponse = Type.Object({
  success: Type.Literal(true),
  data: UserSchema,
});

const SuccessListResponse = Type.Object({
  success: Type.Literal(true),
  data: Type.Array(UserSchema),
});

const ErrorResponse = Type.Object({
  success: Type.Literal(false),
  error: Type.String(),
});

const DeleteResponse = Type.Object({
  success: Type.Literal(true),
  message: Type.String(),
});

// Schema GET BY ID
export const getUserByIdSchema = {
  tags: ['User'],
  description: 'Obtenir un utilisateur par son ID',
  params: Type.Object({
    id: Type.String({ format: 'uuid', description: 'ID de l\'utilisateur' }),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema GET BY EMAIL
export const getUserByEmailSchema = {
  tags: ['User'],
  description: 'Obtenir un utilisateur par son email',
  params: Type.Object({
    email: Type.String({ format: 'email', description: 'Email de l\'utilisateur' }),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema GET ALL
export const getAllUsersSchema = {
  tags: ['User'],
  description: 'Obtenir tous les utilisateurs',
  response: {
    200: SuccessListResponse,
    500: ErrorResponse,
  },
};

// Schema UPDATE
export const updateUserSchema = {
  tags: ['User'],
  description: 'Mettre à jour un utilisateur',
  params: Type.Object({
    id: Type.String({ format: 'uuid', description: 'ID de l\'utilisateur' }),
  }),
  body: Type.Object({
    name: Type.Optional(Type.Union([Type.String({ maxLength: 100 }), Type.Null()])),
    email: Type.Optional(Type.String({ format: 'email' })),
  }),
  response: {
    200: SuccessResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Schema DELETE
export const deleteUserSchema = {
  tags: ['User'],
  description: 'Supprimer un utilisateur',
  params: Type.Object({
    id: Type.String({ format: 'uuid', description: 'ID de l\'utilisateur' }),
  }),
  response: {
    200: DeleteResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};