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

  console.log('🔌 Creating Prisma client with URL:', databaseUrl.replace(/:[^:@]*@/, ':****@'));

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error', 'warn'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    // Serverless-specific configuration to prevent prepared statement conflicts
    errorFormat: 'pretty',
  });
};

// In serverless environments, always create a new instance to avoid prepared statement conflicts
if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
  // For serverless (Vercel), create a new instance each time to avoid prepared statement conflicts
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
    console.log('Serverless mode:', !!process.env.VERCEL);
    
    // For serverless, create a fresh client to avoid prepared statement conflicts
    if (process.env.VERCEL) {
      console.log('🔄 Creating fresh Prisma client for serverless environment...');
      // Don't reuse the global prisma instance in serverless
      const freshClient = createPrismaClient();
      
      // Test the connection with a simple query that doesn't use prepared statements
      await freshClient.$executeRaw`SELECT 1 as test`;
      console.log('✅ Database connected successfully (serverless mode)');
      
      // Disconnect the test client
      await freshClient.$disconnect();
      return true;
    } else {
      // For local development, use the global instance
      await prisma.$executeRaw`SELECT 1 as test`;
      console.log('✅ Database connected successfully (development mode)');
      return true;
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // In serverless, don't throw - just return false
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      console.log('⚠️ Continuing without database connection in serverless mode');
      return false;
    }
    throw error;
  }
};

// Test database connection function
export const testDatabaseConnection = async () => {
  try {
    console.log('🧪 Testing database connection...');
    
    // Create a fresh client for testing to avoid prepared statement conflicts
    const testClient = process.env.VERCEL ? createPrismaClient() : prisma;
    
    // Test basic connection with raw SQL to avoid prepared statements
    await testClient.$executeRaw`SELECT 1 as test`;
    console.log('✅ Basic connection test passed');
    
    // Test if users table exists
    const userCount = await testClient.user.count();
    console.log(`✅ Users table accessible, count: ${userCount}`);
    
    // Test if other tables exist
    const tablesExist = await Promise.allSettled([
      testClient.savedLine.count(),
      testClient.usageStats.count(),
      testClient.generationLog.count()
    ]);
    
    console.log('✅ Table accessibility test:', {
      savedLines: tablesExist[0].status === 'fulfilled',
      usageStats: tablesExist[1].status === 'fulfilled',
      generationLogs: tablesExist[2].status === 'fulfilled'
    });
    
    // Disconnect test client if it's different from the global one
    if (process.env.VERCEL) {
      await testClient.$disconnect();
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
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

// Export a function that creates a fresh client for serverless environments
export const getFreshPrismaClient = () => {
  if (process.env.VERCEL) {
    return createPrismaClient();
  }
  return prisma;
};

export default prisma;