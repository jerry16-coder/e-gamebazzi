const express = require("express");
const router = express.Router();
const { createContest, joinContest } = require("../controllers/contestController");
const verifyFirebaseToken = require("../middleware/firebaseAuth");

// Only Admin will use this
router.post("/create", createContest);

// User joins contest
router.post("/join", verifyFirebaseToken, joinContest);

module.exports = router;
