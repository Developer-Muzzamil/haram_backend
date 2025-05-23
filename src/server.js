require('dotenv').config();
const app       = require('./app');
const connectDB = require('./config/db');
const path = require('path');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  const absoluteUploadsPath = path.resolve(__dirname, '../uploads');
console.log('Serving static files from:', absoluteUploadsPath);
  });
});
