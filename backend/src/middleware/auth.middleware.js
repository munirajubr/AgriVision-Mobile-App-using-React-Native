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
    // 1. Get token from header
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No authentication token provided, access denied" });
    }
    const token = authHeader.replace("Bearer ", "");

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded.userId must match what was signed in payload

    // 3. Fetch user, exclude password
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Token is not valid or user no longer exists" });
    }

    // 4. Attach user object to req
    req.user = user;

    // 5. Next handler
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed or expired" });
  }
};

export { protect };
