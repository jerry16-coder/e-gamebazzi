const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true, // Firebase UID
  },
  email: {
    type: String,
    required: true,
  },
  displayName: String,
  phoneNumber: String,
  photoURL: String,

  balance: {
    type: Number,
    default: 0,
  },
  winnings: {
    type: Number,
    default: 0,
  },
  kycVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
