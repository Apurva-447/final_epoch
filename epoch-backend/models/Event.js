const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
  type: String,
  required: true,
},

    description: {
      type: String,
      required: true,
    },
    organiser: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  
},

    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
