const Joi = require("joi");

const registrShema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().min(6).required(),
  goal: Joi.string().required(),
  gender: Joi.string().required(),
  age: Joi.number().max(100).min(16).required(),
  height: Joi.number().max(250).min(130).required(),
  weight: Joi.number().max(200).min(40).required(),
  activity: Joi.number().default("1.2").required(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ua"] },
    })
    .required(),
  password: Joi.string().min(6).required(),
});

module.exports = { registrShema, loginSchema };
