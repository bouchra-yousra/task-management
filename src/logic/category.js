const mongoose = require("mongoose");
const categorySchema = require("../models/categorySchema");
const Category = mongoose.model("category", categorySchema, "category");

async function createCategory(data) {
  const { title, space, owner } = data;

  return new Category({
    title,
    space,
    owner,
    createdAt: Date.now(),
  }).save();
}

async function updateCategory(id, data) {
  return await Category.findByIdAndUpdate(id, data, {
    useFindAndModify: false,
  });
}

async function deleteCategory(id) {
  return await Category.findByIdAndDelete(id);
}

async function findCategory(id, owner) {
  return await Category.findOne({
    _id: id,
    owner,
  });
}

async function getCategorys(space, owner) {
  return await Category.find({ space, owner }).sort({ createdAt: -1 }).exec();
}

exports.create = createCategory;
exports.update = updateCategory;
exports.delete = deleteCategory;
exports.get = getCategorys;
exports.find = findCategory;
