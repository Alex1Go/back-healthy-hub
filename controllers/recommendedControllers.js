const RecommendedFood = require("../models/recommendedFood");
const { CtrlWrapper } = require("../helpres/errorWrapper");

async function getRecommendedFood(res) {
  const data = await RecommendedFood.find().exec();
  res.status(200).json(data);
}
module.exports = { getRecommendedFood: CtrlWrapper(getRecommendedFood) };
