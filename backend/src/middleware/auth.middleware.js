import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Assuming the User model is here

/**
 * @desc Protects routes, ensuring only authenticated users can access them.
 * It verifies the JWT token and attaches the user object to the request (req.user).
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const protect = async (req, res, next) => {
  try {
    // 1. Get token from the 'Authorization' header
    // Expected format: "Bearer <token>"
    const authHeader = req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No authentication token provided, access denied" });
    }

    const token = authHeader.replace("Bearer ", "");

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user and exclude the password field
    // decoded.userId must match the property name used when the token was signed
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(401).json({ message: "Token is not valid or user no longer exists" });
    }

    // 4. Attach user object to the request
    req.user = user;
    
    // 5. Continue to the next middleware/route handler
    next();
  } catch (error) {
    // Handle specific JWT errors (e.g., token expired, malformed)
    console.error("Authentication error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed or expired" });
  }
};

export { protect }; // Export the function as 'protect' for cleaner imports
