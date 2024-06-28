const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");


 
// Databse Connection Setup :-)
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log(err);
});

async function main () {
    await mongoose.connect(MONGO_URL);
}


// Set up EJS :-)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));


app.get("/", (req, res) => {
    res.send("Hii, I am a root");
});


// app.get("/listings", (req, res) => {
//     Listing.find({}).then((res) => {
//         console.log(res);
//     });
// });


// Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});


// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


// Show Route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});


// Create Route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});


// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});


// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing ({
//         title: "My New Villa",
//         description: "By the Beach",
//         price: 1200,
//         location: "Calanguta, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was Saved");
//     res.send("Successful Testing")
// });


app.listen(8080, () => {
    console.log("Server is listening to port 8080");
})