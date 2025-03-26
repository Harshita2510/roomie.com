const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = 3019;
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/brandfluence", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("❌ MongoDB Connection Error:", err);
});

db.once("open", () => {
  console.log("✅ MongoDB Connected Successfully!");
});

// Profile Schema & Model
const ProfileSchema = new mongoose.Schema({
  fullName: String,
  username: String,
  email: String,
  password: String,
  role: String,
  mobile: String,
  gender: String,
  socialMedia: String,
  socialID: String,
  followers: Number
});

const Profile = mongoose.model("Profile", ProfileSchema);

// ✅ FIXED: Only one `/signup` route that correctly saves data
app.post("/signup", async (req, res) => {
  try {
    console.log("Received registration request:", req.body);

    // Create and save profile to MongoDB
    const newProfile = new Profile(req.body);
    await newProfile.save();

    res.status(201).json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ success: false, message: "Error processing registration" });
  }
});

// API to Fetch Profile Data
// API to Fetch All Influencers
app.get("/api/influencers", async (req, res) => {
  try {
    const influencers = await Profile.find(); // Fetch all influencer profiles
    res.json(influencers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching influencers" });
  }
});

// API to Update a Profile
app.put("/api/profile/:id", async (req, res) => {
  try {
    const updatedProfile = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProfile) return res.status(404).json({ error: "Profile not found" });
    res.json({ message: "Profile updated successfully!", updatedProfile });
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
});

// API to Delete a Profile
app.delete("/api/profile/:id", async (req, res) => {
  try {
    const deletedProfile = await Profile.findByIdAndDelete(req.params.id);
    if (!deletedProfile) return res.status(404).json({ error: "Profile not found" });
    res.json({ message: "Profile deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting profile" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
