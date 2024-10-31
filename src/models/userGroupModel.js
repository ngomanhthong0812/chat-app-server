const db = require('../config/databse');

const createUserGroup = async (user_id, group_id, is_admin) => {
    try {
        const [result] = await db.execute(
            'INSERT INTO user_group (user_id, group_id, is_admin) VALUES (?,?,?)',
            [user_id, group_id, is_admin]
        );
        return result.insertId; // Trả về id user_group vừa tạo
    } catch (error) {
        throw new Error('Error inserting user_group');
    }
}
const getAllUserGroup = async () => {
    try {
        const [result] = await db.execute(
            'SELECT * FROM user_group',
        );
        return result; // Trả về danh sách user_group
    } catch (error) {
        throw new Error('Error get all user_groups');
    }
}
const updateUserGroup = async (id, user_id, group_id, is_admin) => {
    try {
        const [result] = await db.execute(
            'UPDATE user_group SET user_id =?, group_id =?, is_admin =? WHERE id =?',
            [user_id, group_id, is_admin, id]
        );
        return result.affectedRows > 0; // Trả về true nếu update thành công, false nếu không tồn tại user_group
    } catch (error) {
        throw new Error('Error update user_group');
    }
}
const deleteUserGroup = async (id) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM user_group WHERE id =?',
            [id]
        );
        return result.affectedRows > 0; // Trả về true nếu xóa thành công, false nếu không tồn tại user_group
    } catch (error) {
        throw new Error('Error delete user_groups');
    }
}

module.exports = {
    createUserGroup,
    getAllUserGroup,
    updateUserGroup,
    deleteUserGroup,
}