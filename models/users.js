const mongoose = require("mongoose");
// const { handleMangooseError } = require("../helpres/handleMangooseError");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    goal: {
      type: String,
      enum: ["Lose Fat", "Maintain", "Gain Muscle"],
      default: "Lose Fat",
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Male",
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
    },
    height: {
      type: Number,
      required: [true, "Height is required"],
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
    },
    activity: {
      type: Number,
      enum: [1.2, 1.375, 1.55, 1.725, 1.9],
      default: 1.2,
    },
    avaterURL: { type: String },
    token: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
// userSchema.post("save", handleMangooseError);
module.exports = mongoose.model("User", userSchema);
