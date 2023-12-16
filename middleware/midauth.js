const jwt = require("jsonwebtoken");
const User = require("../models/users");

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  const [bearer, token] = authHeader.split(" ", 2);

  if (bearer !== "Bearer") {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).json({ message: "Not authorized" });
    }
    try {
      req.user = decode;
      const user = await User.findById(decode.id).exec();
      if (user.token !== token || !user) {
        return res.status(401).send({ message: "Not authorized" });
      }
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  });
}
module.exports = auth;
