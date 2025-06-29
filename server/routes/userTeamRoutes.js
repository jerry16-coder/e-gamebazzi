const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const { selectTeam, getUserTeam } = require('../controllers/userTeamController');

router.post('/select', authenticateUser, selectTeam);         // Select players
router.get('/:contestId', authenticateUser, getUserTeam);     // Get selected team for a contest

module.exports = router;
