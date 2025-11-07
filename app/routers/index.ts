
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { websiteRoutes } from './websiteRoutes';
import { authRoutes } from './authRoutes';
import { userRoutes } from './userRoutes';
import { templateRoutes } from './templateRoutes';
import { pageRoutes } from './pageRoutes';
import { imageRoutes } from './imageRoutes';
import { componentRoutes } from './componentRoutes';
import { sectionRoutes } from './sectionRoutes';



const registerRoutes = (fastify: FastifyInstance) => {
   fastify.register(websiteRoutes, { prefix: '/webSite' });
   fastify.register(authRoutes, { prefix: '/auth' });
   fastify.register(userRoutes, { prefix: '/users' });
   fastify.register(templateRoutes, { prefix: '/templates' });
   fastify.register(imageRoutes, { prefix: '/images' });
   fastify.register(pageRoutes, { prefix: '/pages' });
   fastify.register(componentRoutes, { prefix: '/components' });
   fastify.register(sectionRoutes, { prefix: '/sections' });

};

export default registerRoutes;