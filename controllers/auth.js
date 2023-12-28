const { CtrlWrapper } = require("../helpres/errorWrapper");
const User = require("../models/users");
const UserCard = require("../models/userCard");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { bmrCalc, waterCalc, ratioCalc } = require("../helpres/calculation");
const {
  registrSchema,
  loginSchema,
  forgotSchema,
} = require("../validation/userValidationSchema");
const { sendEmail } = require("../helpres/sendEmail");

async function signup(req, res) {
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

  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }

  const { error } = registrSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomUUID();
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
    verificationToken,
  });

  await UserCard.create({
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
}

async function signin(req, res) {
  const { email, password } = req.body;

  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const user = await User.findOne({ email }).exec();
  if (user === null) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const userCard = await UserCard.findOne();

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch === false) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "72h",
  });
  await User.findByIdAndUpdate(user._id, { token }).exec();

  res.status(200).json({
    token,
    user: {
      email: user.email,
      username: user.username,
      goal: user.goal,
      gender: user.gender,
      age: user.age,
      height: user.height,
      weight: user.weight,
      activity: user.activity,
      ratio: userCard.ratio,
    },
  });
}

async function signout(req, res) {
  const user = await User.findByIdAndUpdate(req.user.id, {
    token: null,
  }).exec();
  if (!user) {
    return res.status(404).json({ message: "Not authorized" });
  }
  res.status(204).end();
}

async function forgotPassword(req, res) {
  const { email } = req.body;

  const { error } = forgotSchema.validate({ email });
  if (error) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ message: "User not found (email not registered)" });
  }

  const newPassword = crypto.randomBytes(8).toString("hex");
  const hashPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashPassword;
  await user.save();
  const emailContent = {
    to: email,
    subject: "New password",
    html: `<h2>Your new password:</h2>
        <p> ${newPassword}</p>`,
  };
  await sendEmail(emailContent);
  return res.status(200).json({ message: "New password sent to your email" });
}

module.exports = {
  signup: CtrlWrapper(signup),
  signin: CtrlWrapper(signin),
  signout: CtrlWrapper(signout),
  forgotPassword: CtrlWrapper(forgotPassword),
};
