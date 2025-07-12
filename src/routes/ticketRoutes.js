const express = require('express');
const router = express.Router();
const { validateTicket, checkInTicket, scanTicket } = require('../controllers/ticketController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/validate', validateTicket);
router.post('/check-in', authMiddleware, checkInTicket);
router.post('/scan', authMiddleware, scanTicket);

module.exports = router;