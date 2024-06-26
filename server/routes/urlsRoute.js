const express = require('express')
const router = express.Router();
const urls = require('../controllers/urlsController')
const authenticate = require('../middleware/auth');


router.get('/urls', authenticate, urls);

module.exports = router