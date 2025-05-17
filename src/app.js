const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes');
const contactRoutes = require('./routes/contactRoutes');
const enquiryRoutes = require("./routes/enquiryRoutes");

const app = express();

app.use(cors({
  //origin: 'https://nextstop-haramain.netlify.app' // or use '*' for development
  origin:'http://localhost:5174'// Allow local host
}));

app.use(express.json());

// Mount routes
app.use('/api/data', dataRoutes);
app.use('/api', contactRoutes);  // <- THIS is important
app.use("/api", enquiryRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server Error' });
});

module.exports = app;
