const { handle_error } = require("../libs").error;
const { user_service } = require("../services");

const create_user = async (req, res) => {
  try {
    const response = await user_service.create_user(req.body);
    return res.status(201).json(response);
  } catch (error) {
    console.log("Error occured during creating user", error);
    handle_error(res,error)
  }
};

const login_user = async (req, res) => {
  try {
    const response = await user_service.login_user(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log("Error occured during login user", error);
    handle_error(res,error)
  }
};

const update_user_status = async (req, res) => {
  try {
    const response = await user_service.update_user_status(req.user,req.params);
    return res.status(200).json(response);
  } catch (error) {
    console.log("Error occured during updating a specific user status", error);
    handle_error(res,error)
  }
};

module.exports = {
  create_user,
  login_user,
  update_user_status,
};
