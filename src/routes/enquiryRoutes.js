const express = require("express");
const router = express.Router();
const { submitEnquiry,getAllEnquiries } = require("../controllers/enquiryController");

router.post("/enquiry", submitEnquiry);
router.get("/enquiry", getAllEnquiries); // GET route to fetch all enquiries

module.exports = router;
