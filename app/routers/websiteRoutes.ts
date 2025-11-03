import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { WebsiteService } from '../services/websiteService';
import {
  createWebsiteSchema,
  getWebsiteByIdSchema,
  getAllWebsitesSchema,
  getUserWebsitesSchema,
  updateWebsiteSchema,
  deleteWebsiteSchema,
} from '../schemas/website.schema';

export async function websiteRoutes(fastify: FastifyInstance) {
  
  // CREATE
  fastify.post('/', {
    schema: createWebsiteSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await WebsiteService.create(request.body as any);
      return reply.code(201).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET BY ID
  fastify.get('/:id', {
    schema: getWebsiteByIdSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await WebsiteService.getById(request.params.id);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET ALL
  fastify.get('/', {
    schema: getAllWebsitesSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await WebsiteService.getAll();
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET BY USER
  fastify.get('/users/:userId/websites', {
    schema: getUserWebsitesSchema,
  }, async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
    try {
      const result = await WebsiteService.getByUserId(request.params.userId);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // UPDATE
  fastify.put('/:id', {
    schema: updateWebsiteSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await WebsiteService.update(request.params.id, request.body as any);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // DELETE
  fastify.delete('/:id', {
    schema: deleteWebsiteSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await WebsiteService.delete(request.params.id);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });
}