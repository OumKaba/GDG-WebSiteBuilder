import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtUtils } from '../utils/jwt';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      email: string;
      provider: string;
    };
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({
        success: false,
        error: 'Token d\'authentification manquant',
      });
    }

    const token = authHeader.substring(7);
    const decoded = JwtUtils.verifyToken(token);

    request.user = decoded;
  } catch (error: any) {
    return reply.code(401).send({
      success: false,
      error: 'Token invalide ou expiré',
    });
  }
}