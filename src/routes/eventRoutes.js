const express = require('express');
const router = express.Router();
const { createEvent, getStats } = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/create', authMiddleware, upload.single('banner'), createEvent);
router.get('/stats', authMiddleware, getStats);

module.exports = router;