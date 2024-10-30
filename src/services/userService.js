const userModel = require('../models/userModel');

const handleRegister = async (first_name, last_name, gender, password, email, birth_date, active_status) => {
    try {
        // xử lý logic nghiệp vụ...

        const emailExists = await userModel.findEmail(email);
        if (emailExists) {
            return null;
        }
        const userId = await userModel.createUser(first_name, last_name, gender, password, email, birth_date, active_status);

        return userId;

    } catch (error) {
        throw new Error('Error registering user');
    }
}

const handleLogin = async (email, password) => {
    try {
        const users = await userModel.getAllUser();
        const user = users.find(u => u.email === email);

        if (user) {
            const checkPassword = user.password === password;
            if (checkPassword) {
                return user;
            }
        }
        return null;
    } catch (error) {
        throw new Error('Error login user');
    }
}

module.exports = {
    handleRegister,
    handleLogin,
}