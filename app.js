const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const path = require("path");
const cors = require("cors");
const { type } = require("os");
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://admin_db:Welcome%402468@cluster0.6jgdplr.mongodb.net/E_T", {
  tls: true,
}).then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/html", "login.html"));
});

const tripSchema = new mongoose.Schema({
  tripname: { type: String, required: true },
  tripDate: { type: String, required: true },
  tripStatus: { type: String, required: true }
});
const userSchema = new mongoose.Schema({
  guestname: { type: String, required: true },
  flatNumber: { type: String, required: true },
  adults: { type: Number, required: true },
  kids: { type: Number, required: true },  
  veg:{ type: Number, required: true },
  nonVeg: { type: Number, required: true },
  trip_id: { type: String, required: true },
});

const trip = mongoose.model("Trip", tripSchema);
const user = mongoose.model("persons", userSchema);

app.post("/addtrip", async (req, res) => {
  try {
    const { tripname, tripDate, tripStatus } = req.body;
    const newTrip = new trip({
      tripname,
      tripDate,
      tripStatus
    });

    console.log("newTrip = ", newTrip);

    await newTrip.save();
    return res.status(201).json({
      success: true,
      message: "Trip created successfully!",
    });
  } catch (err) {
    console.error("Error occurred while adding Trip:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred during Trip addition.",
    });
  }
});

app.get("/api/trips", async (req, res) => {
  try {
    const trips = await trip.find().sort({ tripStatus: 1 }).lean();
    res.json(trips);
  } catch (err) {
    console.error("Error fetching trips:", err);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

app.post("/addguest", async (req, res) => {
  try {
    console.log("Guest request = ", req.body);
    const { guestname, flatNumber, adults, kids, noofVeg, noofNonVeg, trip_id } = req.body;
    const numAdults = parseInt(adults) || 0;
    const numKids = parseInt(kids) || 0;
    const numVeg = parseInt(noofVeg) || 0;
    const numNonVeg = parseInt(noofNonVeg) || 0;
    const fn = flatNumber;
    const existingUser = await user.findOne({ flatNumber: fn, trip_id: trip_id });
    console.log("existingUser = ", existingUser);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "flatNumber already exists.",
      });
    }
    const newUser = new user({
      guestname,
      flatNumber,
      adults: numAdults,
      kids: numKids,
      veg: numVeg,
      nonVeg: numNonVeg,
      trip_id,
    });
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User created successfully!",
    });
  } catch (err) {
    console.error("Error occurred while adding Guest:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred during Guest addition.",
    });
  }
});

app.get("/api/guest/:id", async (req, res) => {
    try {
    const trip_id = req.params.id;
    const records = await user.find({ trip_id }).lean();
    res.json(records);
  } catch (err) {
    console.error("Error fetching guest records:", err);
    res.status(500).json({ error: "Failed to fetch guest details" });
  }

});

app.delete("/api/guest/:id", async (req,res) => {
  console.log(req);
  try{
    const trip_id = req.params.id;
    const records = await user.deleteMany({ trip_id: trip_id });
    res.status(200).json({ message: `${records.deletedCount} guests deleted` });
    console.log(records);
  } catch (err) {
    console.error("Error fetching guest records:", err);
    res.status(500).json({ error: "Failed to fetch guest details" });
  }
});

app.delete("/api/trip/:id", async (req,res) => {
  console.log(req);
  try{
    const trip_id = req.params.id;
    const records = await trip.deleteMany({ _id: trip_id });
    res.status(200).json({ message: `${records.deletedCount} trip deleted` });
    console.log(records);
  } catch (err) {
    console.error("Error deleting trip records:", err);
    res.status(500).json({ error: "Failed to delete trip" });
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});