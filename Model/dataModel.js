const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema(
  {
    certiName: String,
    cipherData: String,
    createdAt: {
      type: Date
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user'
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('Data', dataSchema);
