const User = require("../models/users");
const Card = require("../models/userCard");

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
async function addWater(req, res, next) {
  const { date, woter } = req.body;
  const { _id: owner } = req.user;
  try {
    const userCard = await Card.findOne({ owner });
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
module.exports = { current, addWater };
