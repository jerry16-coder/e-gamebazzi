const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

// POST: Admin creates a team for a contest
router.post("/create", teamController.createTeam);

// GET: Fetch all teams by contest ID
router.get("/contest/:contestId", teamController.getTeamsByContest);

module.exports = router;
