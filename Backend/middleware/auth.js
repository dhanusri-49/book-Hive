import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('🔑 Auth header:', authHeader ? 'Present' : 'Missing');
    
    const token = authHeader?.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    req.user = decoded; // Add user info to request
    console.log('✅ Token verified. User:', decoded.email, 'Role:', decoded.role);
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  console.log('👑 Checking admin privileges. User role:', req.user?.role);
  if (req.user.role !== "admin") {
    console.log('❌ Access denied. User is not an admin');
    return res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
  console.log('✅ Admin access granted');
  next();
};

// Optional middleware to check admin for specific routes
export const requireAdmin = [verifyToken, isAdmin];
