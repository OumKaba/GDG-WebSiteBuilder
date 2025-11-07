import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PageService } from '../services/pageService';
import {
  createPageSchema,
  getPageByIdSchema,
  getPageBySlugSchema,
  getPagesByWebsiteIdSchema,
  getHomePageSchema,
  updatePageSchema,
  reorderPageSchema,
  deletePageSchema,
} from '../schemas/pageSchema';

export async function pageRoutes(fastify: FastifyInstance) {
  
  // CREATE
  fastify.post('/', {
    schema: createPageSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await PageService.create(request.body as any);
      if (!result.success) return reply.code(400).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET BY ID
  fastify.get('/:id', {
    schema: getPageByIdSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await PageService.getById(request.params.id);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET BY SLUG
  fastify.get('/website/:websiteId/slug/:slug', {
    schema: getPageBySlugSchema,
  }, async (request: FastifyRequest<{ 
    Params: { websiteId: string; slug: string } 
  }>, reply: FastifyReply) => {
    try {
      const { websiteId, slug } = request.params;
      const result = await PageService.getBySlug(websiteId, slug);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET BY WEBSITE ID
  fastify.get('/website/:websiteId', {
    schema: getPagesByWebsiteIdSchema,
  }, async (request: FastifyRequest<{ Params: { websiteId: string } }>, reply: FastifyReply) => {
    try {
      const result = await PageService.getByWebsiteId(request.params.websiteId);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET HOME PAGE
  fastify.get('/website/:websiteId/home', {
    schema: getHomePageSchema,
  }, async (request: FastifyRequest<{ Params: { websiteId: string } }>, reply: FastifyReply) => {
    try {
      const result = await PageService.getHomePage(request.params.websiteId);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // UPDATE
  fastify.put('/:id', {
    schema: updatePageSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await PageService.update(request.params.id, request.body as any);
      if (!result.success) {
        const statusCode = result.error?.includes('slug existe déjà') ? 400 : 404;
        return reply.code(statusCode).send(result);
      }
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // REORDER
  fastify.patch('/reorder', {
    schema: reorderPageSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await PageService.reorder(request.body as any);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // DELETE
  fastify.delete('/:id', {
    schema: deletePageSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await PageService.delete(request.params.id);
      if (!result.success) {
        const statusCode = result.error?.includes('seule page') ? 400 : 404;
        return reply.code(statusCode).send(result);
      }
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

}