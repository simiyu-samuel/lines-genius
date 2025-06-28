import { PrismaClient } from '@prisma/client';

// Global variable to store the Prisma client instance
let prisma: PrismaClient;

// Declare global variable for development hot reloading
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create Prisma client with optimized settings
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
    errorFormat: 'pretty',
  });
};

// Use a single Prisma instance for all environments
if (!global.__prisma) {
  global.__prisma = createPrismaClient();
}
prisma = global.__prisma;

export const connectDatabase = async () => {
  try {
    console.log('🔌 Attempting to connect to database...');
    console.log('Database URL exists:', !!process.env.DATABASE_URL);
    console.log('Environment:', process.env.NODE_ENV);
    
    // Test the connection with a simple query
    await prisma.$executeRaw`SELECT 1 as test`;
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    throw error;
  }
};

// Test database connection function
export const testDatabaseConnection = async () => {
  try {
    console.log('🧪 Testing database connection...');
    
    // Test basic connection
    await prisma.$executeRaw`SELECT 1 as test`;
    console.log('✅ Basic connection test passed');
    
    // Test if users table exists
    const userCount = await prisma.user.count();
    console.log(`✅ Users table accessible, count: ${userCount}`);
    
    // Test if other tables exist
    const tablesExist = await Promise.allSettled([
      prisma.savedLine.count(),
      prisma.usageStats.count(),
      prisma.generationLog.count()
    ]);
    
    console.log('✅ Table accessibility test:', {
      savedLines: tablesExist[0].status === 'fulfilled',
      usageStats: tablesExist[1].status === 'fulfilled',
      generationLogs: tablesExist[2].status === 'fulfilled'
    });
    
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

export default prisma;