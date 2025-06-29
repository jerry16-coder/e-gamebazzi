const admin = require("firebase-admin");

// ✅ Authenticate Firebase Token
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid };
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// ✅ Check Admin Privileges
const checkAdmin = (req, res, next) => {
  const ADMIN_UID = "eCLftAFX3sQJji1gsMER0TxREEB2"; // Change if needed

  if (req.user?.uid !== ADMIN_UID) {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  next();
};

module.exports = {
  authenticate,
  checkAdmin,
};
