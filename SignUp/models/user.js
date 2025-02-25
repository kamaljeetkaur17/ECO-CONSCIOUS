const mongoose = require("mongoose");

//defines the structure of the user document in the MongoDB database
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, //to prevent duplicate  entires
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, //to prevent duplicate  entires
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt timestamps

// Define a static method to get user profile by email
userSchema.statics.getUserProfileByEmail = async function (email) {
  return this.findOne({ email: email }).exec();
};

userSchema.statics.getUserProfileById = async function (id) {
  return this.findById(id).exec(); // exec returns promise for enabling async handling
};

// Create and export the  User model
module.exports = mongoose.model("User", userSchema);
