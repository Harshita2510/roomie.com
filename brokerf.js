//config express
const express = require("express")
const app=express() //to access express 
const port = 3000;
const path=require("path")
 require("./brokerconn.js")
 const mongoose = require("mongoose");

 //app.use(express.static(path.join(__dirname, "broker.html")))
 app.use(express.static(__dirname)); //to load css and javascript of frontend

// Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "brokerlogin.html"));
});




//schema
const brokerSchema = new mongoose.Schema({
    fullname: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    BrokerLicense:{ type: String, required: true },
    properttype:{ type: String, required: true },
    location: { type: String, required: true }
});

const Register = mongoose.model("brokerregistration", brokerSchema);
module.exports=Register




//registration rout
app.post("/brokerx",async(req,res)=>{ //formwala
try{
    console.log("Received data:", req.body); 
   // const { fullname,
     //   password,   email, 
       // mobile,   BrokerLicense,  properttype,  location } = req.body;
        const fullname=req.body.fullname;
        const password=req.body.password;
        const email=req.body.email;
        const mobile=req.body.mobile;
        const BrokerLicense=req.body.BrokerLicense;
        const properttype=req.body.properttype;
        const location=req.body.location;
      
        

        const newUser = new Register({ fullname,
            password,   email, 
            mobile,   BrokerLicense,  properttype,  location, });
            await newUser.save();
            res.status(201).json({ message: "User saved successfully" });
     }
    
catch(error){
res.status(400).send(error)
}
})



//login route
//const router = express.Router();

// Login Route (Checks Across Student, Broker, and Mess Owner Databases)
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Search in Student Database
        let user = await User.findOne({ username });
        if (user) {
            if (password === user.password) {
                return res.status(200).json({ message: "Student login successful", role: "student" });
            } else {
                return res.status(401).json({ error: "Invalid password" });
            }
        }

        // Search in Broker Database
        user = await Register.findOne({ fullname: username });  // Broker uses `fullname`
        if (user) {
            if (password === user.password) {
                return res.status(200).json({ message: "Broker login successful", role: "broker" });
            } else {
                return res.status(401).json({ error: "Invalid password" });
            }
        }

        // Search in Mess Owner Database
        /*user = await Mess.findOne({ username });  // Assuming Mess model exists
        if (user) {
            if (password === user.password) {
                return res.status(200).json({ message: "Mess Owner login successful", role: "mess-owner" });
            } else {
                return res.status(401).json({ error: "Invalid password" });
            }
        }
*/
        // If no user found in any collection
        return res.status(404).json({ error: "User not found" });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

//module.exports = router;


app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
