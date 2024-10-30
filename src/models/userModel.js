const db = require('../config/databse');

const createUser = async (username, email, password) => {
    try {
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password) VALUES (?,?,?)',
            [username, email, password]
        )
        return result.insertId; // Trả về ID người dùng vừa tạo
    } catch (error) {
        throw new Error('Error inserting user into the database');
    }

}

module.exports = {
    createUser
}