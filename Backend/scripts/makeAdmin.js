import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/userModel.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from Backend directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const makeAdmin = async (email) => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    const dbUrl = process.env.DATABASE_URL || process.env.MONGO_URI;
    if (!dbUrl) {
      console.log('❌ Database URL not found in environment variables!');
      process.exit(1);
    }
    await mongoose.connect(dbUrl);
    console.log('✅ Connected to MongoDB');

    console.log(`🔍 Finding user with email: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    console.log(`👤 Found user: ${user.name} (${user.email})`);
    console.log(`📋 Current role: ${user.role}`);

    if (user.role === 'admin') {
      console.log('✅ User is already an admin!');
    } else {
      user.role = 'admin';
      await user.save();
      console.log('✅ User role updated to admin!');
    }

    console.log('\n📊 Updated user details:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log('❌ Please provide an email address');
  console.log('Usage: node makeAdmin.js <email>');
  console.log('Example: node makeAdmin.js admin2@gmail.com');
  process.exit(1);
}

makeAdmin(email);
