const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('E-GameBazzi Backend is Running 🏁');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ✅ Firebase Auth Middleware
const verifyFirebaseToken = require("./middleware/firebaseAuth");
app.get("/api/secure", verifyFirebaseToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, you're verified!` });
});

// ✅ Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const contestRoutes = require("./routes/contestRoutes");
app.use("/api/contest", contestRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const teamRoutes = require("./routes/teamRoutes");
app.use("/api/teams", teamRoutes);

const userTeamRoutes = require('./routes/userTeamRoutes');
app.use('/api/user-team', userTeamRoutes);
