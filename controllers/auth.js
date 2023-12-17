const User = require("../models/users");
const UserCard = require("../models/userCard");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { bmrCalc, waterCalc, ratioCalc } = require("../helpres/calculation");
const {
  registrSchema,
  loginSchema,
} = require("../validation/userValidationSchema");

async function signup(req, res, next) {
  const {
    username,
    email,
    password,
    goal,
    gender,
    age,
    height,
    weight,
    activity,
  } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "Email in use" });
    }

    const { error } = registrSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: passwordHash,
      goal,
      gender,
      age,
      height,
      weight,
      activity,
    });

    const newUserCard = await UserCard.create({
      bmr: bmrCalc(weight, height, age, gender, activity),

      waterRate: waterCalc(weight, activity),

      ratio: ratioCalc(goal, weight, height, age, gender, activity),

      weightStatistics: [],

      waterStatistics: [],

      foodConsumed: [],

      breakfast: {
        name: "",
        carbonohidrates: 0,
        protein: 0,
        fat: 0,
        calories: 0,
      },

      lunch: {
        name: "",
        carbonohidrates: 0,
        protein: 0,
        fat: 0,
        calories: 0,
      },

      dinner: {
        name: "",
        carbonohidrates: 0,
        protein: 0,
        fat: 0,
        calories: 0,
      },

      snack: {
        name: "",
        carbonohidrates: 0,
        protein: 0,
        fat: 0,
        calories: 0,
      },
      owner: newUser._id,
    });

    res.status(201).json({
      user: {
        username: newUser.name,
        email: newUser.email,
        goal: newUser.goal,
        gender: newUser.gender,
        age: newUser.age,
        height: newUser.height,
        weight: newUser.weight,
        activity: newUser.activity,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function signin(req, res, next) {
  const { email, password } = req.body;
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const user = await User.findOne({ email }).exec();
    if (user === null) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });
    await User.findByIdAndUpdate(user._id, { token }).exec();

    res.status(200).json({
      token,
      user: {
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function sigout(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, {
      token: null,
    }).exec();
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = { signup, signin, sigout };
