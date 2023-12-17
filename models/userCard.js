// const { number, object, array } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const userCardSchema = new mongoose.Schema({
  bmr: { type: Number },
  // базовий денний обсяг калорій

  waterRate: { type: Number },
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
      date: { type: Number },
      weight: { type: Number },
    },
  ],
  // масив дата - вага

  waterStatistics: [
    {
      date: { type: Number },
      woter: { type: Number },
    },
  ],
  // масив дата - вжита вода

  foodConsumed: [
    {
      date: { type: Number },
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
      required: true,
    },
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
    calories: {
      type: Number,
      required: true,
    },
  },

  lunch: {
    name: {
      type: String,
      required: true,
    },
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
    calories: {
      type: Number,
      required: true,
    },
  },

  dinner: {
    name: {
      type: String,
      required: true,
    },
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
    calories: {
      type: Number,
      required: true,
    },
  },

  snack: {
    name: {
      type: String,
      required: true,
    },
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
    calories: {
      type: Number,
      required: true,
    },
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});
module.exports = mongoose.model("UserCard", userCardSchema);
