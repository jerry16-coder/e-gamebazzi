const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    contestId: { type: mongoose.Schema.Types.ObjectId, ref: "Contest", required: true },
    teamName: { type: String, required: true },
    players: [
      {
        playerName: { type: String, required: true },
        playerImage: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
