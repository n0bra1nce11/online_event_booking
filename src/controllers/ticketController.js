const pool = require('../config/db');
const logger = require('../utils/logger');
const { verifyData } = require('../utils/crypto');

const validateTicket = async (req, res) => {
  const { booking_id, private_key } = req.body;

  try {
    const result = await pool.query('SELECT * FROM bookings WHERE booking_id = $1', [booking_id]);
    const booking = result.rows[0];

    if (!booking) {
      logger.warn(`Ticket validation failed: Booking ID ${booking_id} not found`);
      return res.status(404).json({ error: 'Invalid booking ID' });
    }

    if (private_key !== process.env.PRIVATE_KEY_PEM) {
      logger.warn(`Ticket validation failed: Invalid private key for ${booking_id}`);
      return res.status(401).json({ error: 'Invalid private key' });
    }

    const eventResult = await pool.query('SELECT name, date FROM events WHERE id = $1', [booking.event_id]);
    const event = eventResult.rows[0];

    const isValid = verifyData(`${booking_id}:${event.name}:${booking.email_address}`, booking.signature);
    if (!isValid) {
      logger.warn(`Ticket validation failed: Invalid signature for ${booking_id}`);
      return res.status(401).json({ error: 'Invalid ticket signature' });
    }

    logger.info(`Ticket validated: ${booking_id} for ${event.name}`);
    res.json({
      valid: true,
      event: event.name,
      date: event.date,
      booking: {
        full_name: booking.full_name,
        email_address: booking.email_address,
        ticket_quantity: booking.ticket_quantity,
        consumed: booking.consumed
      }
    });
  } catch (error) {
    logger.error('Ticket validation error', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const checkInTicket = async (req, res) => {
  const { booking_id } = req.body;

  try {
    const result = await pool.query('SELECT * FROM bookings WHERE booking_id = $1', [booking_id]);
    const booking = result.rows[0];

    if (!booking) {
      logger.warn(`Check-in failed: Booking ID ${booking_id} not found`);
      return res.status(404).json({ error: 'Invalid booking ID' });
    }

    if (booking.consumed) {
      logger.warn(`Check-in failed: Ticket ${booking_id} already consumed`);
      return res.status(400).json({ error: 'Ticket already consumed' });
    }

    await pool.query('UPDATE bookings SET consumed = true WHERE booking_id = $1', [booking_id]);
    logger.info(`Ticket checked in: ${booking_id}`);
    res.json({ message: `Ticket ${booking_id} checked in successfully` });
  } catch (error) {
    logger.error('Check-in error', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const scanTicket = async (req, res) => {
  const { booking_id } = req.body;

  try {
    const result = await pool.query('SELECT * FROM bookings WHERE booking_id = $1', [booking_id]);
    const booking = result.rows[0];

    if (!booking) {
      logger.warn(`QR scan failed: Booking ID ${booking_id} not found`);
      return res.status(404).json({ error: 'Invalid QR code' });
    }

    const eventResult = await pool.query('SELECT name FROM events WHERE id = $1', [booking.event_id]);
    const event = eventResult.rows[0];

    if (booking.consumed) {
      logger.warn(`QR scan failed: Ticket ${booking_id} already consumed`);
      return res.status(400).json({ error: 'Ticket already consumed' });
    }

    await pool.query('UPDATE bookings SET consumed = true WHERE booking_id = $1', [booking_id]);
    logger.info(`Ticket scanned and checked in: ${booking_id}`);
    res.json({
      message: `Ticket ${booking_id} checked in successfully`,
      event: event.name,
      booking: {
        full_name: booking.full_name,
        email_address: booking.email_address,
        ticket_quantity: booking.ticket_quantity,
        consumed: true
      }
    });
  } catch (error) {
    logger.error('QR scan error', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { validateTicket, checkInTicket, scanTicket };