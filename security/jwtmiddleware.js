
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.substring(7,authHeader.length)
    if (token == null) {
      return res.sendStatus(401);
    }
    
    else jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user;
        next();
    })
}

module.exports = authenticateToken;