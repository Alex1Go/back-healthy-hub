const RecommendedFood = require("../models/recommendedFood");

async function getRecommendedFood(req, res, next) {
  try {
    const data = await RecommendedFood.find().exec();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}
module.exports = { getRecommendedFood };
