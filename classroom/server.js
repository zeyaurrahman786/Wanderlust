const express = require('express');
const app = express();
const users = require('./routes/user.js');
const posts = require('./routes/post.js');
const cookieParser = require('cookie-parser');


app.use(cookieParser("secretcode"));

app.get("/getsignedcookie", (req, res) => {
    res.cookie("made-in", "India", {signed: true});
    res.send("Signed cookie set successfully!");
});

app.get("/verify", (req, res) => {
    console.log(req.signedCookies);
    res.send("Cookie verified successfully!");
});

app.get("/getcookies", (req, res) => {
    res.cookie("Great", "Namaste");
    res.cookie("Made In", "India");
    res.send("Cookies set successfully!");
});

app.get("/greet", (req, res) => {
    let {name = "anonymus"} = req.cookies;
    res.send(`Hello, ${name}`);
})

app.get("/", (req, res) => {
    console.log(req.cookies);
    res.send("Hi, I am root!");
})

app.use("/users", users);
app.use("/posts", posts);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})