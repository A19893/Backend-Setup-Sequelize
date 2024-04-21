const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

const matchPassword = async(password, save_password) =>{
    return await bcrypt.compare(password, save_password);
}

module.exports = {
  generateToken,
  matchPassword
};
