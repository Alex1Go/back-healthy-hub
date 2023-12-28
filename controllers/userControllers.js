const mongoose = require("mongoose");
const { CtrlWrapper } = require("../helpres/errorWrapper");
const User = require("../models/users");
const UserCard = require("../models/userCard");
const { updateSchema } = require("../validation/userValidationSchema");
const { bmrCalc, waterCalc, ratioCalc } = require("../helpres/calculation");

async function current(req, res) {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const userCard = await UserCard.findOne({ owner: user.id });

  return res.status(200).json({
    username: user.username,
    email: user.email,
    goal: user.goal,
    gender: user.gender,
    age: user.age,
    height: user.height,
    weight: user.weight,
    activity: user.activity,
    bmr: userCard.bmr,
    waterRate: userCard.waterRate,
    ratio: userCard.ratio,
  });
}
async function update(req, res) {
  const { username, goal, gender, age, height, weight, activity } = req.body;
  const { _id } = req.user;

  // записати вагу в масив

  const user = await User.findByIdAndUpdate(
    _id,
    { username, goal, gender, age, height, weight, activity },
    { new: true }
  ).exec();

  if (!user) {
    return res.status(404).json({ message: "Not authorized" });
  }
  const { error } = updateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const bmr = bmrCalc(weight, height, age, gender, activity);

  const waterRate = waterCalc(weight, activity);

  const ratio = ratioCalc(goal, weight, height, age, gender, activity);

  const userCard = await UserCard.findOne({ owner: user.id });
  const id = userCard.id;

  const changeUserCard = await UserCard.findByIdAndUpdate(
    id,
    { bmr, waterRate, ratio },
    { new: true }
  ).exec();

  return res.status(200).json({
    username: user.username,
    goal: user.goal,
    gender: user.gender,
    age: user.age,
    height: user.height,
    weight: user.weight,
    activity: user.activity,
    bmr: changeUserCard.bmr,
    waterRate: changeUserCard.waterRate,
    ratio: changeUserCard.ratio,
  });
}
async function goalUpdate(req, res) {
  const { goal } = req.body;
  const { _id } = req.user;

  const user = await User.findByIdAndUpdate(
    _id,
    { goal },
    { new: true }
  ).exec();

  if (!user) {
    return res.status(404).json({ message: "Not authorized" });
  }
  const { error } = updateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const userCard = await UserCard.findOne({ owner: user.id });

  const id = userCard.id;

  const ratio = ratioCalc(
    user.goal,
    user.weight,
    user.height,
    user.age,
    user.gender,
    user.activity
  );

  await UserCard.findByIdAndUpdate(id, { ratio }, { new: true }).exec();

  return res.status(200).json({
    goal: user.goal,
  });
}
async function weightStatistic(req, res) {
  const { weight } = req.body;
  const { _id: owner } = req.user;

  const userCard = await UserCard.findOne({ owner });

  const id = userCard.owner;

  const user = await User.findByIdAndUpdate(
    id,
    { weight },
    { new: true }
  ).exec();

  userCard.bmr = bmrCalc(
    user.weight,
    user.height,
    user.age,
    user.gender,
    user.activity
  );
  userCard.waterRate = waterCalc(user.weight, user.activity.toString());

  // const date = new Date();
  // const day = date.getDate();
  // const month = date.getMonth() + 1;
  // const year = date.getFullYear();
  const currentDate = new Date().toJSON().slice(0, 10);
  const statistic = userCard.weightStatistics;
  const data = statistic.find((element) => element.date === currentDate);

  if (!data) {
    userCard.weightStatistics.push({
      date: currentDate,
      weight,
    });
  }
  statistic.map((element) =>
    element.date === currentDate ? (element.weight = weight) : ""
  );
  await userCard.save();
  return res.status(200).json({ success: true, data: userCard });
}
async function addFood(req, res) {
  const { breakfast, lunch, dinner, snack } = req.body;
  const { _id: owner } = req.user;
  const currentDate = new Date().toJSON().slice(0, 10);
  let userCard = await UserCard.findOne({
    owner,
    breakfast,
    lunch,
    dinner,
    snack,
    currentDate,
  });

  if (!userCard) {
    userCard = new UserCard({
      owner,
      breakfast,
      lunch,
      dinner,
      snack,
      currentDate,
    });
  }

  userCard.breakfast = { ...userCard.breakfast, ...breakfast };
  userCard.lunch = { ...userCard.lunch, ...lunch };
  userCard.dinner = { ...userCard.dinner, ...dinner };
  userCard.snack = { ...userCard.snack, ...snack };

  userCard.foodConsumed[0].dayCalories =
    (userCard.breakfast.calories || 0) +
    (userCard.lunch.calories || 0) +
    (userCard.dinner.calories || 0) +
    (userCard.snack.calories || 0);

  userCard.foodConsumed[0].dayCarbonohidrates =
    (userCard.breakfast.carbonohidrates || 0) +
    (userCard.lunch.carbonohidrates || 0) +
    (userCard.dinner.carbonohidrates || 0) +
    (userCard.snack.carbonohidrates || 0);

  userCard.foodConsumed[0].dayProtein =
    (userCard.breakfast.protein || 0) +
    (userCard.lunch.protein || 0) +
    (userCard.dinner.protein || 0) +
    (userCard.snack.protein || 0);

  userCard.foodConsumed[0].dayFat =
    (userCard.breakfast.fat || 0) +
    (userCard.lunch.fat || 0) +
    (userCard.dinner.fat || 0) +
    (userCard.snack.fat || 0);

  userCard.foodConsumed[0].dayWater =
    (userCard.breakfast.water || 0) +
    (userCard.lunch.water || 0) +
    (userCard.dinner.water || 0) +
    (userCard.snack.water || 0);
  await userCard.save();
  res.json(userCard.foodConsumed[0]);
}
async function addWater(req, res) {
  const { water } = req.body;
  const { _id: owner } = req.user;

  const currentDate = new Date().toISOString().split("T")[0];
  let userCard = await UserCard.findOne({
    owner,
    "waterStatistics.date": currentDate,
  });

  if (userCard) {
    userCard = await UserCard.findOneAndUpdate(
      {
        owner,
        "waterStatistics.date": currentDate,
      },
      {
        $inc: { "waterStatistics.$.water": water },
      },
      { new: true }
    );
  } else {
    userCard = await UserCard.findOneAndUpdate(
      { owner },
      {
        $push: {
          waterStatistics: {
            date: currentDate,
            water,
          },
        },
      },
      { new: true }
    );
  }
  await userCard.save();
  res.status(200).json({ success: true, date: userCard.waterStatistics });
}
async function deleteWater(req, res) {
  const { _id: owner } = req.user;
  const currentDate = new Date().toJSON().slice(0, 10);
  const updatedUserCard = await UserCard.findOneAndUpdate(
    { owner, "waterStatistics.date": currentDate },
    { $pull: { waterStatistics: { date: currentDate } } },
    { new: true }
  );
  if (!updatedUserCard) {
    return res.status(404).json({ message: "Not authorized" });
  }
  res.status(200).json({ message: "Your data deleted" });
}
async function getAllStatistic(req, res) {
  const { _id: owner } = req.user;
  const { startDate, endDate } = req.query;

  const statistics = await UserCard.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(owner) } },
    {
      $project: {
        weightStatistics: {
          $filter: {
            input: "$weightStatistics",
            as: "weightStat",
            cond: {
              $and: [
                { $gte: ["$$weightStat.date", new Date(startDate)] },
                { $lte: ["$$weightStat.date", new Date(endDate)] },
              ],
            },
          },
        },
        foodConsumed: {
          $filter: {
            input: "$foodConsumed",
            as: "foodConsumedStat",
            cond: {
              $and: [
                { $gte: ["$$foodConsumedStat.date", new Date(startDate)] },
                { $lte: ["$$foodConsumedStat.date", new Date(endDate)] },
              ],
            },
          },
        },
        waterStatistics: {
          $filter: {
            input: "$waterStatistics",
            as: "waterStat",
            cond: {
              $and: [
                { $gte: ["$$waterStat.date", new Date(startDate)] },
                { $lte: ["$$waterStat.date", new Date(endDate)] },
              ],
            },
          },
        },
      },
    },
  ]);
  res.json({ success: true, statistics });
}

async function getWater(req, res) {
  const { _id: owner } = req.user;

  const currentDate = new Date().toISOString().split("T")[0];
  const userCard = await UserCard.findOne({
    owner,
    "waterStatistics.date": currentDate,
  });
  if (!userCard) {
    return res.status(401).json({ message: "You are not data" });
  }
  res.status(200).json(userCard.waterStatistics);
}

module.exports = {
  current: CtrlWrapper(current),
  update: CtrlWrapper(update),
  goalUpdate: CtrlWrapper(goalUpdate),
  weightStatistic: CtrlWrapper(weightStatistic),
  addFood: CtrlWrapper(addFood),
  addWater: CtrlWrapper(addWater),
  deleteWater: CtrlWrapper(deleteWater),
  getAllStatistic: CtrlWrapper(getAllStatistic),
  getWater: CtrlWrapper(getWater),
};
