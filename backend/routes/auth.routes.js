const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'MENTAL_HEALTH_SECRET';

router.post('/register', async (req, res) => {
  const { username, fullname, password } = req.body;
  const exists = await User.findOne({ username: username });

  if (exists) {
    return res.status(400).json({
      message: 'Пользователь с таким именем уже существует'
    });
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({
    username,
    fullname,
    password: hashed
  });
  res.json({ message: 'User created' });
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role
      },
      SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      token,
      role: user.role,
      username: user.username,
      userId: user._id
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed' });
  }
});


router.get('/check-username/:username', async (req, res) => {
  const exists = await User.exists({ username: req.params.username });
  res.json({ exists: !!exists });
});

module.exports = router;
