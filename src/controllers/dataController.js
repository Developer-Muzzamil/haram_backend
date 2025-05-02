const path = require('path');
const fs = require('fs').promises;

const getJSON = async (req, res, next) => {
  try {
    const { file } = req.params;

    // Fix: Go to root directory (not src)
    const dataPath = path.join(__dirname, '..', '..', 'public', 'data', `${file}.json`);

    console.log(`Looking for file at: ${dataPath}`); // Debug log

    await fs.access(dataPath); // Check if file exists
    const raw = await fs.readFile(dataPath, 'utf8');
    const json = JSON.parse(raw);
    res.json(json);
  } catch (err) {
    console.error('Error reading file:', err);
    next({ status: 404, message: `Data not found: ${err.message}` });
  }
};

module.exports = { getJSON };
