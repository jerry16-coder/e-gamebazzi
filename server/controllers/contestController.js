const Contest = require("../models/Contest");
const User = require("../models/User");

const createContest = async (req, res) => {
  try {
    const {
      title,
      game,
      entryFee,
      prizePool,
      maxPlayers,
      playerPool, // 🆕 array of players for the contest
    } = req.body;

    const contest = await Contest.create({
      title,
      game,
      entryFee,
      prizePool,
      maxPlayers,
      playerPool,
    });

    res.status(201).json(contest);
  } catch (error) {
    console.error("Create Contest Error:", error);
    res.status(500).json({ message: "Error creating contest" });
  }
};

const joinContest = async (req, res) => {
  const { contestId, team } = req.body;
  const userId = req.user.uid;

  try {
    const user = await User.findOne({ uid: userId });
    const contest = await Contest.findById(contestId);

    if (!user || !contest) return res.status(404).json({ message: "User or contest not found" });

    if (user.balance < contest.entryFee)
      return res.status(400).json({ message: "Insufficient balance" });

    if (contest.status !== "open")
      return res.status(400).json({ message: "Contest not open for joining" });

    if (team.length !== 4)
      return res.status(400).json({ message: "Exactly 4 players must be selected" });

    // Deduct entry fee
    user.balance -= contest.entryFee;
    await user.save();

    // Add user and team to contest
    contest.joinedUsers.push({
      userId: user._id,
      team, // array of 4 players
    });
    contest.currentPlayers += 1;
    await contest.save();

    res.status(200).json({ message: "Joined contest successfully", contest });
  } catch (error) {
    console.error("Join Contest Error:", error);
    res.status(500).json({ message: "Could not join contest" });
  }
};

module.exports = {
  createContest,
  joinContest,
};
