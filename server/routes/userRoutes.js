const express = require("express");
const router = express.Router();
const { createOrGetUser } = require("../controllers/userController");
const verifyFirebaseToken = require("../middleware/firebaseAuth");

router.post("/createOrGet", verifyFirebaseToken, createOrGetUser);

module.exports = router;
