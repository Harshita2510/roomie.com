const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();
const port = 3019;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
    origin: "http://127.0.0.1:5500", // Ensure frontend origin is correct
    methods: ["GET", "POST", "PUT"], // Allow necessary methods
    credentials: true
};
app.use(cors(corsOptions));

// Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

app.use(express.static(path.join(__dirname, "final_maybe")));

// ✅ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/property", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

const propertySchema = new mongoose.Schema({
    propertyName: { type: String, unique: true, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    propertyType: { type: String, required: true },
    bhk: { type: Number, default: null }, // Defaulting to null to avoid validation errors
    beds: { type: Number, default: null },
    rooms: { type: Number, default: null },
    availability: { type: String, enum: ["Available", "Not Available"], required: true },
    gender: { type: String, enum: ["Girls", "Boys", "Both"], required: true },
    image: { type: String, required: true }
});

const Property = mongoose.model("property", propertySchema);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "brokeredit.html"));
});

// ✅ POST: Add new property
app.post("/propertyf", upload.single("image"), async (req, res) => {
    try {
        console.log("Received request:", req.body);
        console.log("Uploaded file:", req.file);

        if (!req.file) {
            return res.status(400).json({ error: "Image is required" });
        }

        const { propertyName, location, price, type, propertyType, bhk, beds, rooms, availability, gender } = req.body;
        console.log("Received request body:", req.body);

        const newProperty = new Property({
            propertyName,
            location,
            price: Number(price),
            propertyType: type,
            bhk: propertyType === "Flat" ? Number(bhk) || null : null,
            beds: propertyType === "PG" ? Number(beds) || null : null,
            rooms: propertyType === "PG" ? Number(rooms) || null : null,
            availability,
            gender,
            image: req.file.filename
        });

        await newProperty.save();
        res.json({ message: "Property added successfully!" });

    } catch (error) {
        console.error("❌ Internal Server Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// ✅ GET: Fetch all properties
app.get('/get-properties', async (req, res) => {
    try {
        const properties = await Property.find(); // Fetch all properties from MongoDB
        res.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ✅ PUT: Update a property
app.put("/update-property/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let updatedData = req.body;

        // Remove empty fields (so they don't overwrite existing values)
        Object.keys(updatedData).forEach(key => {
            if (updatedData[key] === "" || updatedData[key] === null) {
                delete updatedData[key];
            }
        });

        console.log("Updating property with:", updatedData);

        const updatedProperty = await Property.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedProperty) {
            return res.status(404).json({ message: "Property not found" });
        }

        res.json({ message: "Property updated successfully!", updatedProperty });
    } catch (error) {
        console.error("Error updating property:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
