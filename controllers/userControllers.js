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
// async function addWater(req, res, next) {
//   try {
//     const currentData = new Date();
//   } catch (error) {
//     next(error);
//   }
// }

// Card.methods.logWaterConsumption = async function (date, waterAmount) {
//   try {
//     // Поиск текущего пользователя в базе данных
//     const userCard = await Card.findOne({ _id: this._id });

//     // Проверка, существует ли запись для текущей даты в waterStatistics
//     const existingEntryIndex = userCard.waterStatistics.findIndex(
//       (entry) => entry.date === date
//     );

//     // Если запись существует, обновите количество выпитой воды
//     if (existingEntryIndex !== -1) {
//       userCard.waterStatistics[existingEntryIndex].water = waterAmount;
//     } else {
//       // Если записи нет, добавьте новую запись
//       userCard.waterStatistics.push({ date, water: waterAmount });
//     }

//     // Сохранение изменений
//     await userCard.save();
//     return userCard;
//   } catch (error) {
//     console.error("Error logging water consumption:", error);
//     throw error;
//   }
// };

// async function getAllStatistics(req, res, next) {
//   try {
//   } catch (error) {
//     next(error);
//   }
// }
module.exports = { current, update };
