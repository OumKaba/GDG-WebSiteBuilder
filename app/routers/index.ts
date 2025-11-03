
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { websiteRoutes } from './websiteRoutes';
const registerRoutes = (fastify: FastifyInstance) => {
   fastify.register(websiteRoutes, { prefix: '/webSite' });

};

export default registerRoutes;