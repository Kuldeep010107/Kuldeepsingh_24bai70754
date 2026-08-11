require('dotenv').config();
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const {
  registerUser,
  authenticateUser,
  createAccessToken,
  createRefreshToken,
  revokeRefreshToken,
  verifyRefreshToken,
  getUserById,
  getAllUsers,
} = require('./authService');
const { authenticateAccessToken } = require('./middleware');

const seedUsers = [
  { email: 'admin@example.com', password: 'Admin@123', role: 'admin' },
  { email: 'editor@example.com', password: 'Editor@123', role: 'editor' },
  { email: 'viewer@example.com', password: 'Viewer@123', role: 'viewer' },
];

const posts = [
  {
    id: '1',
    title: 'Admin Dashboard Ready',
    body: 'This post is visible to authenticated users, and admin can also manage users and posts.',
    author: 'admin@example.com',
  },
  {
    id: '2',
    title: 'JWT Session Management',
    body: 'Admin users see this protected content along with the current user list and system data.',
    author: 'admin@example.com',
  },
];

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.post('/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await registerUser(email.toLowerCase(), password);
    return res.status(201).json({ user, message: 'User registered successfully' });
  } catch (err) {
    if (err.message.includes('already exists')) {
      return res.status(409).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await authenticateUser(email.toLowerCase(), password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    return res.json({ accessToken, refreshToken, tokenType: 'Bearer' });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/auth/token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  const userId = verifyRefreshToken(refreshToken);
  if (!userId) {
    return res.status(403).json({ error: 'Refresh token invalid or expired' });
  }

  const user = getUserById(userId);
  if (!user) {
    return res.status(403).json({ error: 'User not found' });
  }

  const accessToken = createAccessToken(user);
  return res.json({ accessToken, tokenType: 'Bearer' });
});

app.post('/auth/logout', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  revokeRefreshToken(refreshToken);
  return res.json({ message: 'Logged out successfully' });
});

app.get('/auth/profile', authenticateAccessToken, (req, res) => {
  return res.json({ user: req.user });
});

app.get('/users', authenticateAccessToken, (req, res) => {
  const users = getAllUsers();
  return res.json({ users });
});

app.get('/posts', authenticateAccessToken, (req, res) => {
  return res.json({ posts });
});

app.post('/posts', authenticateAccessToken, (req, res) => {
  const { role, email } = req.user;
  if (role !== 'admin' && role !== 'editor') {
    return res.status(403).json({ error: 'Editor or admin access required' });
  }

  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }

  const post = {
    id: crypto.randomUUID(),
    title,
    body,
    author: email,
  };
  posts.unshift(post);
  return res.status(201).json({ post, message: 'Post created successfully' });
});

app.put('/posts/:id', authenticateAccessToken, (req, res) => {
  const { role } = req.user;
  if (role !== 'admin' && role !== 'editor') {
    return res.status(403).json({ error: 'Editor or admin access required' });
  }

  const post = posts.find((item) => item.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const { title, body } = req.body;
  if (title) post.title = title;
  if (body) post.body = body;
  return res.json({ post, message: 'Post updated successfully' });
});

app.delete('/posts/:id', authenticateAccessToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const index = posts.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  posts.splice(index, 1);
  return res.json({ message: 'Post deleted successfully' });
});

app.get('/admin/data', authenticateAccessToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  return res.json({ users: getAllUsers(), posts });
});

const port = process.env.PORT || 4000;
const initApp = async () => {
  for (const account of seedUsers) {
    try {
      await registerUser(account.email, account.password, account.role);
      console.log(`Seeded account: ${account.email} / ${account.password}`);
    } catch (err) {
      if (!err.message.includes('already exists')) {
        console.error('Error seeding account:', err);
      }
    }
  }

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
};

initApp();
