import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Get Neon DB connection string from environment
const neonDbUri = process.env.NEON_DB_URI || 'postgresql://neondb_owner:npg_YFP9KwN3vOlW@ep-orange-bar-am9y1rgh-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Parse the connection string
let sequelize;

try {
  sequelize = new Sequelize(neonDbUri, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
  
  console.log('✅ PostgreSQL/Neon DB connection configured');
} catch (error) {
  console.error('❌ Error configuring Sequelize:', error.message);
  process.exit(1);
}

// Test the connection
export const connectToPostgres = async () => {
  const maxRetries = 3;
  const retryDelay = 5000; // 5 seconds
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Connecting to Neon DB (Attempt ${attempt}/${maxRetries})...`);
      
      await sequelize.authenticate();
      console.log('✅ Connection to Neon DB has been established successfully.');
      
      // Sync models (optional - you might want to handle this differently)
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Syncing database models...');
        await sequelize.sync({ alter: true });
        console.log('✅ Database models synced successfully.');
      }
      
      return sequelize;
    } catch (error) {
      console.error(`❌ Unable to connect to Neon DB (Attempt ${attempt}/${maxRetries}):`, error.message);
      
      if (attempt === maxRetries) {
        console.error('\n💥 Failed to connect to Neon DB after all retries.');
        console.error('The application will continue running but database operations will fail.');
        console.error('Please check your Neon DB connection string and network settings.');
        return null;
      }
      
      console.log(`   Retrying in ${retryDelay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};

export { sequelize };
export default sequelize;