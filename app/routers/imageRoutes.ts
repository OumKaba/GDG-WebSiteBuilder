import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ImageService } from '../services/imageService';
import {
  createImageSchema,
  getImageByIdSchema,
  getImagesByUserIdSchema,
  getAllImagesSchema,
  searchImagesSchema,
  getImagesByMimeTypeSchema,
  getImageStatsSchema,
  updateImageSchema,
  deleteImageSchema,
  deleteManyImagesSchema,
} from '../schemas/imageSchema';

export async function imageRoutes(fastify: FastifyInstance) {
  
  // CREATE
  fastify.post('/', {
    schema: createImageSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await ImageService.create(request.body as any);
      if (!result.success) return reply.code(400).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET BY ID
  fastify.get('/:id', {
    schema: getImageByIdSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await ImageService.getById(request.params.id);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET BY USER ID
  fastify.get('/user/:userId', {
    schema: getImagesByUserIdSchema,
  }, async (request: FastifyRequest<{ 
    Params: { userId: string };
    Querystring: { limit?: number; offset?: number };
  }>, reply: FastifyReply) => {
    try {
      const { limit, offset } = request.query;
      const result = await ImageService.getByUserId(request.params.userId, limit, offset);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET ALL (admin)
  fastify.get('/', {
    schema: getAllImagesSchema,
  }, async (request: FastifyRequest<{ 
    Querystring: { limit?: number; offset?: number };
  }>, reply: FastifyReply) => {
    try {
      const { limit, offset } = request.query;
      const result = await ImageService.getAll(limit, offset);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // SEARCH
  fastify.get('/user/:userId/search', {
    schema: searchImagesSchema,
  }, async (request: FastifyRequest<{ 
    Params: { userId: string };
    Querystring: { search: string };
  }>, reply: FastifyReply) => {
    try {
      const result = await ImageService.search(request.params.userId, request.query.search);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET BY MIME TYPE
  fastify.get('/user/:userId/mime', {
    schema: getImagesByMimeTypeSchema,
  }, async (request: FastifyRequest<{ 
    Params: { userId: string };
    Querystring: { mimeType: string };
  }>, reply: FastifyReply) => {
    try {
      const result = await ImageService.getByMimeType(request.params.userId, request.query.mimeType);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // GET STATS
  fastify.get('/user/:userId/stats', {
    schema: getImageStatsSchema,
  }, async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
    try {
      const result = await ImageService.getStats(request.params.userId);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // UPDATE
  fastify.put('/:id', {
    schema: updateImageSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await ImageService.update(request.params.id, request.body as any);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // DELETE
  fastify.delete('/:id', {
    schema: deleteImageSchema,
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const result = await ImageService.delete(request.params.id);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // DELETE MANY
  fastify.post('/delete-many', {
    schema: deleteManyImagesSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { ids, userId } = request.body as any;
      const result = await ImageService.deleteMany(ids, userId);
      if (!result.success) return reply.code(404).send(result);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });
}