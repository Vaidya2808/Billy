const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({
  text: { type: String },
  customerName: { type: String },
  _id: mongoose.Schema.Types.ObjectId,
  shopName: { type: String },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
