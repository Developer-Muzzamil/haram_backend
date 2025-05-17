// controllers/contactController.js
const Contact = require('../models/Contact');

exports.submitContactForm = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    // Basic validation (optional if you're validating on frontend)
    if (!name || !phone || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newContact = new Contact({ name, phone, email, message });
    await newContact.save();

    res.status(201).json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Contact form submission error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};
exports.getAllContacts = async (req, res, next) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  };
  
