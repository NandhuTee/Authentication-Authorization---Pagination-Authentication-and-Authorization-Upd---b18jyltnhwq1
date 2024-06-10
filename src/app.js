const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 'your-secret-key'; // Replace with your secret key

app.use(bodyParser.json());

// Mock user data (replace with a database in a real application)
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

// Authentication endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Find user by username and password
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  // If authentication is successful, generate a JWT token and send it in the response
  const token = jwt.sign({ userId: user.id, username: user.username }, secretKey);
  res.status(201).json({ token });
});

// Protected route
app.get('/profile', (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization required' });
  }

  // Verify JWT token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // If the token is valid, send the user's profile data
    res.status(200).json({ message: 'Profile data', user: decoded });
  });
});

module.exports = app;
