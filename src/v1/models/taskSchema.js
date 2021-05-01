const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  value: {
    type: String,
    required: [true, "value is required"],
  },
  category: {
    type: String,
    required: [true, "a category is required"],
  },
  isDone: {
    type: Boolean,
    required: [true, "isDone is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  deadLine: {
    type: Date,
    default: Date.now(),
  },
  owner: {
    type: String,
    required: [true, "owner is required"],
  },
});

module.exports = taskSchema;
