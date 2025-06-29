const UserTeam = require('../models/UserTeam');
const TeamPlayer = require('../models/TeamPlayer');
const Contest = require('../models/Contest');

exports.selectTeam = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { contestId, playerIds } = req.body;

    const contest = await Contest.findById(contestId);
    if (!contest) return res.status(404).json({ message: 'Contest not found' });

    // Validate max players by game type
    let maxPlayersAllowed = 4; // Default for BGMI
    if (contest.gameType === 'COD' || contest.gameType === 'Valorant') {
      maxPlayersAllowed = 5;
    }

    if (playerIds.length !== maxPlayersAllowed) {
      return res.status(400).json({ message: `You must select exactly ${maxPlayersAllowed} players.` });
    }

    const validPlayers = await TeamPlayer.find({ _id: { $in: playerIds }, contestId });
    if (validPlayers.length !== playerIds.length) {
      return res.status(400).json({ message: 'Some selected players are invalid for this contest.' });
    }

    const existingTeam = await UserTeam.findOne({ userId, contestId });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team already selected for this contest.' });
    }

    const newTeam = new UserTeam({
      userId,
      contestId,
      selectedPlayers: playerIds.map(id => ({ playerId: id }))
    });

    await newTeam.save();
    res.status(200).json({ message: 'Team selected successfully', team: newTeam });
  } catch (err) {
    console.error('Team selection error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserTeam = async (req, res) => {
  try {
    const userId = req.user.uid;
    const contestId = req.params.contestId;

    const team = await UserTeam.findOne({ userId, contestId }).populate('selectedPlayers.playerId');
    if (!team) return res.status(404).json({ message: 'No team selected for this contest' });

    res.status(200).json({ team });
  } catch (err) {
    console.error('Get team error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
