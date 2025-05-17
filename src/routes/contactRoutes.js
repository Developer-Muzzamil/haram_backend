// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { submitContactForm,getAllContacts} = require('../controllers/contactController');

router.post('/contact', submitContactForm);
router.get('/contacts', getAllContacts);

module.exports = router;
