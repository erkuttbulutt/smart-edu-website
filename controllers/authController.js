const Category = require("../models/Category.js");
const Course = require("../models/Course.js");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).redirect("/login");
  } catch (error) {
    res.status(400).json({ status: "error create user", error: error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, same) => {
        if (same) {
          // User Session
          req.session.userID = user._id;
          res.status(200).redirect("/users/dashboard");
        }
      });
    }
  } catch (error) {
    res.status(400).json({ status: "error login user", error: error });
  }
};

exports.logoutUser = (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  } catch (error) {
    res.status(400).json({ status: "error logout user", error: error });
  }
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID }).populate(
    "courses"
  );
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session.userID }).sort(
    "-createdAt"
  );
  const users = await User.find();
  res
    .status(200)
    .render("dashboard", {
      page_name: "dashboard",
      user,
      categories,
      courses,
      users,
    });
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id)
    await Course.deleteMany({user:req.params.id})
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({ status: "error deleteUser", error });
  }
};
