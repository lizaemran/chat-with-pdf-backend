const config = require("../config/environment");
const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, config.jwt.jwtSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ error:"Invalid token",message: err.message });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({error:"No authorization token provided",message:"please provide auth jwt token"});
  }
}

module.exports = { isAuthenticated };
