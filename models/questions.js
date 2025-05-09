const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
    unique: true,
  },

  questionText: {
    type: String,
    required: true,
  },
  questionIsTrue: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("questions", questionSchema);
