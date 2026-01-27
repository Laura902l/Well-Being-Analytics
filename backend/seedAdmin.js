require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }
    
    /* istanbul ignore next */
    const hashed = await bcrypt.hash('admin123', 10);

    await User.create({
      username: 'admin',
      password: hashed,
      role: 'admin'
    });

    console.log('Admin created');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedAdmin();
