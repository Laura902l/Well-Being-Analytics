// const express = require('express');
// const router = express.Router();

// const auth = require('../middleware/auth.middleware');
// const Survey = require('../models/Survey');
// const admin = require('../middleware/admin.middleware');

// router.post('/', auth, async (req, res) => {
//   try {
//     const { surveyId, data } = req.body;
//     const userId = req.user.id;
    
//     /* istanbul ignore next */
//     if (!req.user.username) {
//       return res.status(400).json({ message: 'Username missing in token' });
//     }

//     await Survey.findOneAndUpdate(
//       { userId, surveyId },
//       {
//         data,
//         username: req.user.username
//       },
//       {
//         new: true,
//         upsert: true,
//         setDefaultsOnInsert: true
//       }
//     );

//     res.json({ message: 'Survey saved' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to save survey' });
//   }
// });

// router.get('/admin', auth, admin, async (req, res) => {
//   try {
//     const surveys = await Survey.find()
//       .sort({ updatedAt: -1 });

//     res.json(surveys);
//   } catch (e) {
//     /* istanbul ignore next */
//     console.error(e);
//     res.status(500).json({ message: 'Failed to load surveys' });
//   }
// });

// router.get('/:userId', auth, async (req, res) => {
//   try {
//     /* istanbul ignore else */
//     if (req.user.id !== req.params.userId) {
//       return res.status(403).json({ message: 'Forbidden' });
//     }

//     const surveys = await Survey.find({
//       userId: req.user.id
//     }).sort({ updatedAt: -1 });

//     res.json(surveys);
//   } catch (e) {
//     /* istanbul ignore next */
//     console.error(e);
//     res.status(500).json({ message: 'Failed to load surveys' });
//   }
// });



// module.exports = router;
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const admin = require('../middleware/admin.middleware');
const Survey = require('../models/Survey');

// SAVE SURVEY
router.post('/', auth, async (req, res) => {
  const { surveyId, data } = req.body;
  const user = req.user;

  if (!user || !user.id || !user.username) {
    return res.status(400).json({ message: 'Invalid user data in token' });
  }

  try {
    await Survey.findOneAndUpdate(
      { userId: user.id, surveyId },
      {
        data,
        username: user.username
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    res.json({ message: 'Survey saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save survey' });
  }
});

// ADMIN: GET ALL SURVEYS
router.get('/admin', auth, admin, async (req, res) => {
  try {
    const surveys = await Survey.find().sort({ updatedAt: -1 });
    res.json(surveys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load surveys' });
  }
});

// USER: GET OWN SURVEYS
router.get('/:userId', auth, async (req, res) => {
  if (req.user.id !== req.params.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const surveys = await Survey.find({ userId: req.user.id })
      .sort({ updatedAt: -1 });

    res.json(surveys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load surveys' });
  }
});

module.exports = router;
