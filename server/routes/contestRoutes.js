const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { uploadPerformance } = require("../controllers/contestController");
const { authenticate, checkAdmin } = require("../middleware/authMiddleware");


const { createContest, joinContest , processPendingContests } = require("../controllers/contestController");

// TEMP: Replace this with a proper admin system later
const ADMIN_UID = "eCLftAFX3sQJji1gsMER0TxREEB2"; // Your secondary Gmail UID

// ✅ Admin: Create Contest
router.post("/create", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;

    if (uid !== ADMIN_UID) {
      return res.status(403).json({ message: "Only admin can create contests." });
    }

    // Forward request to controller
    req.body.createdBy = uid; // (optional) if you want to store creator
    return await createContest(req, res);
  } catch (err) {
    console.error("Contest creation error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// ✅ User: Join Contest
router.post("/join", verifyToken, joinContest);

// ✅ Process pending contests (admin only, protected)
router.post("/process-pending", processPendingContests);

// Admin uploads match result
router.post("/admin/upload-performance", authenticate, checkAdmin, uploadPerformance);


module.exports = router;
