import { PrismaClient } from '@prisma/client';

// Global variable to store the Prisma client instance
let prisma: PrismaClient;

// Declare global variable for development hot reloading and serverless environments
declare global {
  var __prisma: PrismaClient | undefined;
}

// Function to create and configure the Prisma Client
const createPrismaClient = () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL is not defined in environment variables');
    throw new Error('DATABASE_URL is required');
  }

  console.log('🔌 Creating new Prisma client instance...');

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

// This singleton pattern prevents creating a new PrismaClient on every
// function invocation in a serverless environment (warm start)
if (!global.__prisma) {
  global.__prisma = createPrismaClient();
}
prisma = global.__prisma;

/**
 * Connects to the database using the global Prisma client.
 * This function is idempotent: it will do nothing if already connected.
 */
export const connectDatabase = async () => {
  try {
    console.log('🔌 Attempting to connect to database...');
    // ✅ FIX: Use prisma.$connect() to establish or verify the connection.
    // This method is designed for this purpose and avoids creating conflicting
    // prepared statements on subsequent calls in a warm serverless environment.
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    throw error;
  }
};

/**
 * Runs a series of tests to ensure the database is connected and accessible.
 */
export const testDatabaseConnection = async () => {
  try {
    console.log('🧪 Testing database connection...');
    
    // ✅ FIX: Test basic connection using the correct method first.
    await prisma.$connect();
    console.log('✅ Basic connection test passed');
    
    // Test if a specific table exists by counting its rows.
    // This is a more robust test than just connecting.
    const userCount = await prisma.user.count();
    console.log(`✅ 'users' table is accessible, count: ${userCount}`);
    
    // Optionally test other critical tables
    const tablesExist = await Promise.allSettled([
      prisma.savedLine.count(),
      prisma.usageStats.count(),
      prisma.generationLog.count()
    ]);
    
    console.log('✅ Other table accessibility test:', {
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

/**
 * Disconnects the Prisma client from the database.
 */
export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
  }
};

// Graceful shutdown handler to ensure the database connection is closed properly.
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});

// Export the singleton instance for use throughout your application
export default prisma;
