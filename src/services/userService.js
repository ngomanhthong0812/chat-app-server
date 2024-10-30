const userModel = require('../models/userModel');

const registerUser = async (username, email, password) => {
    try {
        // xử lý logic nghiệp vụ...

        const userId = await userModel.createUser(username, email, password);

        return userId;
    } catch (error) {
        throw new Error('Error registering user');
    }

}

module.exports = {
    registerUser
}