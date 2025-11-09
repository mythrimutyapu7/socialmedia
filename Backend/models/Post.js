const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []   // ✅ ensures it's always an array
  },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
})



module.exports = mongoose.model('Post', postSchema)
