const jwt = require("jsonwebtoken");
const { users_repository_obj } = require("../repositories/users_repository");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      const user = await users_repository_obj.find_one({id: decoded.id}, [], true, {exclude:['password']});
      req.user = user.toJSON()
      next();
    } catch (error) {
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  }
  else{
     return res.status(401).json({ error: "Not authorized, token failed" });
  }
};

module.exports = protect;
