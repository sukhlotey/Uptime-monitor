const express = require('express');
const { check } = require('../controllers/websiteCheckController');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.post('/check', authenticate, check);

module.exports = router;
