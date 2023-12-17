const User = require("../models/users");
// const Card = require("../models/userCard");

async function current(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    return res.status(200).json({
      email: user.email,
      subscription: user.subscription,
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
module.exports = { current };
