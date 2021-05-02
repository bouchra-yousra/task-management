const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  space: {
    type: String,
    required: [true, "space is required"],
  },
  owner: {
    type: String,
    required: [true, "owner is required"],
  },
});

module.exports = categorySchema;
