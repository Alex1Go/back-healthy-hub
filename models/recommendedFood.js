const mongoose = require("mongoose");
const { handleMangooseError } = require("../helpres/handleMangooseError");

const recommendedSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  amount: {
    type: String,
    require: true,
  },
  img: {
    type: String,
    require: true,
  },
  calories: {
    type: Number,
    require: true,
  },
  nutrition: {
    carbohydrates: {
      type: Number,
      require: true,
    },
    protein: {
      type: Number,
      require: true,
    },
    fat: {
      type: Number,
      require: true,
    },
  },
});

recommendedSchema.post("save", handleMangooseError);
module.exports = mongoose.model("RecommendedFood", recommendedSchema);
