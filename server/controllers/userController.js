const User = require("../models/User");

const createOrGetUser = async (req, res) => {
  const { uid, email, displayName, phoneNumber, photoURL } = req.user;

  try {
    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({
        uid,
        email,
        displayName,
        phoneNumber,
        photoURL,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("User creation/fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrGetUser,
};
