
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { websiteRoutes } from './websiteRoutes';
import { authRoutes } from './authRoutes';
import { userRoutes } from './userRoutes';
import { templateRoutes } from './templateRoutes';



const registerRoutes = (fastify: FastifyInstance) => {
   fastify.register(websiteRoutes, { prefix: '/webSite' });
   fastify.register(authRoutes, { prefix: '/auth' });
   fastify.register(userRoutes, { prefix: '/users' });
   fastify.register(templateRoutes, { prefix: '/templates' });


};

export default registerRoutes;