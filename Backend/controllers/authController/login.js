import User from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    console.log('🔑 Login attempt received');
    const { email, password } = req.body;
    console.log('📧 Email:', email);
    console.log('🔒 Password length:', password?.length);

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    console.log('🔍 Searching for user with email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found with email:', email);
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.log('✅ User found:', user.email, 'Role:', user.role);

    // Compare password
    console.log('🔐 Comparing passwords...');
    console.log('   Provided password:', password);
    console.log('   Stored hash:', user.password);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔑 Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Password mismatch for user:', email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    console.log('🎫 Generating JWT token...');
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "24h" }
    );
    console.log('✅ Token generated successfully');

    // Send response without password
    const response = {
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
    console.log('✅ Login successful for:', email, 'Role:', user.role);
    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export default login;
