const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema({
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest",
    required: true,
  },
  userId: {
    type: String, // Firebase UID
    required: true,
  },
  stats: {
    type: Map,
    of: Number,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PlayerPerformance", performanceSchema);
