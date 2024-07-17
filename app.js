if(process.env.NODE_ENV != 'production'){
  require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// Connect to MongoDB
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); 



// Using Sessions
const sessionOptions = {
  secret: "mySuperSecretCode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly: true, // only accessible via HTTP requests
  },
};


app.get("/", (req, res) => {
  res.send("Hi, I am root");
});


app.use(session(sessionOptions));
app.use(flash());



// Passport middleware to initialize and configure Passport
app.use(passport.initialize());

app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
  res.locals.success = req.flash("success");  
  res.locals.error = req.flash("error"); 
  res.locals.currentUser = req.user; // for logged-in users only
  next();
});


// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@example.com",
//     username: "delta-student",
//   });
//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// Middewares
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
})

app.use((err, req, res, next) => {
  let {statusCode=500, message="Something went Wrong!"} = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", {message});
})

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});