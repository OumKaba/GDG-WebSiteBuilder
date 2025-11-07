import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  userId: string;
  email: string;
  provider: string;
}

export const JwtUtils = {
  generateToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN as unknown as number
    };
    return jwt.sign(payload, JWT_SECRET, options);
  },

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }
  },

  decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      return null;
    }
  },
};