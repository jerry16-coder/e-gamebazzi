const express = require("express");
const router = express.Router();
const admin = require("../config/firebase");
const User = require("../models/User");

// POST /api/auth/verify
router.post("/verify", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) return res.status(401).json({ error: "Token missing" });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decoded;

    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({ uid, email, wallet: 0 });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;
