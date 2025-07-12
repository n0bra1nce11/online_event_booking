const pool = require('../config/db');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');

const createEvent = async (req, res) => {
  const { name, date, description, total_tickets } = req.body;
  const banner = req.file;

  try {
    if (!name || !date || !description || !total_tickets || !banner) {
      logger.warn('Event creation failed: Missing required fields');
      return res.status(400).json({ error: 'All fields are required, including banner image' });
    }

    const totalTickets = parseInt(total_tickets);
    if (isNaN(totalTickets) || totalTickets <= 0) {
      logger.warn('Event creation failed: Invalid total tickets');
      return res.status(400).json({ error: 'Total tickets must be a positive number' });
    }

    const bannerPath = `/images/uploads/${banner.filename}`;
    const result = await pool.query(
      'INSERT INTO events (name, date, description, total_tickets, tickets_sold, total_sales, banner_image, available) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, date, description, totalTickets, 0, 0, bannerPath, true]
    );

    logger.info(`Event created: ${name}`);
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Event creation error', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getStats = async (req, res) => {
  try {
    const result = await pool.query('SELECT name, total_tickets, tickets_sold, total_sales FROM events');
    res.json(result.rows);
  } catch (error) {
    logger.error('Stats retrieval error', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createEvent, getStats };