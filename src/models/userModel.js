const db = require("../config/databse");

const createUser = async (
  first_name,
  last_name,
  gender,
  password,
  email,
  birth_date,
  active_statu,
  avatar_url
) => {
  try {
    const [result] = await db.execute(
      "INSERT INTO users (first_name, last_name, gender, password, email, birth_date, active_status,avatar_url) VALUES (?,?,?,?,?,?,?,?)",
      [
        first_name,
        last_name,
        gender,
        password,
        email,
        birth_date,
        active_statu,
        avatar_url,
      ]
    );
    return result.insertId; // Trả về ID người dùng vừa tạo
  } catch (error) {
    throw new Error("Error inserting user into the database");
  }
};

const getAllUser = async () => {
  try {
    const [result] = await db.execute("SELECT * FROM `users`");
    return result;
  } catch (error) {
    throw new Error("Error get all users");
  }
};

const updateUser = async (user) => {
  try {
    const [result] = await db.execute(
      "UPDATE `users` SET first_name =?, last_name =?, gender =?, email =?, password =?, birth_date =? WHERE id =?",
      [
        user.first_name,
        user.last_name,
        user.gender,
        user.email,
        user.password,
        user.birth_date,
        user.id,
      ]
    );
    return result.affectedRows > 0; // Trả về true nếu cập nhật thành công, false nếu không tồn tại user
  } catch (error) {
    throw new Error("Error updating user");
  }
};

const deleteUser = async (id) => {
  try {
    const [result] = await db.execute("DELETE FROM `users` WHERE id =?", [id]);
    return result.affectedRows > 0; // Trả về true nếu xóa thành công, false nếu không tồn tại user
  } catch (error) {
    throw new Error("Error deleting user");
  }
};
const findEmail = async (email) => {
  try {
    const [result] = await db.execute("SELECT * FROM `users` WHERE email = ?", [
      email,
    ]);
    return result.length > 0; // Trả về true nếu email đã tồn tại, false nếu chưa tồn tại
  } catch (error) {
    throw new Error("Error checking email");
  }
};
module.exports = {
  createUser,
  getAllUser,
  updateUser,
  deleteUser,
  findEmail,
};
