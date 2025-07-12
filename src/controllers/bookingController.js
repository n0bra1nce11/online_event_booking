const pool = require('../config/db');
const logger = require('../utils/logger');
const { signData } = require('../utils/crypto');

const bookTicket = async (req, res) => {
  const { event_name, full_name, phone_number, email_address, ticket_quantity } = req.body;

  try {
    const eventResult = await pool.query('SELECT * FROM events WHERE name = $1', [event_name]);
    const event = eventResult.rows[0];

    if (!event || !event.available) {
      logger.warn(`Booking failed: Event ${event_name} not available`);
      return res.status(400).json({ error: 'Event not available' });
    }

    const bookingId = `EVENTNP_${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
    const signature = signData(`${bookingId}:${event_name}:${email_address}`);

    const result = await pool.query(
      'INSERT INTO bookings (booking_id, event_id, full_name, phone_number, email_address, ticket_quantity, signature, consumed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [bookingId, event.id, full_name, phone_number, email_address, ticket_quantity, signature, false]
    );

    await pool.query(
      'UPDATE events SET tickets_sold = tickets_sold + $1, total_sales = total_sales + $2 WHERE id = $3',
      [ticket_quantity, ticket_quantity * 1000, event.id]
    );

    logger.info(`Booking successful: ${bookingId} for ${event_name}`);
    res.json({ booking: result.rows[0], private_key: process.env.PRIVATE_KEY_PEM });
  } catch (error) {
    logger.error('Booking error', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { bookTicket };