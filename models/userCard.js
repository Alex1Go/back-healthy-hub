const mongoose = require("mongoose");
const { Schema } = require("mongoose");
// const { handleMangooseError } = require("../helpres/handleMangooseError");

const userCardSchema = new mongoose.Schema({
  bmr: { type: Number },
  // базовий денний обсяг калорій

  waterRate: {
    type: Number,
    required: true,
  },
  // денна норма води

  ratio: {
    carbonohidrates: {
      type: Number,
      required: true,
    },
    protein: {
      type: Number,
      required: true,
    },
    fat: {
      type: Number,
      required: true,
    },
  },
  // співвідношення білки жири вуглеводи відносно bmr

  weightStatistics: [
    {
      date: { type: String },
      weight: { type: Number },
    },
  ],
  // масив дата - вага

  waterStatistics: [
    {
      date: { type: String },
      water: { type: Number },
    },
  ],
  // масив дата - вжита вода

  foodConsumed: [
    {
      date: { type: String },
      dayCalories: { type: Number },
      dayCarbonohidrates: { type: Number },
      dayProtein: { type: Number },
      dayFat: { type: Number },
      dayWater: { type: Number },
    },
  ],
  // суммарні значення споживаної їжі за весь день

  breakfast: {
    name: {
      type: String,
      // required: true,
    },
    carbonohidrates: {
      type: Number,
      // required: true,
    },
    protein: {
      type: Number,
      // required: true,
    },
    fat: {
      type: Number,
      // required: true,
    },
    calories: {
      type: Number,
      // required: true,
    },
  },

  lunch: {
    name: {
      type: String,
      // required: true,
    },
    carbonohidrates: {
      type: Number,
      // required: true,
    },
    protein: {
      type: Number,
      // required: true,
    },
    fat: {
      type: Number,
      // required: true,
    },
    calories: {
      type: Number,
      // required: true,
    },
  },

  dinner: {
    name: {
      type: String,
      // required: true,
    },
    carbonohidrates: {
      type: Number,
      // required: true,
    },
    protein: {
      type: Number,
      // required: true,
    },
    fat: {
      type: Number,
      // required: true,
    },
    calories: {
      type: Number,
      // required: true,
    },
  },

  snack: {
    name: {
      type: String,
      // required: true,
    },
    carbonohidrates: {
      type: Number,
      // required: true,
    },
    protein: {
      type: Number,
      // required: true,
    },
    fat: {
      type: Number,
      // required: true,
    },
    calories: {
      type: Number,
      // required: true,
    },
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});
// userCardSchema.post("save", handleMangooseError);

module.exports = mongoose.model("UserCard", userCardSchema);
