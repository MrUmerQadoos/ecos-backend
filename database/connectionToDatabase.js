import mongoose from "mongoose";

export const connectToDatabase = async () => {
  const maxRetries = 3;
  const retryDelay = 5000; // 5 seconds
  
  // Get MongoDB URI from environment
  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri) {
    console.error('❌ MONGO_URI is not defined in environment variables.');
    console.error('   Please check your .env file and ensure MONGO_URI is set.');
    return null;
  }
  
  console.log(`Using MongoDB URI: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`);
  
  // Try alternative connection string if SRV fails
  let connectionString = mongoUri;
  
  // If SRV connection fails, try direct connection
  if (mongoUri.includes('mongodb+srv://')) {
    console.log('⚠️  Using SRV connection string. If connection fails, try direct connection.');
  }
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Connecting to MongoDB (Attempt ${attempt}/${maxRetries})...`);
      
      const connection = await mongoose.connect(connectionString, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      
      console.log(`✅ MongoDB connected successfully: ${connection.connection.host}`);
      console.log(`Database: ${connection.connection.name}`);
      return connection;
    } catch (error) {
      console.error(`❌ MongoDB connection failed (Attempt ${attempt}/${maxRetries}): ${error.message}`);
      
      // Provide helpful troubleshooting tips
      if (error.code === 'ECONNREFUSED' || error.message.includes('querySrv')) {
        console.log('   🔍 Troubleshooting tips:');
        console.log('   1. Check your internet connection');
        console.log('   2. Verify MongoDB Atlas cluster is running');
        console.log('   3. Ensure your IP is whitelisted in Atlas Network Access');
        console.log('   4. Check if SRV records are blocked by your ISP/firewall');
        
        // Try direct connection on SRV failure
        if (connectionString.includes('mongodb+srv://')) {
          console.log('   🔄 Trying direct connection string...');
          // Convert SRV to direct connection
          connectionString = mongoUri.replace('mongodb+srv://', 'mongodb://') + '?retryWrites=true&w=majority';
          console.log(`   Using: ${connectionString.replace(/\/\/.*@/, '//***:***@')}`);
          continue; // Retry with new connection string
        }
      }
      
      if (error.message.includes('whitelist')) {
        console.log('   🔍 IP Whitelist Issue Detected:');
        console.log('   - Go to MongoDB Atlas → Network Access');
        console.log('   - Add your current IP address (or 0.0.0.0/0 for all IPs)');
        console.log('   - Wait a few minutes for changes to propagate');
      }
      
      // If last attempt, throw error
      if (attempt === maxRetries) {
        console.error('\n💥 Failed to connect to MongoDB after all retries.');
        console.error('The application will continue running but database operations will fail.');
        console.error('Please fix the MongoDB connection and restart the server.');
        return null;
      }
      
      // Wait before retrying
      console.log(`   Retrying in ${retryDelay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};
