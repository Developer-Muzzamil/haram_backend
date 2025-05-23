const Guide = require('../models/Guide');

exports.createGuide = async (req, res) => {
  try {
    // Collect file info
    const files = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      url: `/uploads/certifications/${file.filename}`
    })) : [];

    // Collect other fields
    const {
      name, gender, contact, email, location, languages, age, charges,
      experience, areas, availability, description, photo, social, license
    } = req.body;

    const newGuide = new Guide({
      name, gender, contact, email, location, languages, age, charges,
      experience, areas, availability, description, photo, social, license,
      certifications: files
    });

    await newGuide.save();
    res.status(201).json(newGuide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};