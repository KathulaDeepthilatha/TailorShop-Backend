require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const customerRoutes = require("./routes/customerRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors({ 
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
   allowedHeaders: ['Content-Type'] }));
app.use(bodyParser.json());

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("Error: MONGO_URI is not defined in the environment variables.");
  process.exit(1); // Exit the application if MONGO_URI is missing
}

mongoose.connect(mongoURI).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

app.use("/api/customers", customerRoutes);
app.use("/api/users", userRoutes); // Correctly using userRoutes

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



