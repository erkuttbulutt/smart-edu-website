const User = require("../models/User.js");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userID);
    if (!user) {
      return res.redirect("/login");
    }
    next();
  } catch (error) {
    console.log("Error authMiddleware", error);
  }
};
