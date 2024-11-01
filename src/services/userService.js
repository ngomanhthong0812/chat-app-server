const userModel = require("../models/usersModel");

const handleRegister = async (
  first_name,
  last_name,
  gender,
  password,
  email,
  birth_date,
  active_status
) => {
  try {
    // xử lý logic nghiệp vụ...

    const emailExists = await userModel.findEmail(email);
    if (emailExists) {
      return null;
    }
    const avatar =
      "https://firebasestorage.googleapis.com/v0/b/chat-app-c83bc.appspot.com/o/avatars%2Favatar-default.jpg?alt=media&token=11bd1e02-105f-4405-9e69-1f8636381ab9";
    const userId = await userModel.createUser(
      first_name,
      last_name,
      gender,
      password,
      email,
      birth_date,
      active_status,
      avatar
    );

    return userId;
  } catch (error) {
    throw new Error("Error registering user");
  }
};

const handleLogin = async (email, password) => {
  try {
    const users = await userModel.getAllUser();
    const user = users.find((u) => u.email === email);

    if (user) {
      const checkPassword = user.password === password;
      if (checkPassword) {
        return user;
      }
    }
    return null;
  } catch (error) {
    throw new Error("Error login user");
  }
};

module.exports = {
  handleRegister,
  handleLogin,
};
