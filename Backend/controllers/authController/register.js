import User from "../../models/userModel.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
  try {
    console.log('📝 Registration attempt:', req.body);
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if user already exists
    console.log('🔍 Checking if user exists:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(409).json({ message: "User with this email already exists" });
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    console.log('👤 Creating new user...');
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user" // Default to "user" role
    });

    await newUser.save();
    console.log('✅ User registered successfully:', newUser.email);

    // Send response without password
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    
    // Check for specific MongoDB errors
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(409).json({ message: "User with this email already exists" });
    }
    
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ 
      message: "Server error during registration",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default register;
