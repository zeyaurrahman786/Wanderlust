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
    type: Object,
    default:
      "https://a0.muscache.com/im/pictures/miso/Hosting-912305060013575560/original/eb4120bb-e281-41eb-bef5-7dac96eb90f2.jpeg?im_w=1200",
    set: (v) =>
      v === ""
        ? "https://a0.muscache.com/im/pictures/miso/Hosting-912305060013575560/original/eb4120bb-e281-41eb-bef5-7dac96eb90f2.jpeg?im_w=1200"
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
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Delete Middleware For Reviews
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;