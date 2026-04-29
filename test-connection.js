import dotenv from 'dotenv';
dotenv.config();

import { connectToDatabase } from './database/connectionToDatabase.js';

async function test() {
  console.log('Testing MongoDB connection with updated code...');
  const connection = await connectToDatabase();
  
  if (connection) {
    console.log('✅ Connection test passed!');
    // Disconnect
    await connection.disconnect();
    console.log('Disconnected.');
  } else {
    console.log('❌ Connection test failed.');
    console.log('\n=== NEXT STEPS ===');
    console.log('1. Check your MongoDB Atlas cluster status:');
    console.log('   - Log in to https://cloud.mongodb.com');
    console.log('   - Go to your cluster (cluster0.ssmia8i.mongodb.net)');
    console.log('   - Ensure cluster is not paused');
    console.log('');
    console.log('2. Whitelist your IP address:');
    console.log('   - In Atlas, go to "Network Access"');
    console.log('   - Click "Add IP Address"');
    console.log('   - Use "Add Current IP Address" or "Allow Access from Anywhere" (0.0.0.0/0)');
    console.log('   - Wait 1-2 minutes for changes to apply');
    console.log('');
    console.log('3. Check connection string:');
    console.log('   - Verify username/password in .env file');
    console.log('   - MONGO_URI should be: mongodb+srv://umerqadoos74:umerqadoos74@cluster0.ssmia8i.mongodb.net/Backend');
    console.log('');
    console.log('4. Try alternative connection (if SRV blocked):');
    console.log('   Update MONGO_URI in .env to:');
    console.log('   mongodb://umerqadoos74:umerqadoos74@cluster0-shard-00-00.ssmia8i.mongodb.net:27017,cluster0-shard-00-01.ssmia8i.mongodb.net:27017,cluster0-shard-00-02.ssmia8i.mongodb.net:27017/Backend?ssl=true&replicaSet=atlas-abcdef-shard-0&authSource=admin&retryWrites=true&w=majority');
    console.log('   (Get exact connection string from Atlas → Connect → Drivers)');
  }
}

test();