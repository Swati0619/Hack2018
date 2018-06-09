const express = require('express');
const router = express.Router();
const twitterController = require('../controller/twitterController');
router.post('/',twitterController.searchTwitterFortag);
module.exports = router;