const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3019;
const multer = require("multer");
const fs = require("fs");






// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // ✅ ALLOW FRONTEND ORIGIN
    methods: ["GET", "POST", "PUT"],
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






// Serve static files
app.use(express.static(path.join(__dirname, 'final_maybe')));







// MongoDB Atlas connection
const atlasConnectionString = 'mongodb+srv://harshitab2510:harshitab2510@db.zwejk.mongodb.net/test?retryWrites=true&w=majority&appName=db';
mongoose.connect(atlasConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Atlas connected successfully"))
.catch(err => console.error("❌ MongoDB connection failed:", err));









// Broker Schema & Model


// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontpage.html"));
});

app.get('/indexx.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'final_maybe', 'indexx.html'));
});




// User Schema & Model (Student)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    place: { type: String, required: true }
});
const User = mongoose.model("student", userSchema);



//broker schema 
const brokerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    BrokerLicense: { type: String, required: true },
    properttype: { type: String, required: true },
    location: { type: String, required: true }
});
const Register = mongoose.model("brokerregistration", brokerSchema);



// Student Registration
app.post('/register', async (req, res) => {
    try {
        const { username, password, mobile, email, place } = req.body;

        if (!username || !password || !mobile || !email || !place) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const newUser = new User({ username, password, mobile, email, place });
        await newUser.save();
        console.log("✅ User registered:", username);
        // console.log("Received registration request:", req.body);


        res.json({ message: "Registration successful", redirect: "login.html" });
    } catch (error) {
        console.error("❌ Server error during registration:", error);
        res.status(500).json({ error: error.message });
    }
    
});

// Broker Registration
app.post("/brokerx", async (req, res) => {
    console.log("Received request body:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Request body is empty. Check if JSON middleware is enabled." });
    }

    try {
        const { username, password, email, mobile, BrokerLicense, properttype, location } = req.body;
        const existingBroker = await Register.findOne({ username });

        if (existingBroker) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const newBroker = new Register({ username, password, email, mobile, BrokerLicense, properttype, location });
        await newBroker.save();

        res.status(201).json({ message: "Broker registered successfully", redirect: "login.html" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        let user;

        // Check in Student Database
        user = await User.findOne({ username });
        if (user && user.password === password) {
            return res.status(200).json({ success: true, role: "student", redirect: "indexx.html" });
        }

        // Check in Broker Database
        user = await Register.findOne({ username });
        if (user && user.password === password) {
            return res.status(200).json({ success: true, role: "broker", redirect: "propertyFilter.html" });
        }

        return res.status(401).json({ success: false, message: "Invalid username or password" });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ success: false, message: "Server error. Try again later." });
    }
});




// Roommate Schema & Model
const roommateSchema = new mongoose.Schema({
    name: String,
    gender: String,
    hobby: String,
    course: String,
    food: String,
    bhk: String,
    type: String,
    note: String
});
const Roommate = mongoose.model("Roommate", roommateSchema);


// Roommate Form Submission
app.post("/submit", async (req, res) => {
    try {
        const { name, gender, hobby, course, food, bhk, type, note } = req.body;
        const newUser = new Roommate({ name, gender, hobby, course, food, bhk, type, note });
        await newUser.save();
        console.log("✅ User registered:", name);

        res.json({ message: "Registration successful" , redirect: "roommateFilter.html"});
    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ error: "Server error" });
    }
});



// Get All Roommates
app.get("/roommates", async (req, res) => {
    try {
        const roommates = await Roommate.find();
        res.json(roommates);
    } catch (error) {
        console.error("❌ Error fetching roommates:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Update Roommate
app.put("/roommates/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const result = await Roommate.findByIdAndUpdate(id, updatedData, { new: true });

        if (!result) return res.status(404).send({ message: "Roommate not found" });

        res.json(result);
    } catch (error) {
        console.error("Error updating roommate:", error);
        res.status(500).send({ message: "Error updating roommate", error });
    }
});




// Property Schema & Model
const PropertySchema = new mongoose.Schema({
    brokerlis: { type: String, required: true },  // ✅ Broker License
    propertyName: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    propertyType: { type: String, required: true },
    bhk: { type: Number, default: null },
    beds: { type: Number, default: null },
    rooms: { type: Number, default: null },
    availability: { type: String, required: true },
    gender: { type: String, required: true },
    services: { type: [String], default: [] },  // ✅ Store Services as an array
    image: { type: String, required: true }
});

const Property = mongoose.model("property", PropertySchema);
// Add Property
app.post("/propertyf", upload.single("image"), async (req, res) => {
    try {
        console.log("Received request:", req.body);
        console.log("Uploaded file:", req.file);

        if (!req.file) {
            return res.status(400).json({ error: "Image is required" });
        }

        // Extract values from the request body
        const { brokerlis, propertyName, location, price, type, propertyType, bhk, beds, rooms, availability, gender, services } = req.body;

        // Ensure `services` is stored as an array if multiple checkboxes are selected
        const servicesArray = Array.isArray(services) ? services : [services];

        console.log("Received request body:", req.body);

        // Create a new property object
        const newProperty = new Property({
            brokerlis,  // ✅ Save broker license
            propertyName,
            location,
            price: Number(price),
            propertyType: type,
            bhk: propertyType === "Flat" ? Number(bhk) || null : null,
            beds: propertyType === "PG" ? Number(beds) || null : null,
            rooms: propertyType === "PG" ? Number(rooms) || null : null,
            availability,
            gender,
            services: servicesArray,  // ✅ Save services as an array
            image: req.file.filename
        });

        await newProperty.save();
        res.json({ message: "Property added successfully!" });

    } catch (error) {
        console.error("❌ Internal Server Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// Get All Properties
app.get('/get-properties', async (req, res) => {
    try {
        const properties = await Property.find();
        res.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update Property
app.put("/update-property/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let updatedData = req.body;

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
app.get('/get-properties/:brokerlis', async (req, res) => {
    try {
        const { brokerlis } = req.params; // Get broker license from URL
        const properties = await Property.find({ brokerlis: brokerlis });

        if (properties.length === 0) {
            return res.status(404).json({ message: "No properties found for this broker license" });
        }

        res.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`✅ Server is running on http://localhost:${port}`);
});