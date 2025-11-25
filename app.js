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

mongoose
  .connect(
    "mongodb+srv://admin_db:Welcome%402468@cluster0.6jgdplr.mongodb.net/E_T",
    {
      tls: true,
    }
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/html", "login.html"));
});

const tripSchema = new mongoose.Schema({
  tripname: { type: String, required: true },
  tripDate: { type: String, required: true },
  tripStatus: { type: String, required: true },
});
const userSchema = new mongoose.Schema({
  guestname: { type: String, required: true },
  flatNumber: { type: String, required: true },
  adults: { type: Number, required: true },
  kids: { type: Number, required: true },
  veg: { type: Number, required: true },
  nonVeg: { type: Number, required: true },
  trip_id: { type: String, required: true },
  financier: { type: Boolean, required: false },
});

const expenseSchema = new mongoose.Schema({
  guest_Id: { type: String, required: true },
  guestname: { type: String, required: true },
  flatNumber: { type: String, required: true },
  trip_id: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: false },
  split_food: { type: String, required: false },
  veg: { type: Number, required: false },
  nveg: { type: Number, required: false },
  split_share: { type: String, required: false },
});

const trip = mongoose.model("Trip", tripSchema);
const user = mongoose.model("persons", userSchema);
const exp = mongoose.model("expense", expenseSchema);

// Trips
app.post("/addtrip", async (req, res) => {
  try {
    const { tripname, tripDate, tripStatus } = req.body;
    const newTrip = new trip({
      tripname,
      tripDate,
      tripStatus,
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

app.delete("/api/trip/:id", async (req, res) => {
  console.log(req);
  try {
    const trip_id = req.params.id;
    const records = await trip.deleteMany({ _id: trip_id });
    res.status(200).json({ message: `${records.deletedCount} trip deleted` });
    console.log(records);
  } catch (err) {
    console.error("Error deleting trip records:", err);
    res.status(500).json({ error: "Failed to delete trip" });
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

//Expense
app.post("/addexpense", async (req, res) => {
  try {
    const {
      guest_Id,
      guestname,
      flatNumber,
      trip_id,
      category,
      amount,
      date,
      split_food,
      veg,
      nveg,
      split_share,
    } = req.body;
    console.log("req==========>", req);
    const numamount = Number(amount);
    const newExp = new exp({
      guest_Id,
      guestname,
      flatNumber,
      trip_id,
      category,
      amount: numamount,
      date,
      split_food,
      veg,
      nveg,
      split_share,
    });
    await newExp.save();
    return res.status(201).json({
      success: true,
      message: "Expense created successfully!",
    });
  } catch (err) {
    console.error("Error occurred while creating Expenses:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred during Expense addition.",
    });
  }
});

app.get("/api/getexpenses/:id", async (req, res) => {
  try {
    const trip_id = req.params.id;
    const exp_records = await exp.find({ trip_id }).lean();
    res.json(exp_records);
  } catch (err) {
    console.error("Error fetching expense records:", err);
    res.status(500).json({ error: "Failed to fetch expense records" });
  }
});

app.patch("/api/updateexpense/:id", async (req, res) => {
  try {
    console.log("request = ", req.body);
    const id = req.params.id;
    const {
      guest_Id,
      guestname,
      flatNumber,
      trip_id,
      category,
      amount,
      date,
      split_food,
      veg,
      nveg,
      split_share,
    } = req.body;

    const updateData = {
      guest_Id,
      guestname,
      flatNumber,
      trip_id,
      category,
      amount,
      date,
      split_food,
      veg,
      nveg,
      split_share,
    };

    console.log("updateData = ", updateData);
    const updatedExp = await exp.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedExp) {
      return res.status(404).json({ error: "Expense not found" });
    }

    console.log("updatedExp = ", updatedExp);

    res.status(200).json({ message: "Expense updated", success: true });
  } catch (err) {
    console.error("Error updating Expense:", err);
    res.status(500).json({ error: "Failed to update Expense" });
  }
});

app.delete("/api/deleteExp/:id", async (req, res) => {
  console.log(req);
  try {
    const id = req.params.id;
    const records = await exp.deleteOne({ _id: id });
    res.status(200).json({ success: true });
    console.log(records);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete the exp details" });
  }
});

//Guest
app.post("/addguest", async (req, res) => {
  try {
    console.log("Guest request = ", req.body);
    const {
      guestname,
      flatNumber,
      adults,
      kids,
      noofVeg,
      noofNonVeg,
      trip_id,
      financier,
    } = req.body;
    const numAdults = parseInt(adults) || 0;
    const numKids = parseInt(kids) || 0;
    const numVeg = parseInt(noofVeg) || 0;
    const numNonVeg = parseInt(noofNonVeg) || 0;
    const fn = flatNumber;
    const existingUser = await user.findOne({
      flatNumber: fn,
      trip_id: trip_id,
    });
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
      financier: req.body.financier,
    });
    console.log("newUser = ", newUser);
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

app.delete("/api/guest/:id", async (req, res) => {
  console.log(req);
  try {
    const trip_id = req.params.id;
    const records = await user.deleteMany({ trip_id: trip_id });
    res.status(200).json({ message: `${records.deletedCount} guests deleted` });
    console.log(records);
  } catch (err) {
    console.error("Error fetching guest records:", err);
    res.status(500).json({ error: "Failed to fetch guest details" });
  }
});

app.delete("/api/guests/:id", async (req, res) => {
  console.log(req);
  try {
    const id = req.params.id;
    const records = await user.deleteOne({ _id: id });
    res.status(200).json({ message: `${records.deletedCount} guest deleted` });
    console.log(records);
  } catch (err) {
    console.error("Error fetching guest records:", err);
    res.status(500).json({ error: "Failed to fetch guest details" });
  }
});

app.patch("/api/updateguests/:id", async (req, res) => {
  try {
    console.log("Guest request update = ", req.body);
    const id = req.params.id;
    const {
      guestname,
      flatNumber,
      adults,
      kids,
      noofVeg,
      noofNonVeg,
      trip_id,
      financier,
    } = req.body;

    const updateData = {
      guestname,
      flatNumber,
      adults: parseInt(adults) || 0,
      kids: parseInt(kids) || 0,
      veg: parseInt(noofVeg) || 0,
      nonVeg: parseInt(noofNonVeg) || 0,
      trip_id,
      financier: req.body.financier,
    };
    console.log("updateData = ", updateData);
    const updatedGuest = await user.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedGuest) {
      return res.status(404).json({ error: "Guest not found" });
    }

    res.status(200).json({ message: "Guest updated", guest: updatedGuest });
  } catch (err) {
    console.error("Error updating guest:", err);
    res.status(500).json({ error: "Failed to update guest" });
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
