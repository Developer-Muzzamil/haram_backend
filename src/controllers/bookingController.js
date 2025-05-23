const mongoose = require('mongoose');
const Guide = require('../models/Guide');
const Booking = require('../models/Booking');
const sendMail = require('../utils/sendMail');

exports.createBooking = async (req, res) => {
  try {
    // Accept both camelCase and non-camelCase field names for compatibility
    const {
      guideId,
      userName, userEmail, userPhone,
      name, email, phone,
      dateFrom, dateTo, timeFrom, timeTo, message
    } = req.body;

    // Use camelCase if present, else fallback to non-camelCase
    const finalUserName = userName || name;
    const finalUserEmail = userEmail || email;
    const finalUserPhone = userPhone || phone;

    // Validate required fields
    if (!guideId || !finalUserName || !finalUserEmail || !finalUserPhone || !dateFrom || !dateTo || !timeFrom || !timeTo) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Validate guideId
    if (!mongoose.Types.ObjectId.isValid(guideId)) {
      return res.status(400).json({ error: "Invalid guideId." });
    }

    // Find the guide
    const guide = await Guide.findById(guideId);
    if (!guide) return res.status(404).json({ error: "Guide not found." });

    // Check for overlap
    const isBooked = await guide.isBookedForPeriod(
      new Date(dateFrom),
      new Date(dateTo),
      timeFrom,
      timeTo
    );
    if (isBooked)
      return res.status(409).json({ error: "Guide is already booked for the selected date and time." });

    // Create booking
    const booking = await Booking.create({
      guide: guide._id,
      userName: finalUserName,
      userEmail: finalUserEmail,
      userPhone: finalUserPhone,
      dateFrom,
      dateTo,
      timeFrom,
      timeTo,
      message,
      status: 'pending'
    });

    // Email notifications
    const bookingDetailsHtml = `
      <h2>Guide Booking Received</h2>
      <p><b>Guide:</b> ${guide.name} (${guide.email})</p>
      <p><b>Booker:</b> ${finalUserName} &lt;${finalUserEmail}&gt;, Phone: ${finalUserPhone}</p>
      <p><b>Date:</b> ${dateFrom} to ${dateTo}</p>
      <p><b>Time:</b> ${timeFrom} to ${timeTo}</p>
      <p><b>Message:</b> ${message || "—"}</p>
    `;

    // Email to guide
    await sendMail({
      to: guide.email,
      subject: `New Booking Request from ${finalUserName}`,
      html: `
        <p>Dear ${guide.name},</p>
        <p>You have received a new booking request on Nextstop:Haramain:</p>
        ${bookingDetailsHtml}
        <p>Please contact the booker and confirm the booking as soon as possible.</p>
        <p>Best regards,<br>Nextstop:Haramain Team</p>
      `,
    });

    // Email to booker
    await sendMail({
      to: finalUserEmail,
      subject: "Your Guide Booking Request has been Received",
      html: `
        <p>Dear ${finalUserName},</p>
        <p>Your booking request for guide <b>${guide.name}</b> has been received.</p>
        <p>We will contact you soon to confirm your booking.</p>
        ${bookingDetailsHtml}
        <p>Best regards,<br>Nextstop:Haramain Team</p>
      `,
    });

    // Respond
    return res.json({
      message: "Booking request sent! Confirmation email sent to you and the guide.",
      booking
    });
  } catch (err) {
    console.error("Booking error:", err);
    return res.status(500).json({ error: "Failed to process booking." });
  }
};