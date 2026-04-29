import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Original SRV connection string
const SRV_URI = process.env.MONGO_URI || 'mongodb+srv://umerqadoos74:umerqadoos74@cluster0.ssmia8i.mongodb.net/Backend';

// Try direct connection without SRV
const DIRECT_URI = 'mongodb://umerqadoos74:umerqadoos74@cluster0.ssmia8i.mongodb.net:27017/Backend?retryWrites=true&w=majority';

console.log('Testing MongoDB connection...');
console.log('SRV connection string:', SRV_URI.replace(/\/\/.*@/, '//***:***@'));
console.log('Direct connection string:', DIRECT_URI.replace(/\/\/.*@/, '//***:***@'));

async function testConnection(uri, label) {
  console.log(`\n=== Testing ${label} ===`);
  try {
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };
    
    console.log('Attempting to connect...');
    const connection = await mongoose.connect(uri, options);
    console.log(`✅ ${label} connected successfully! Host: ${connection.connection.host}`);
    
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error(`❌ ${label} failed:`, error.message);
    console.error('Error code:', error.code);
    return false;
  }
}

async function main() {
  console.log('Testing both connection methods...');
  
  // Test SRV first
  const srvSuccess = await testConnection(SRV_URI, 'SRV connection');
  
  if (!srvSuccess) {
    console.log('\nSRV connection failed, trying direct connection...');
    const directSuccess = await testConnection(DIRECT_URI, 'Direct connection');
    
    if (directSuccess) {
      console.log('\n🎉 Direct connection works! You should update your connection string.');
      console.log('Update your .env file with:');
      console.log(`MONGO_URI=${DIRECT_URI}`);
    } else {
      console.log('\n😞 Both connection methods failed.');
      console.log('Possible issues:');
      console.log('1. MongoDB Atlas cluster is paused or suspended');
      console.log('2. Your IP is not whitelisted in Atlas Network Access');
      console.log('3. Password/username is incorrect');
      console.log('4. Network firewall blocking MongoDB ports (27017)');
    }
  } else {
    console.log('\n✅ SRV connection works! The issue might be intermittent.');
  }
}

main();