const express = require('express');
const app = express();
const users = require('./routes/user.js');
const posts = require('./routes/post.js');
// const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret: 'mySuperSecretString',
    resave: false,
    saveUninitialized: true,
};





// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie", (req, res) => {
//     res.cookie("made-in", "India", {signed: true});
//     res.send("Signed cookie set successfully!");
// });

// app.get("/verify", (req, res) => {
//     console.log(req.signedCookies);
//     res.send("Cookie verified successfully!");
// });

// app.get("/getcookies", (req, res) => {
//     res.cookie("Great", "Namaste");
//     res.cookie("Made In", "India");
//     res.send("Cookies set successfully!");
// });

// app.get("/greet", (req, res) => {
//     let {name = "anonymus"} = req.cookies;
//     res.send(`Hello, ${name}`);
// })

// app.get("/", (req, res) => {
//     console.log(req.cookies);
//     res.send("Hi, I am root!");
// })

// app.use("/users", users);
// app.use("/posts", posts);












// Express Sessions
// app.use(session ( {secret: "mySuperSecretString", resave: false, saveUninitialized: true} ));

// app.get("/test", (req, res) => {
//     // req.session.name = "John Doe";
//     res.send("Session test Successfully!");
// });

// app.get("/reqCount", (req, res) => {
//     if(req.session.count) {
//         req.session.count++;
//     }
//     else {
//         req.session.count = 1;
//     }
//      res.send(`You sent a request ${req.session.count} times`);
// });



app.use(session(sessionOptions));
app.use(flash());


app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.get("/register", (req, res) => {
    let {name = "Anonymous"} = req.query;
    req.session.name = name;
    if(name === "Anonymous"){
        req.flash("error", "User not registered!");
    }
    else{
        req.flash("success", "User registered successfully!");
    }
    res.redirect("/hello");
}); 
 
app.get("/hello", (req, res) => {
    res.render("page.ejs", {name: req.session.name});
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})