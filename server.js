require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const customerRoutes = require("./routes/customerRoutes");
const app = express();

app.use(cors());
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
});

app.use("/api/customers", customerRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
