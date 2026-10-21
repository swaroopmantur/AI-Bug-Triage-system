require("dotenv").config();
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bugRoutes = require("./routes/bugRoutes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/bugs", bugRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

app.get("/", (req, res) => {
    res.send("Bug Triage API is running");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});