
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { websiteRoutes } from './websiteRoutes';
import { authRoutes } from './authRoutes';


const registerRoutes = (fastify: FastifyInstance) => {
   fastify.register(websiteRoutes, { prefix: '/webSite' });
   fastify.register(authRoutes, { prefix: '/auth' });

};

export default registerRoutes;