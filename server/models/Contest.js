const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    gameType: {
      type: String,
      required: true,
      enum: ["BGMI", "COD", "Free Fire", "Valorant", "Other"],
    },
    matchTime: {
      type: Date,
      required: true,
    },
    entryFee: {
      type: Number,
      required: true,
    },
    minPlayersToStart: {
      type: Number,
      required: true,
    },
    maxPlayers: {
      type: Number,
      required: true,
    },
    participants: [
      {
        uid: { type: String, required: true },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    playersJoined: {
  type: Number,
  default: 0,
},
    prizePool: {
      type: Number,
      default: 0,
    },
    isDisbanded: {
      type: Boolean,
      default: false,
    },
    isPrizeApproved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["open", "locked", "disbanded", "completed"],
      default: "open",
    },
    winnerBreakdown: [
      {
        uid: String,
        rank: Number,
        prize: Number,
      },
    ],
    createdBy: {
      type: String,
      required: true, // admin UID
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contest", contestSchema);
