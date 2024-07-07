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
      "https://a0.muscache.com/im/pictures/miso/Hosting-49786285/original/49917cc0-336a-478c-9b3b-06f498c702a8.jpeg?im_w=960",
    set: (v) =>
      v === ""
        ? "https://a0.muscache.com/im/pictures/miso/Hosting-49786285/original/49917cc0-336a-478c-9b3b-06f498c702a8.jpeg?im_w=960"
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
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;