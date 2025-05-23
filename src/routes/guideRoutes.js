const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide');
const upload = require('../middleware/upload');
const sendMail = require('../utils/sendMail');

const cpUpload = upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'idProof', maxCount: 1 },
  { name: 'certificationsFiles', maxCount: 5 }
]);

router.post('/register', cpUpload, async (req, res) => {
  try {
    const { body, files } = req;
    if (!files.profilePic || !files.idProof)
      return res.status(400).json({ error: 'Profile photo and ID proof are required.' });

    const profilePicInfo = files.profilePic[0];
    const profilePic = {
      filename: profilePicInfo.filename,
      url: `/uploads/profilePics/${profilePicInfo.filename}`
    };

    const idProofInfo = files.idProof[0];
    const idProof = {
      filename: idProofInfo.filename,
      url: `/uploads/idProofs/${idProofInfo.filename}`,
      mimetype: idProofInfo.mimetype
    };

    const certificationsFiles = (files.certificationsFiles || []).map(file => ({
      filename: file.filename,
      url: `/uploads/certifications/${file.filename}`,
      mimetype: file.mimetype
    }));

    const newGuide = new Guide({
      ...body,
      age: Number(body.age),
      charges: Number(body.charges),
      profilePic,
      idProof,
      certificationsFiles
    });

    await newGuide.save();

    // Send a registration confirmation email to the guide
    await sendMail({
      to: body.email,
      subject: 'Welcome to Haramain Guides!',
      html: `<h2>Assalamu Alaikum ${body.name},</h2>
             <p>Your registration as a guide has been received.</p>
             <p>We will contact you if further information is required.</p>
             <br>
             <p>Best regards,<br>Team - Nextstop:Haramain</p>`
    });

    res.status(201).json({ message: 'Guide registered successfully.', guide: newGuide });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Registration failed.' });
  }
});

router.get('/list', async (req, res) => {
  try {
    // Optionally filter available guides by date/time if query params are present
    const { dateFrom, dateTo, timeFrom, timeTo } = req.query;
    let guides = await Guide.find();
    if (dateFrom && dateTo && timeFrom && timeTo) {
      // Filter out unavailable guides
      const availableGuides = [];
      for (const guide of guides) {
        const isBooked = await guide.isBookedForPeriod(
          new Date(dateFrom),
          new Date(dateTo),
          timeFrom,
          timeTo
        );
        if (!isBooked) availableGuides.push(guide);
      }
      return res.json(availableGuides);
    }
    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;