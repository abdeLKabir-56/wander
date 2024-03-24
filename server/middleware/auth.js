const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET_KEY;

const isAuth = (requiredRole = null) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.redirect('/'+requiredRole);
        //res.status(401).json({ message: 'Unauthorized: Missing Token' });
      }

      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
     //console.log(requiredRole+'=='+decoded.userRole);
      if ((requiredRole && decoded.userRole !== requiredRole)) {
        return res.status(403).json({ message: 'Forbidden: Required role not found' });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: 'Unauthorized: Invalid Token' });
    }
  };
};



module.exports = isAuth;
