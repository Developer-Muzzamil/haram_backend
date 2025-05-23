const express = require('express');
const { getJSON } = require('../controllers/dataController');
const router = express.Router();

// GET /api/data/:file  (e.g., /api/data/makkah_hp)
router.get('/:file', getJSON);

module.exports = router;
