import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ComponentService } from '../services/componentService';
import {
  createComponentSchema,
  getComponentByIdSchema,
  getComponentsBySectionIdSchema,
  updateComponentSchema,
  reorderComponentSchema,
  deleteComponentSchema,
  duplicateComponentSchema,
  moveComponentToSectionSchema,
} from '../schemas/componentSchema';

export async function componentRoutes(fastify: FastifyInstance) {
  
  // CREATE
  fastify.post('/', {
    schema: createComponentSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await ComponentService.create(request.body as any);
      if (!result.success) return reply.code(400).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET BY ID
  fastify.get('/:id', {
    schema: getComponentByIdSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await ComponentService.getById(request.params.id);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET BY SECTION ID
  fastify.get('/section/:sectionId', {
    schema: getComponentsBySectionIdSchema,
  }, async (request: FastifyRequest<{ Params: { sectionId: string } }>, reply: FastifyReply) => {
    try {
      const result = await ComponentService.getBySectionId(request.params.sectionId);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // UPDATE
  fastify.put('/:id', {
    schema: updateComponentSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await ComponentService.update(request.params.id, request.body as any);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // REORDER
  fastify.patch('/reorder', {
    schema: reorderComponentSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await ComponentService.reorder(request.body as any);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // DELETE
  fastify.delete('/:id', {
    schema: deleteComponentSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await ComponentService.delete(request.params.id);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // DUPLICATE
  fastify.post('/:id/duplicate', {
    schema: duplicateComponentSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await ComponentService.duplicate(request.params.id);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // MOVE TO SECTION
  fastify.patch('/move', {
    schema: moveComponentToSectionSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id, targetSectionId, newOrder } = request.body as any;
      const result = await ComponentService.moveToSection(id, targetSectionId, newOrder);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });
}