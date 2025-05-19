const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerAdmin = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const existingAdmin = await User.findOne({ role: 'Admin' });
    if (existingAdmin) return res.status(400).json({ msg: 'Admin already exists' });

    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ msg: 'Username taken' });

    const hashed = await bcrypt.hash(password, 10);
    const admin = new User({ name, username, password: hashed, role: 'Admin' });
    await admin.save();
    res.status(201).json({ msg: 'Admin registered' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
