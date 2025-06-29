const mongoose = require('mongoose');

const userTeamSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    required: true
  },
  selectedPlayers: [
    {
      playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamPlayer',
        required: true
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('UserTeam', userTeamSchema);
