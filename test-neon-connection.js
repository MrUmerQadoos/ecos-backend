import { connectToPostgres, sequelize } from './database/postgresConnection.js';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('🔌 Testing Neon DB Connection...');
  console.log('Connection String:', process.env.NEON_DB_URI?.replace(/\/\/.*@/, '//***:***@'));
  
  try {
    // Test connection
    const db = await connectToPostgres();
    
    if (db) {
      console.log('✅ Connection successful!');
      
      // Test a simple query
      const [results] = await sequelize.query('SELECT version()');
      console.log('📊 PostgreSQL Version:', results[0]?.version);
      
      // List tables
      const [tables] = await sequelize.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      
      console.log('📋 Available tables:', tables.map(t => t.table_name).join(', ') || 'No tables yet');
      
      console.log('\n🎉 Neon DB connection test PASSED!');
      process.exit(0);
    } else {
      console.error('❌ Connection failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Error during connection test:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testConnection();