const Contest = require("../models/Contest");
const Join = require("../models/Join");
const User = require("../models/User");
const PlayerPerformance = require("../models/PlayerPerformance");
const Contest = require("../models/Contest");

// 👨‍💻 Admin-only: Create contest
const createContest = async (req, res) => {
  try {
    const {
      title,
      gameType,
      matchTime,
      entryFee,
      prizePool,
      maxPlayers,
      minPlayersToStart,
    } = req.body;

    const contest = await Contest.create({
      title,
      gameType,
      matchTime,
      entryFee,
      prizePool,
      maxPlayers,
      minPlayersToStart,
      playersJoined: 0,
      createdBy: req.user.uid,
    });

    res.status(201).json(contest);
  } catch (error) {
    console.error("Create Contest Error:", error);
    res.status(500).json({ message: "Error creating contest" });
  }
};

// 🧑‍💻 User: Join contest
const joinContest = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { contestId } = req.body;

    // 1. Fetch the contest
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    // 2. Check if match entry is still open (before 5 mins)
    const now = new Date();
    const cutoff = new Date(new Date(contest.matchTime).getTime() - 5 * 60 * 1000);
    if (now > cutoff) {
      return res.status(400).json({ message: "Entry closed (5 min before match)" });
    }

    // 3. Check if user already joined
    const alreadyJoined = await Join.findOne({ userId, contestId });
    if (alreadyJoined) {
      return res.status(400).json({ message: "Already joined" });
    }

    // 4. Find user
    const user = await User.findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ VERY IMPORTANT: Check correct field name
    if (user.balance < contest.entryFee) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 5. Deduct balance and save
    user.balance -= contest.entryFee;
    await user.save();

    // 6. Save join record
    await Join.create({ userId, contestId });

    // 7. Update contest participants and count
    contest.playersJoined += 1;
    contest.participants.push({
      uid: userId,
      joinedAt: new Date(),
    });
    await contest.save();

    return res.status(200).json({ message: "Successfully joined contest" });
  } catch (error) {
    console.error("Join contest error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const processPendingContests = async (req, res) => {
  try {
    const now = new Date();
    const lockBuffer = new Date(now.getTime() + 6 * 60 * 1000); // 6 min buffer

    const contests = await Contest.find({
      status: "open",
      matchTime: { $lte: lockBuffer },
      isProcessed: false, // 👈 prevent double execution
    });

    if (contests.length === 0) {
      return res.status(200).json({ message: "No pending contests to process." });
    }

    for (const contest of contests) {
      console.log(`🔁 Processing Contest: ${contest.title} (${contest._id})`);

      if (contest.participants.length < contest.minPlayersToStart) {
        // Refund logic
        for (const participant of contest.participants) {
          const user = await User.findOne({ uid: participant.uid });
          if (user) {
            user.balance += contest.entryFee;
            await user.save();
          }
        }

        contest.status = "disbanded";
        contest.isDisbanded = true;
        contest.participants = [];
        contest.playersJoined = 0;
        console.log(`❌ Contest ${contest.title} disbanded. Refunds issued.`);
      } else {
        contest.status = "locked";
        console.log(`✅ Contest ${contest.title} locked.`);
      }

      contest.isProcessed = true;
      await contest.save();
    }

    return res.status(200).json({
      message: "Contests processed successfully",
      count: contests.length,
    });
  } catch (err) {
    console.error("Process Pending Contests Error:", err);
    return res.status(500).json({ message: "Error processing contests" });
  }
};

// 🧑‍💼 Admin uploads performance for all players after contest
const uploadPerformance = async (req, res) => {
  try {
    const { contestId, performances } = req.body;

    // Validate contest exists
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    // Optional: prevent duplicate upload
    const existing = await PlayerPerformance.findOne({ contestId });
    if (existing) {
      return res.status(400).json({ message: "Performance already uploaded" });
    }

    // Save each player's performance
    for (const perf of performances) {
      const { userId, stats } = perf;

      await PlayerPerformance.create({
        contestId,
        userId,
        stats, // this is a dynamic object like { kills: 3, assists: 2 }
      });
    }

    res.status(200).json({ message: "Performance uploaded successfully" });
  } catch (err) {
    console.error("Upload Performance Error:", err);
    res.status(500).json({ message: "Error uploading performance" });
  }
};




module.exports = {
  createContest,
  joinContest,
  processPendingContests,
  uploadPerformance,
};
