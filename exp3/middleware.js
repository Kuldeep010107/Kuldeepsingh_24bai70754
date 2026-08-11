const jwt = require('jsonwebtoken');

const authenticateAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Access token invalid or expired' });
  }
};

module.exports = {
  authenticateAccessToken,
};
