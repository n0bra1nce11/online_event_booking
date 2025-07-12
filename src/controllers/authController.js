const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const logger = require('../utils/logger');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    const admin = result.rows[0];

    if (!admin) {
      logger.warn(`Admin login failed: Username ${username} not found`);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      logger.warn(`Admin login failed: Invalid password for ${username}`);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    logger.info(`Admin ${username} logged in successfully`);
    res.json({ token });
  } catch (error) {
    logger.error('Login error', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { login };