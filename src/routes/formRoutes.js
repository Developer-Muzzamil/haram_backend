const express = require('express');
const { submitContact, submitEnquiry } = require('../controllers/formController');
const router = express.Router();

// POST /api/contact
router.post('/contact', submitContact);

// POST /api/enquiry
router.post('/enquiry', submitEnquiry);

module.exports = router;
