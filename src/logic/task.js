const mongoose = require("mongoose");
const taskSchema = require("../models/taskSchema");
const Task = mongoose.model("Task", taskSchema, "Tasks");

async function createTask(data) {
  const { value, category, deadLine, owner } = data;

  return new Task({
    value,
    category,
    deadLine,
    isDone: false,
    createdAt: Date.now(),
    owner,
  }).save();
}

async function updateTask(id, data) {
  return await Task.findByIdAndUpdate(id, data, {
    useFindAndModify: false,
  });
}

async function deleteTask(id) {
  return await Task.findByIdAndDelete(id);
}

async function findTask(id, owner) {
  return await Task.findOne({
    _id: id,
    owner,
  });
}

async function getTasks(category, owner) {
  return await Task.find({ category, owner }).sort({ createdAt: -1 }).exec();
}

exports.create = createTask;
exports.update = updateTask;
exports.delete = deleteTask;
exports.get = getTasks;
exports.find = findTask;
