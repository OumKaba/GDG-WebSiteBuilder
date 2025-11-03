
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { websiteRoutes } from './websiteRoutes';
const registerRoutes = (fastify: FastifyInstance) => {
  // Register example routes with a prefix
  
  // Register user routes with a prefix
   fastify.register(websiteRoutes, { prefix: '/webSite' });



};

export default registerRoutes;