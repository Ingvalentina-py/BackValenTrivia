const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'questions' // Referencia al modelo 'Question'
  }]
  
});

module.exports = mongoose.model('user', userSchema);
