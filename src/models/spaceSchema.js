const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  color: {
    type: String,
    required: [true, "color is required"],
  },
  owner: {
    type: String,
    required: [true, "owner is required"],
  },
});

module.exports = spaceSchema;
