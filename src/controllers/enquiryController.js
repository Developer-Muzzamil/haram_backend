const Enquiry = require("../models/Enquiry");

exports.submitEnquiry = async (req, res) => {
  try {
    const { name, phone, email, packageId } = req.body;

    // Validate name, phone, email, packageId
    if (!name || !phone || !email || !packageId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Optional: Validate email format manually (extra validation if needed)
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    // Optional: Validate phone number format (extra validation if needed)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Phone number must be 10 digits." });
    }

    // Create new enquiry and save to DB
    const newEnquiry = new Enquiry({ name, phone, email, packageId });
    await newEnquiry.save();

    res.status(201).json({ message: "Enquiry submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
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
