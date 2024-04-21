
const { utils } = require("../libs");
const { custom_error } = require("../libs/error");
const { generateToken } = require("../libs/utils");
const { users_repository_obj } = require("../repositories/users_repository");

const create_user = async (payload) => {
    const { username, password, email, isAdmin = false } = payload;
    if (!username || !email || !password) {
        throw new custom_error("Please Fill all the fields!");
    }
    const existing_User = await users_repository_obj.find_user({email: email});
    if (existing_User) throw new custom_error("Email already Exists!");
    const registered_user = await users_repository_obj.create_user({username, email, password, isAdmin})
    return registered_user;
};

const login_user = async (payload) => {
    const { email, password } = payload;
    if (!email || !password) {
        throw new custom_error("Bad request, Check the payload!");
    }
    const existingUser = await users_repository_obj.find_user({email: email });
    if (!existingUser) {
        throw new custom_error("User not exists!");
    }
    if(!existingUser.is_active){
        throw new custom_error("User status is not active. Contact Support Team.")
    }
    if (!existingUser || !(await utils.matchPassword(password, existingUser.password))) {
        throw new custom_error("Invalid Email/Password!");
    }
    const token = generateToken(existingUser.id);
    return { ...existingUser.dataValues, token: token }
};

const update_user_status = async (user, params) => {
    const { user_id } = params;
    const is_user = await users_repository_obj.find_user({email: user.email});
    if(!is_user.isAdmin){
        throw new custom_error("You are not authorized to do this operation", http_status_code.UNAUTHORIZED)
    }
    const user_to_update = await users_repository_obj.find_user({uuid: user_id});
    if (!user_to_update) {
        throw new custom_error("User not exists!");
    }
    const payload = {
      is_active: !user_to_update.is_active
    }
    const updated_user = await users_repository_obj.update_user(params, payload);
    return updated_user;
}

module.exports = {
    create_user,
    login_user,
    update_user_status,
};
