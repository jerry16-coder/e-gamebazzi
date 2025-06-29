const Team = require("../models/teamModel");

// 🟢 Create team with players for a specific contest
exports.createTeam = async (req, res) => {
  try {
    const { contestId, teamName, players } = req.body;

    if (!contestId || !teamName || !players || players.length === 0) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newTeam = new Team({
      contestId,
      teamName,
      players,
    });

    await newTeam.save();
    return res.status(201).json({ message: "Team created successfully", team: newTeam });
  } catch (error) {
    console.error("Error creating team:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// 🟡 Get all teams by contest
exports.getTeamsByContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const teams = await Team.find({ contestId });

    return res.status(200).json({ teams });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
