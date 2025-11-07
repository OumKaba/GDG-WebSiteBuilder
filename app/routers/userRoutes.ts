import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/userService'; 
import {
  getUserByIdSchema,
  getUserByEmailSchema,
  getAllUsersSchema,
  updateUserSchema,
  deleteUserSchema,
} from '../schemas/user.schema';

export async function userRoutes(fastify: FastifyInstance) {
  
  // GET BY ID
  fastify.get('/:id', {
    schema: getUserByIdSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await UserService.getById(request.params.id);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET BY EMAIL
  fastify.get('/email/:email', {
    schema: getUserByEmailSchema,
  }, async (request: FastifyRequest<{ Params: { email: string } }>, reply: FastifyReply) => {
    try {
      const result = await UserService.getByEmail(request.params.email);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });


  // UPDATE
  fastify.put('/:id', {
    schema: updateUserSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await UserService.update(request.params.id, request.body as any);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

}