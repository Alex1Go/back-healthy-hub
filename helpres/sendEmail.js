require("dotenv").config();
const nodemailer = require("nodemailer");

const { META_USER } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: process.env.META_USER,
    pass: process.env.META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: META_USER };
  await transport.sendMail(email);
};

module.exports = { sendEmail };
