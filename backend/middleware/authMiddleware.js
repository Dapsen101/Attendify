// This middleware handles authentication and authorization for protected routes.
// The 'protect' function verifies JWT tokens and optionally checks user roles.
// It extracts the token from the Authorization header, verifies it, and attaches
// the decoded user info to req.user. If roles are specified, it ensures the user
// has the required role before allowing access.
const jwt = require('jsonwebtoken');

exports.protect = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];

  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Not authorized, token missing' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length > 0) {
        const userRole = req.user.role ? req.user.role.toLowerCase() : '';
        const allowedRoles = roles.map(r => r.toLowerCase());
        
        if (!allowedRoles.includes(userRole)) {
          return res.status(403).json({ message: 'Forbidden: insufficient rights' });
        }
      }

      next();
    } catch (error) {
      console.error("Auth Error:", error.message);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};