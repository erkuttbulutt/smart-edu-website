//* Kullanıcı giriş yapmışsa login ve register urllerine ulaşamaması için middleware.
module.exports = async (req, res, next) => {
  if (req.session.userID) {
    return res.redirect("/");
  }
  next();
};
