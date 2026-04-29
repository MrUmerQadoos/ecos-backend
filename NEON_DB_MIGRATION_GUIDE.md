# Neon DB Migration Guide

Bhai, maine tumhare project ko MongoDB se Neon DB (PostgreSQL) mein migrate karne ke liye basic setup complete kar diya hai. Ab tumhe manually kuch steps follow karne honge.

## ✅ What's Already Done:

1. **Dependencies Installed**: `sequelize`, `pg`, `pg-hstore`
2. **New Connection File**: `database/postgresConnection.js`
3. **Sample Models**: `models-sequelize/User.js` and `models-sequelize/Process.js`
4. **.env Updated**: `NEON_DB_URI` added
5. **Index.js Updated**: Now uses PostgreSQL connection

## 📋 Next Steps (Manual Migration):

### Step 1: Create Remaining Sequelize Models
Tumhare project mein ~30+ models hain. Har ek model ko Sequelize format mein convert karna hoga.

**Example Conversion Pattern:**

**Mongoose Model (model/user.js):**
```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "manager", "surveyor", "viewer"], default: "viewer" },
  isVerified: { type: Boolean, default: false }
});

export const User = mongoose.model("User", userSchema);
```

**Sequelize Model (models-sequelize/User.js):**
```javascript
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/postgresConnection.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'manager', 'surveyor', 'viewer'), defaultValue: 'viewer' },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'users',
  timestamps: true
});

export default User;
```

### Step 2: Update All Controllers
Har controller mein import statements aur database queries update karo.

**Before (Mongoose):**
```javascript
import { User } from "../model/user.js";

// Find user
const user = await User.findOne({ email });
// Create user
await User.create({ name, email, password });
// Update user  
await User.findByIdAndUpdate(id, { isVerified: true });
```

**After (Sequelize):**
```javascript
import User from "../models-sequelize/User.js";

// Find user
const user = await User.findOne({ where: { email } });
// Create user
await User.create({ name, email, password });
// Update user
await User.update({ isVerified: true }, { where: { id } });
```

### Step 3: Update All Routes
Routes generally same rahenge, bas controller functions call karenge.

### Step 4: Data Migration Script
Existing MongoDB data ko Neon DB mein migrate karne ke liye ek script banaye:

```javascript
// migrate-data.js
import mongoose from 'mongoose';
import { sequelize } from './database/postgresConnection.js';
import User from './models-sequelize/User.js';
import { User as MongoUser } from './model/user.js';

async function migrateUsers() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI);
  
  // Connect to PostgreSQL
  await sequelize.authenticate();
  
  // Get all users from MongoDB
  const mongoUsers = await MongoUser.find({});
  
  // Insert into PostgreSQL
  for (const user of mongoUsers) {
    await User.create({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  }
  
  console.log(`Migrated ${mongoUsers.length} users`);
}

migrateUsers().catch(console.error);
```

### Step 5: Test the Migration
1. **Local Test**: `npm run dev` ya `node index.js`
2. **Check Logs**: PostgreSQL connection successful dikhna chahiye
3. **API Test**: Postman se signup/login APIs test karo
4. **Data Verification**: Database mein data correctly save ho raha hai ya nahi check karo

## 🔧 Important Changes to Note:

### 1. ID Format
- **MongoDB**: `ObjectId("507f1f77bcf86cd799439011")`
- **PostgreSQL**: `UUID` (e.g., `123e4567-e89b-12d3-a456-426614174000`)

### 2. Query Differences
| Operation | Mongoose | Sequelize |
|-----------|----------|-----------|
| Find by ID | `findById(id)` | `findByPk(id)` |
| Find one | `findOne({email})` | `findOne({where: {email}})` |
| Find all | `find({role: 'admin'})` | `findAll({where: {role: 'admin'}})` |
| Update | `findByIdAndUpdate(id, data)` | `update(data, {where: {id}})` |
| Delete | `findByIdAndDelete(id)` | `destroy({where: {id}})` |

### 3. Relationships
**Mongoose:**
```javascript
processId: { type: mongoose.Schema.Types.ObjectId, ref: "Process" }
```

**Sequelize:**
```javascript
processId: {
  type: DataTypes.UUID,
  references: { model: 'processes', key: 'id' }
}
```

## 🚀 Deployment Steps:

1. **Vercel/Production**: `.env` mein `NEON_DB_URI` set karo
2. **Database Sync**: Production mein `sequelize.sync()` avoid karo, use migrations instead
3. **Backup**: Pehle MongoDB ka complete backup le lo

## ⚠️ Common Issues & Solutions:

1. **Connection Error**: Neon DB mein IP whitelist check karo
2. **SSL Error**: `sslmode=require` use karo
3. **UUID Issue**: `DataTypes.UUIDV4` use karo
4. **Array Fields**: PostgreSQL arrays ke liye `DataTypes.ARRAY(DataTypes.STRING)`

## 📞 Need Help?

Agar koi specific controller ya model migrate karne mein issue aa raha hai to mujhe batao, main uske liye exact code provide kar dunga.

## ✅ Migration Checklist:

- [ ] All models converted to Sequelize
- [ ] All controllers updated
- [ ] Routes verified
- [ ] Data migration script created
- [ ] Local testing completed
- [ ] Production deployment tested
- [ ] MongoDB backup created

**Note**: Ye migration gradual bhi kar sakte ho - pehle new users PostgreSQL mein create karo, purane data baad mein migrate karo.