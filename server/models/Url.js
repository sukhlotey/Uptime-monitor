const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  statusCode: {
    type: Number,
    required: true,
  },
  responseTime: {
    type: Number,
    required: true,
  },
  currentStatus: {
    type: String,
    required: true,
  },
  checkedAt: {
    type: Date,
    default: Date.now,
  },
  schedule: { 
    type: String, 
    required: true, 
    default: "*/5 * * * *" }, 
});

module.exports = mongoose.model("Url", urlSchema);
