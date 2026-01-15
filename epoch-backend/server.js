const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("EPOCH Event Management API running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads", { path: path.join(__dirname, "uploads") }));



app.use("/api/bookings", require("./routes/bookingRoutes"));

app.use("/api/events", eventRoutes);


