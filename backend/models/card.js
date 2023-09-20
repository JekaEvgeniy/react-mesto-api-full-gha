const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (link) => validator.isURL(link),
      message: 'Неверный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      default: [],
    }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });
module.exports = mongoose.model('card', cardSchema);
