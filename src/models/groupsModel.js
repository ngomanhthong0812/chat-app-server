const db = require('../config/databse');

const createGroup = async (group_name, avatar_url) => {
    try {
        const [result] = await db.execute(
            'INSERT INTO groups (group_name, avatar_url) VALUES (?,?)',
            [group_name, avatar_url]
        );
        return result.insertId; // Trả về id group vừa tạo
    } catch (error) {
        throw new Error('Error inserting group')
    }
}

const getAllGroup = async () => {
    try {
        const [groups] = await db.execute(
            'SELECT * FROM groups'
        );
        return groups; // Trả về danh sách group
    } catch (error) {
        throw new Error('Error get all group')
    }
}

const updateGroup = async (id, group_name, avatar_url) => {
    try {
        const [result] = await db.execute(
            'UPDATE groups SET group_name = ?, avatar_url = ? WHERE id = ?',
            [group_name, avatar_url, id]
        );
        return result.affectedRows > 0; // Trả về true nếu cập nhật thành công, false nếu không tồn tại group
    } catch (error) {
        throw new Error('Error updating group')
    }
}

const deleteGroup = async (id) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM groups WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0; // Trả về true nếu xóa thành công, false nếu không tồn tại group
    } catch (error) {
        throw new Error('Error delete group')
    }
}

module.exports = {
    createGroup,
    getAllGroup,
    updateGroup,
    deleteGroup,
}