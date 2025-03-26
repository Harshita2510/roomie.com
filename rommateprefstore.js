const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3019;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'final_maybe')));
// ✅ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/roommatesDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

// Connect to MongoDB

// Define Mongoose Schema
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

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "roomateform.html"));
});

// API Route to handle form submission
app.post("/submit", async (req, res) => {
    try {
        const{name,
            gender,
            hobby,
            course,
            food,
            bhk,
            type,
            note} = req.body;
            const newUser = new Roommate({ name,
                gender,
                hobby,
                course,
                food,
                bhk,
                type,
                note });
            await newUser.save();
            console.log("✅ User registered:", name);
    
            res.json({ message: "Registration successful" });
        } catch (error) {
            console.error("❌ Error registering user:", error);
            res.status(500).json({ error: "Server error" });
        }
});


// API Route to get all roommates
app.get("/roommates", async (req, res) => {
    try {
        const roommates = await Roommate.find(); // Fetch all roommates from MongoDB
        res.json(roommates);
    } catch (error) {
        console.error("❌ Error fetching roommates:", error);
        res.status(500).json({ error: "Server error" });
    }
});


// API Route to edit roommate details
app.put("/roommates/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const result = await RoommateModel.findByIdAndUpdate(id, updatedData, { new: true });

        if (!result) return res.status(404).send({ message: "Roommate not found" });

        res.json(result);
    } catch (error) {const express = require("express");
        const mongoose = require("mongoose");
        const cors = require("cors");
        const path = require("path");
        
        const app = express();
        const PORT = 3019;
        
        // Middleware
        app.use(cors());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        
        // ✅ Serve static files (HTML, CSS, JS)
        app.use(express.static(path.join(__dirname, "final_maybe")));
        
        // ✅ Connect to MongoDB
        mongoose.connect("mongodb://127.0.0.1:27017/roommatesDB", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(() => console.log("✅ MongoDB connected successfully"))
            .catch(err => console.error("❌ MongoDB connection failed:", err));
        
        // Define Mongoose Schema
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
        
        // Serve homepage
        app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, "roomateform.html"));
        });
        
        // API Route to handle form submission
        app.post("/submit", async (req, res) => {
            try {
                const { name, gender, hobby, course, food, bhk, type, note } = req.body;
                const newUser = new Roommate({ name, gender, hobby, course, food, bhk, type, note });
        
                await newUser.save();
                console.log("✅ User registered:", name);
                res.json({ message: "Registration successful" });
            } catch (error) {
                console.error("❌ Error registering user:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
        
        // API Route to get all roommates
        app.get("/roommates", async (req, res) => {
            try {
                const roommates = await Roommate.find(); // Fetch all roommates from MongoDB
                res.json(roommates);
            } catch (error) {
                console.error("❌ Error fetching roommates:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
        
        // API Route to edit roommate details
        app.patch('/roommates/:id', (req, res) => {
            const { id } = req.params;
            const updatedData = req.body;
        
            // Find and update the roommate
            Roommate.findByIdAndUpdate(id, updatedData, { new: true }, (err, updatedRoommate) => {
                if (err) {
                    return res.status(500).json({ error: "Error updating roommate" });
                }
                if (!updatedRoommate) {
                    return res.status(404).json({ error: "Roommate not found" });
                }
                res.status(200).json(updatedRoommate); // Respond with the updated roommate
            });
        });
         
        // Start Server
        app.listen(PORT, () => {
            console.log(`✅ Server is running on http://localhost:${PORT}`);
        });
        
        res.status(500).send({ message: "Error updating roommate", error });
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
