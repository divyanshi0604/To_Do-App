const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, default: "Low" },
  dueDate: { type: Date }   // <-- Add this
});

module.exports = mongoose.model("Task", TaskSchema);
