const User = require("../models/users");
const UserCard = require("../models/userCard");
const { updateSchema } = require("../validation/userValidationSchema");
const { bmrCalc, waterCalc, ratioCalc } = require("../helpres/calculation");
// const Card = require("../models/userCard");

async function current(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userCard = await UserCard.findOne({ owner: user.id });

    return res.status(200).json({
      username: user.name,
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
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  const { goal, gender, age, height, weight, activity } = req.body;
  const { _id } = req.user;

  //
  // записати вагу в масив
  //

  try {
    const user = await User.findByIdAndUpdate(
      _id,
      { goal, gender, age, height, weight, activity },
      { new: true }
    ).exec();

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
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
  } catch (error) {
    next(error);
  }
}
async function addWater(req, res, next) {
  const { date, woter } = req.body;
  const { _id: owner } = req.user;
  try {
    const userCard = await UserCard.findOne({ owner });
    const existingEntryIndex = userCard.waterStatistics.findIndex(
      (entry) => entry.date === date
    );

    if (existingEntryIndex !== -1) {
      userCard.waterStatistics[existingEntryIndex].woter = woter;
    } else {
      userCard.waterStatistics.push({
        date: date,
        woter: woter,
      });
    }
    await userCard.save();
    res.status(200).json({ success: true, date: userCard });
  } catch (error) {
    next(error);
  }
}

// async function getAllStatistics(req, res, next) {
//   try {
//   } catch (error) {
//     next(error);
//   }
// }
module.exports = { current, update, addWater };
