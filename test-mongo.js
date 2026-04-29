import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://umerqadoos74:umerqadoos74@cluster0.ssmia8i.mongodb.net/Backend';

console.log('Testing MongoDB connection...');
console.log('Connection string:', MONGO_URI.replace(/\/\/.*@/, '//***:***@'));

async function testConnection() {
  try {
    // Set connection options
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    console.log('Attempting to connect...');
    const connection = await mongoose.connect(MONGO_URI, options);
    console.log(`✅ MongoDB connected successfully! Host: ${connection.connection.host}`);
    
    // List databases
    const adminDb = connection.connection.db.admin();
    const databases = await adminDb.listDatabases();
    console.log('Available databases:', databases.databases.map(db => db.name));
    
    await mongoose.disconnect();
    console.log('Disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testConnection();