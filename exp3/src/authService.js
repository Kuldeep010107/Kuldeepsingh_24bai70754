const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const users = new Map();
const refreshTokens = new Map();

const createHash = async (password) => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

const createAccessToken = (user) => {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
  );
};

const createRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    { sub: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
  );
  const expires = Date.now() + parseRefreshExpiry(process.env.REFRESH_TOKEN_EXPIRES_IN || '7d');
  refreshTokens.set(refreshToken, { userId: user.id, expires });
  return refreshToken;
};

const parseRefreshExpiry = (value) => {
  if (value.endsWith('d')) {
    return parseInt(value.slice(0, -1), 10) * 24 * 60 * 60 * 1000;
  }
  if (value.endsWith('h')) {
    return parseInt(value.slice(0, -1), 10) * 60 * 60 * 1000;
  }
  if (value.endsWith('m')) {
    return parseInt(value.slice(0, -1), 10) * 60 * 1000;
  }
  return 7 * 24 * 60 * 60 * 1000;
};

const registerUser = async (email, password, role = 'user') => {
  if (users.has(email)) {
    throw new Error('User already exists');
  }

  const hashedPassword = await createHash(password);
  const user = { id: crypto.randomUUID(), email, passwordHash: hashedPassword, role };
  users.set(email, user);
  return { id: user.id, email: user.email, role: user.role };
};

const authenticateUser = async (email, password) => {
  const user = users.get(email);
  if (!user) return null;
  const valid = await verifyPassword(password, user.passwordHash);
  return valid ? user : null;
};

const revokeRefreshToken = (token) => {
  refreshTokens.delete(token);
};

const verifyRefreshToken = (token) => {
  const saved = refreshTokens.get(token);
  if (!saved || saved.expires < Date.now()) {
    refreshTokens.delete(token);
    return null;
  }

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    if (payload.sub !== saved.userId) return null;
    return saved.userId;
  } catch (err) {
    refreshTokens.delete(token);
    return null;
  }
};

const getUserById = (id) => {
  for (const user of users.values()) {
    if (user.id === id) return { id: user.id, email: user.email, role: user.role };
  }
  return null;
};

const getAllUsers = () => {
  return Array.from(users.values()).map((user) => ({ id: user.id, email: user.email, role: user.role }));
};

module.exports = {
  registerUser,
  authenticateUser,
  createAccessToken,
  createRefreshToken,
  revokeRefreshToken,
  verifyRefreshToken,
  getUserById,
  getAllUsers,
};
