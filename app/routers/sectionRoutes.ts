import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { SectionService } from '../services/sectionService';
import {
  createSectionSchema,
  getSectionByIdSchema,
  getSectionsByPageIdSchema,
  getSectionsByTemplateIdSchema,
  updateSectionSchema,
  reorderSectionSchema,
  deleteSectionSchema,
} from '../schemas/sectionSchema';

export async function sectionRoutes(fastify: FastifyInstance) {
  
  // CREATE
  fastify.post('/', {
    schema: createSectionSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await SectionService.create(request.body as any);
      if (!result.success) return reply.code(400).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET BY ID
  fastify.get('/:id', {
    schema: getSectionByIdSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await SectionService.getById(request.params.id);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET BY PAGE ID
  fastify.get('/page/:pageId', {
    schema: getSectionsByPageIdSchema,
  }, async (request: FastifyRequest<{ Params: { pageId: string } }>, reply: FastifyReply) => {
    try {
      const result = await SectionService.getByPageId(request.params.pageId);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET BY TEMPLATE ID
  fastify.get('/template/:templateId', {
    schema: getSectionsByTemplateIdSchema,
  }, async (request: FastifyRequest<{ Params: { templateId: string } }>, reply: FastifyReply) => {
    try {
      const result = await SectionService.getByTemplateId(request.params.templateId);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // UPDATE
  fastify.put('/:id', {
    schema: updateSectionSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await SectionService.update(request.params.id, request.body as any);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // REORDER
  fastify.patch('/reorder', {
    schema: reorderSectionSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await SectionService.reorder(request.body as any);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // DELETE
  fastify.delete('/:id', {
    schema: deleteSectionSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await SectionService.delete(request.params.id);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

 
}