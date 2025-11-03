import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient().$extends(withAccelerate());

// Check database connection
export async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('Database connection established');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
}

// Graceful shutdown function
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

export default prisma;