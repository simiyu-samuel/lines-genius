import { PrismaClient } from '@prisma/client';

// Global variable to store the Prisma client instance
let prisma: PrismaClient;

// Declare global variable for development hot reloading
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create Prisma client with optimized settings for serverless
const createPrismaClient = () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL is not defined in environment variables');
    throw new Error('DATABASE_URL is required');
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error', 'warn'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    // Serverless-specific configuration
    errorFormat: 'pretty',
  });
};

if (process.env.NODE_ENV === 'production') {
  // In production (serverless), create a new instance for each request
  prisma = createPrismaClient();
} else {
  // In development, use a global variable to preserve the instance across hot reloads
  if (!global.__prisma) {
    global.__prisma = createPrismaClient();
  }
  prisma = global.__prisma;
}

export const connectDatabase = async () => {
  try {
    console.log('🔌 Attempting to connect to database...');
    console.log('Database URL exists:', !!process.env.DATABASE_URL);
    console.log('Environment:', process.env.NODE_ENV);
    
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // In serverless, don't throw - just return false
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️ Continuing without database connection in production');
      return false;
    }
    throw error;
  }
};

export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
  }
};

// Graceful shutdown handler
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});

export default prisma;