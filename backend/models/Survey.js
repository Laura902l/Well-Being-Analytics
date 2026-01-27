const mongoose = require('mongoose');
const SurveySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    surveyId: { type: String, enum: ['burnout', 'stress', 'work-life'], required: true },
    data: { type: Object, required: true }
  },
  { timestamps: true }
);

SurveySchema.index({ userId: 1, surveyId: 1 }, { unique: true });

module.exports = mongoose.model('Survey', SurveySchema);
