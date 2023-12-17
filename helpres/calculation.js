// const UserCard = require("../models/userCard");

function bmrCalc(weight, height, age, gender, activity) {
  const a = gender === "Male" ? 13.397 * weight : 9.247 * weight;
  const b = gender === "Male" ? 4.799 * height : 3.098 * height;
  const c = gender === "Male" ? 5.677 * age : 4.33 * age;

  const bmr = Math.round((88.362 + a + b - c) * activity);
  return bmr;
}

function waterCalc(weight, activity) {
  let waterRate = 0;
  const baseWaterRate = Math.round(weight * 0.03 * 1000);
  switch (activity) {
    case "1.2":
      waterRate = baseWaterRate;
      return waterRate;

    case " 1.375":
      waterRate = baseWaterRate + 350;
      return waterRate;

    case "1.55":
      waterRate = baseWaterRate + 350;
      return waterRate;

    case "1.725":
      waterRate = baseWaterRate + 350;
      return waterRate;

    case "1.9":
      waterRate = baseWaterRate + 350;
      return waterRate;
  }
}

function ratioCalc(goal, weight, height, age, gender, activity) {
  const bmr = bmrCalc(weight, height, age, gender, activity);
  let ratio = {};

  switch (goal) {
    case "Lose Fat":
      ratio = {
        protein: Math.round((bmr / 100) * 25),
        fat: Math.round((bmr / 100) * 20),
        carbonohidrates: Math.round((bmr / 100) * 55),
      };
      return ratio;

    case "Maintain":
      ratio = {
        protein: Math.round((bmr / 100) * 30),
        fat: Math.round((bmr / 100) * 20),
        carbonohidrates: Math.round((bmr / 100) * 50),
      };
      return ratio;

    case "Gain Muscle":
      ratio = {
        protein: Math.round((bmr / 100) * 20),
        fat: Math.round((bmr / 100) * 25),
        carbonohidrates: Math.round((bmr / 100) * 55),
      };
      return ratio;
  }
}

module.exports = { bmrCalc, waterCalc, ratioCalc };
