// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Helper to ensure directories exist
// function ensureDir(dir) {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// }

// // Storage for different fields
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     let dest;
//     if (file.fieldname === 'profilePic') {
//       dest = './uploads/profilePics';
//     } else if (file.fieldname === 'idProof') {
//       dest = './uploads/idProofs';
//     } else if (file.fieldname === 'certificationsFiles') {
//       dest = './uploads/certifications';
//     } else {
//       dest = './uploads/misc';
//     }
//     ensureDir(dest);
//     cb(null, dest);
//   },
//   filename: function (req, file, cb) {
//     const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, unique + path.extname(file.originalname));
//   }
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (file.fieldname === 'profilePic') {
//       if (
//         file.mimetype === 'image/jpeg' ||
//         file.mimetype === 'image/png'
//       ) return cb(null, true);
//       return cb(new Error('Profile picture must be JPG or PNG.'));
//     }
//     if (file.fieldname === 'idProof' || file.fieldname === 'certificationsFiles') {
//       if (
//         [
//           'application/pdf', 'application/msword',
//           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//           'image/jpeg', 'image/png', 'image/jpg'
//         ].includes(file.mimetype)
//       ) return cb(null, true);
//       return cb(new Error('ID Proof/Certification: Unsupported file type.'));
//     }
//     cb(null, true);
//   },
//   limits: {
//     fileSize: 2 * 1024 * 1024 // 2MB for all files (profilePic size checked on front; backend will error for oversize)
//   }
// });

// module.exports = upload;





const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Set up Cloudinary storage for different fields
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'misc';
    if (file.fieldname === 'profilePic') folder = 'profilePics';
    else if (file.fieldname === 'idProof') folder = 'idProofs';
    else if (file.fieldname === 'certificationsFiles') folder = 'certifications';

    return {
      folder: folder,
      resource_type: file.mimetype.startsWith('image/') ? 'image' : 'auto',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
      public_id: Date.now() + '-' + Math.round(Math.random() * 1e9)
    };
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'profilePic') {
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') return cb(null, true);
      return cb(new Error('Profile picture must be JPG or PNG.'));
    }
    if (file.fieldname === 'idProof' || file.fieldname === 'certificationsFiles') {
      if (
        [
          'application/pdf', 'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg', 'image/png', 'image/jpg'
        ].includes(file.mimetype)
      ) return cb(null, true);
      return cb(new Error('ID Proof/Certification: Unsupported file type.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});

module.exports = upload;