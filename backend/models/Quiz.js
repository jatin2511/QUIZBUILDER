const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  totalAttempts: { type: Number, default: 0 }
});

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  optionType: { 
    type: String, 
    enum: ['text', 'Image URL', 'Text&image'], 
    required: true
  },
  options: { type: [OptionSchema] },
  correctOption: {
    type: Number,
    min: 0,
    default: undefined 
  },
  timer: { 
    type: Number, 
    enum: [0, 5, 10], 
    default: 0 
  },
  stats: {
    totalAttempts: { type: Number, default: 0 },
    correctAttempts: { type: Number, default: 0 },
    incorrectAttempts: { type: Number, default: 0 }
  }
});



const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: { type: [QuestionSchema], required: true },
  type: { type: String, enum: ['Poll', 'Q&A'], required: true },
  impressions: { type: Number, default: 0 },
  totalAttempts: { type: Number, default: 0 },
  totalCompleteAttempts: { type: Number, default: 0 },
  totalIncompleteAttempts: { type: Number, default: 0 },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
