const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes');
const contactRoutes = require('./routes/contactRoutes');
const enquiryRoutes = require("./routes/enquiryRoutes");
const guideRouter = require("./routes/guideRoutes");
const bookingRoutes = require('./routes/bookingRoutes');
const app = express();
const path = require('path');


app.use(cors({
  //origin: 'https://nextstop-haramain.netlify.app' // or use '*' for development
  origin: 'http://localhost:5173' // Allow local host
}));
// Basic Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const absoluteUploadsPath = path.resolve(__dirname, '../uploads');
// Serve uploads 
app.use('/api/uploads', express.static(absoluteUploadsPath));
app.use('/api/data', dataRoutes);
app.use('/api', contactRoutes);  // <- THIS is important
app.use("/api", enquiryRoutes);
app.use('/api/guides', guideRouter);
app.use('/api/bookings', bookingRoutes);


// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server Error' });
});

module.exports = app;
