const Enquiry = require("../models/Enquiry");

exports.submitEnquiry = async (req, res) => {
  try {
    const { name, phone, packageId } = req.body;
    if (!name || !phone || !packageId) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newEnquiry = new Enquiry({ name, phone, packageId });
    await newEnquiry.save();
    res.status(201).json({ message: "Enquiry submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
exports.getAllEnquiries = async (req, res) => {
    try {
      const enquiries = await Enquiry.find().sort({ createdAt: -1 });
      res.status(200).json(enquiries);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      res.status(500).json({ error: "Failed to fetch enquiries" });
    }
  };
  