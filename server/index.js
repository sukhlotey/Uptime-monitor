const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoute");
const checkRoutes = require("./routes/websiteCheckRouter");
const urls = require("./routes/urlsRoute");
const logger = require('./winston/logger');

const PORT = process.env.PORT || 5000;

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", checkRoutes);
app.use("/api", urls);


mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => logger.error(err));

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
