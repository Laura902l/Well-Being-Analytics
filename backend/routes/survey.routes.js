const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const admin = require('../middleware/admin.middleware');
const Survey = require('../models/Survey');

router.post('/', auth, async (req, res) => {
  const { surveyId, data } = req.body;
  const user = req.user;
  if (!user || !user.id || !user.username) {
    return res.status(400).json({ message: 'Invalid user data in token' });
  }

  try {
    await Survey.findOneAndUpdate(
      { userId: user.id, surveyId },
      { data, username: user.username },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ message: 'Survey saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save survey' });
  }
});

router.get('/admin', auth, admin, async (req, res) => {
  try {
    const surveys = await Survey.find().sort({ updatedAt: -1 });
    res.json(surveys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load surveys' });
  }
});

router.get('/:userId', auth, async (req, res) => {
  if (req.user.id !== req.params.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const surveys = await Survey.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(surveys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load surveys' });
  }
});

module.exports = router;
