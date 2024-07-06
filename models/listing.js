const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  listingImage: {
    type: String,
    default:
      "https://a0.muscache.com/im/pictures/miso/Hosting-1099611762079108733/original/4b4a9228-38a6-46fe-bb77-73e6b8af8252.png?im_w=960",
    set: (v) =>
      v === ""
        ? "https://a0.muscache.com/im/pictures/miso/Hosting-1099611762079108733/original/4b4a9228-38a6-46fe-bb77-73e6b8af8252.png?im_w=960"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});


// Delete Middleware For Reviews
listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing){
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;