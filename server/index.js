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

const verifyFirebaseToken = require("./middleware/firebaseAuth");

app.get("/api/secure", verifyFirebaseToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, you're verified!` });
});

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);
const contestRoutes = require("./routes/contestRoutes");
app.use("/api/contest", contestRoutes);
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
