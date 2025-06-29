const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  team: {
    type: [
      {
        playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
        playerName: String,
        playerImage: String,
      },
    ],
    default: [],
  },
  joinedAt: { type: Date, default: Date.now },
});

const contestSchema = new mongoose.Schema(
  {
    title: String,
    gameType: {
      type: String,
      enum: ["BGMI", "COD", "Valorant"],
      required: true,
    },
    matchTime: Date,
    entryFee: Number,
    maxPlayers: Number,
    minPlayersToStart: Number,
    prizePool: Number,
    status: { type: String, default: "open" },
    isDisbanded: { type: Boolean, default: false },
    isPrizeApproved: { type: Boolean, default: false },
    createdBy: String,
    participants: [participantSchema],
    playersJoined: { type: Number, default: 0 },
    winnerBreakdown: {
      type: [Object],
      default: [],
    },

    // 🆕 New Configurations
    maxSelectablePlayers: { type: Number, default: 4 }, // e.g. 4 for BGMI, 5 for COD
    teamCount: { type: Number, default: 16 }, // For display / logic
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contest", contestSchema);
