const mongoose = require("mongoose");
const spaceSchema = require("../models/spaceSchema");
const Space = mongoose.model("Space", spaceSchema, "Space");

async function createSpace(data) {
  const { title, color, owner } = data;

  return new Space({
    title,
    color,
    owner,
    createdAt: Date.now(),
  }).save();
}

async function updateSpace(id, data) {
  return await Space.findByIdAndUpdate(id, data, {
    useFindAndModify: false,
  });
}

async function deleteSpace(id) {
  return await Space.findByIdAndDelete(id);
}

async function findSpace(id, owner) {
  return await Space.findOne({
    _id: id,
    owner,
  });
}

async function getSpaces(owner) {
  return await Space.find({ owner }).sort({ createdAt: -1 }).exec();
}

exports.create = createSpace;
exports.update = updateSpace;
exports.delete = deleteSpace;
exports.get = getSpaces;
exports.find = findSpace;
