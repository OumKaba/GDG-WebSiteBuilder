import dotenv from 'dotenv';
import Fastify from 'fastify';
import registerMiddlewares from './middlewares';
import registerRoutes from './routers';
import { checkDatabaseConnection, disconnectPrisma } from './services/prismaService';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

dotenv.config();

const isProd = process.env.ENV === 'PROD';
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const domain = process.env.DOMAIN || `${host}:${port}`;

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

// ✅ AJOUTE LE LOGGER
const fastify = Fastify({ 
  logger: true 
});

async function startServer() {
  try {
    // Vérifier la connexion DB
    await checkDatabaseConnection();
    
    // Enregistrer middlewares
    await registerMiddlewares(fastify);
    
    // Enregistrer Swagger
    await fastify.register(fastifySwagger as any, {
      swagger: {
        info: {
          title: 'My API',
          description: 'API Documentation',
          version: '1.0.0'
        },
        host: domain,
        schemes: isProd ? ['https'] : ['http'],
        consumes: ['application/json'],
        produces: ['application/json']
      },
    });
    
    await fastify.register(fastifySwaggerUi, {
      routePrefix: '/docs'
    });
    
    // Enregistrer routes
    await registerRoutes(fastify);
    
    // Démarrer le serveur
    await fastify.listen({ port, host });
    console.log(`✅ Server running on http://${host}:${port}`);
    console.log(`📚 Docs available at http://${host}:${port}/docs`);
    
  } catch (err) {
    fastify.log.error(err);
    await disconnectPrisma();
    process.exit(1);
  }
}

const gracefulShutdown = async () => {
  console.log('🛑 Shutting down gracefully...');
  await fastify.close();
  await disconnectPrisma();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

startServer();