const User = require("../models/users");
const UserCard = require("../models/userCard");
const { updateSchema } = require("../validation/userValidationSchema");
const { bmrCalc, waterCalc, ratioCalc } = require("../helpres/calculation");

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
  const { username, goal, gender, age, height, weight, activity } = req.body;
  const { _id } = req.user;

  //
  // записати вагу в масив
  //

  try {
    const user = await User.findByIdAndUpdate(
      _id,
      { username, goal, gender, age, height, weight, activity },
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

async function goalUpdate(req, res, next) {
  const { goal } = req.body;
  const { _id } = req.user;

  try {
    const user = await User.findByIdAndUpdate(
      _id,
      { goal },
      { new: true }
    ).exec();

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
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
  } catch (error) {
    next(error);
  }
}
async function weightStatistic(req, res, next) {
  const { weight } = req.body;

  const { _id: owner } = req.user;

  try {
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
module.exports = { current, update, addWater, goalUpdate, weightStatistic };
