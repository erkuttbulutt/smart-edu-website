const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const pageRoute = require("./routes/pageRoute.js");
const courseRoute = require("./routes/courseRoute.js");
const categoryRoute = require("./routes/categoryRoute.js");
const userRoute = require("./routes/userRoute.js");
require("dotenv").config();

const app = express();
mongoose.connect(process.env.MONGO_DB).then(() => {
  console.log("MongoDB connected");
});

// Template Engine
app.set("view engine", "ejs");

// Global Varaible For Session
global.userIN = null;

// Middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//* MongoStore : Kod değişikliğinde veya sayfa yenilenmesinde tekrar login gerekmemesi için.
app.use(
  session({
    secret: "my_keyboard_cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB,
    }),
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);
app.use("*", (req, res, next) => {
  userIN = req.session.userID;
  next();
});

// Routes
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);
app.use("/users", userRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
