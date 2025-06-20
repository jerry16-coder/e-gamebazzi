const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema({
  title: String,
  game: String,
  entryFee: Number,
  prizePool: Number,
  maxPlayers: Number,
  currentPlayers: {
    type: Number,
    default: 0,
  },
  // 🆕 This is the new field that allows admin to set player list
  playerPool: [
    {
      name: String,
      team: String,
      role: String,
      credit: Number,
    }
  ],
  joinedUsers: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      team: Array,
    },
  ],
  status: {
    type: String,
    default: "open",
  },
}, { timestamps: true });

module.exports = mongoose.model("Contest", contestSchema);
