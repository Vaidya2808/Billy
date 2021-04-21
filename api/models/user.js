const mongoose= require('mongoose');

// In case of retailer and Wholesaler in name segment put name of shop
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  userType: {
    type: String,
    required: true,
  },
  userImage : {
    type : String
  }
  // location: {
  //   type: {
  //     type: String, // Don't do `{ location: { type: String } }`
  //     enum: ["Point"], // 'location.type' must be 'Point'
  //     required: true,
  //   },
  //   coordinates: {
  //     type: [Number],
  //     required: true,
  //   },
  // },
});

module.exports = mongoose.model('User', userSchema);