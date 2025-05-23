const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    guide: { type: mongoose.Schema.Types.ObjectId, ref: 'Guide', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String, required: true },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, required: true },
    timeFrom: { type: String, required: true },
    timeTo: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);