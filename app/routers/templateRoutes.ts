import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TemplateService } from '../services/templateService';
import {
  createTemplateSchema,
  getTemplateByIdSchema,
  getAllTemplatesSchema,
  getUserTemplatesSchema,
  getTemplatesByTypeSchema,
  getPublicTemplatesSchema,
  updateTemplateSchema,
  deleteTemplateSchema,
} from '../schemas/templateSchema';

interface TemplateQuerystring {
  isPublic?: boolean;
  isPredefined?: boolean;
  type?: string;
}

export async function templateRoutes(fastify: FastifyInstance) {
  
  // CREATE
  fastify.post('/', {
    schema: createTemplateSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await TemplateService.create(request.body as any);
      return reply.code(201).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET BY ID
  fastify.get('/:id', {
    schema: getTemplateByIdSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await TemplateService.getById(request.params.id);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET ALL (with optional filters)
  fastify.get('/', {
    schema: getAllTemplatesSchema,
  }, async (request: FastifyRequest<{ Querystring: TemplateQuerystring }>, reply: FastifyReply) => {
    try {
      const filters = request.query;
      const result = await TemplateService.getAll(filters);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET BY USER
  fastify.get('/users/:userId/templates', {
    schema: getUserTemplatesSchema,
  }, async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
    try {
      const result = await TemplateService.getByUserId(request.params.userId);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET BY TYPE
  fastify.get('/type/:type', {
    schema: getTemplatesByTypeSchema,
  }, async (request: FastifyRequest<{ Params: { type: string } }>, reply: FastifyReply) => {
    try {
      const result = await TemplateService.getByType(request.params.type);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET PUBLIC
  fastify.get('/public/all', {
    schema: getPublicTemplatesSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await TemplateService.getPublic();
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // UPDATE
  fastify.put('/:id', {
    schema: updateTemplateSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await TemplateService.update(request.params.id, request.body as any);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // DELETE
  fastify.delete('/:id', {
    schema: deleteTemplateSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await TemplateService.delete(request.params.id);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });
}