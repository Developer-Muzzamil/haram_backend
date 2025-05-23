const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    profilePic: {
      filename: String,
      url: String,
    },
    idProof: {
      filename: String,
      url: String,
      mimetype: String,
    },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true },
    languages: { type: String, required: true },
    age: { type: Number, required: true },
    charges: { type: Number, required: true },
    experience: { type: String, required: true },
    areas: { type: String, required: true },
    availability: { type: String, required: true },
    description: { type: String, required: true },
    social: { type: String },
    license: { type: String },
    certificationsFiles: [
      {
        filename: String,
        url: String,
        mimetype: String,
      },
    ],
    // isBooked: { type: Boolean, default: false }, // Not required now, see note below
  },
  { timestamps: true }
);

/**
 * Checks if the guide is booked for the given period (date + time).
 * @param {Date} dateFrom
 * @param {Date} dateTo
 * @param {String} timeFrom
 * @param {String} timeTo
 * @returns {Promise<Boolean>}
 */
guideSchema.methods.isBookedForPeriod = async function (dateFrom, dateTo, timeFrom, timeTo) {
  const Booking = mongoose.model('Booking');
  const bookings = await Booking.find({
    guide: this._id,
    status: { $in: ['pending', 'confirmed'] },
    dateFrom: { $lte: dateTo },
    dateTo: { $gte: dateFrom }
  });

  for (const booking of bookings) {
    const bookingStart = booking.dateFrom.toISOString().slice(0, 10);
    const bookingEnd = booking.dateTo.toISOString().slice(0, 10);
    const reqStart = dateFrom.toISOString().slice(0, 10);
    const reqEnd = dateTo.toISOString().slice(0, 10);

    // If date ranges overlap and are on the exact same day, check time overlap
    if (bookingStart === reqStart && bookingEnd === reqEnd) {
      if (
        (booking.timeFrom < timeTo) && // booking starts before requested ends
        (booking.timeTo > timeFrom)    // booking ends after requested starts
      ) {
        return true;
      }
    } else {
      // If booking spans multiple days, treat as overlap
      return true;
    }
  }
  return false;
};

module.exports = mongoose.model('Guide', guideSchema);