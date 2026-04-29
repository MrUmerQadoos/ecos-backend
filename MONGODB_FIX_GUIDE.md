# MongoDB Connection Fix Guide

## Problem
MongoDB connection failing with error:
```
Error connecting to MongoDB: querySrv ECONNREFUSED _mongodb._tcp.cluster0.ssmia8i.mongodb.net
```

## Root Cause
1. **IP not whitelisted** - Your current IP address is not allowed to access MongoDB Atlas
2. **SRV DNS blocked** - Your ISP/network may be blocking SRV DNS records
3. **Cluster paused** - MongoDB Atlas cluster might be paused/suspended

## Step-by-Step Solution

### Step 1: Check MongoDB Atlas Cluster Status
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Login with your credentials
3. Select your project → Click on your cluster (`cluster0.ssmia8i.mongodb.net`)
4. Ensure cluster is **not paused** (green status)

### Step 2: Whitelist Your IP Address
1. In Atlas dashboard, go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Choose **"Add Current IP Address"** (recommended)
4. OR for testing, use **"Allow Access from Anywhere"** (`0.0.0.0/0`)
5. Click **"Confirm"**
6. Wait 1-2 minutes for changes to propagate

### Step 3: Get Correct Connection String
1. In Atlas, click **"Connect"** on your cluster
2. Choose **"Drivers"** (not Compass or Shell)
3. Select **Node.js** driver and version **4.1 or later**
4. Copy the connection string
5. It should look like:
   ```
   mongodb+srv://umerqadoos74:<password>@cluster0.ssmia8i.mongodb.net/Backend
   ```
6. Replace `<password>` with your actual password

### Step 4: Update .env File
Edit your `.env` file and ensure MONGO_URI is correct:
```env
MONGO_URI=mongodb+srv://umerqadoos74:umerqadoos74@cluster0.ssmia8i.mongodb.net/umer
```

### Step 5: If SRV Still Fails (Alternative Connection)
If `querySrv ECONNREFUSED` persists, use the non-SRV connection string:

1. In Atlas Connect → Drivers, look for **"Connection String Only"**
2. Choose **"I'm using a driver that does not support SRV"**
3. Copy the longer connection string (looks like):
   ```
   mongodb://umerqadoos74:your_password@cluster0-shard-00-00.ssmia8i.mongodb.net:27017,cluster0-shard-00-01.ssmia8i.mongodb.net:27017,cluster0-shard-00-02.ssmia8i.mongodb.net:27017/Backend?ssl=true&replicaSet=atlas-abcdef-shard-0&authSource=admin&retryWrites=true&w=majority
   ```
4. Update `.env` with this string

### Step 6: Test Connection
After making changes, test the connection:
```bash
node test-connection.js
```

Or restart your server:
```bash
pnpm run dev
```

## Temporary Workaround (For Development)
If you need to work immediately, you can use a local MongoDB:

1. Install MongoDB Community Edition
2. Update `.env` to:
   ```env
   MONGO_URI=mongodb://localhost:27017/ecos-backend
   ```
3. Restart server

## Updated Connection Code
The connection code has been improved with:
- Retry mechanism (3 attempts)
- Better error messages
- Troubleshooting tips
- IP whitelist detection

## Need More Help?
- Check MongoDB Atlas [documentation](https://www.mongodb.com/docs/atlas/)
- Verify your account has sufficient credits
- Ensure cluster is in a supported region
- Contact your network admin about SRV DNS blocking

## Quick Test Commands
```bash
# Test DNS resolution
nslookup cluster0.ssmia8i.mongodb.net

# Test connectivity to MongoDB
telnet cluster0.ssmia8i.mongodb.net 27017

# Check if .env is loaded
node -e "console.log(process.env.MONGO_URI ? 'Loaded' : 'Not loaded')"