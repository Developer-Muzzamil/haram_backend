const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const guideController = require('../controllers/guideController');

const cpUpload = upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'idProof', maxCount: 1 },
  { name: 'certificationsFiles', maxCount: 5 }
]);

router.post('/register', cpUpload, guideController.registerGuide);
router.get('/list', guideController.listGuides);

module.exports = router;