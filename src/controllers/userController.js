require('dotenv').config();
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const {
        first_name,
        last_name,
        gender,
        password,
        email,
        birth_date,
        active_status,
    } = req.body;

    try {
        const userId = await userService.handleRegister(first_name, last_name, gender, password, email, birth_date, active_status);

        if (userId) {
            res.status(201).json({
                msg: 'Create successful user',
                userId: userId,
            })
        } else {
            res.status(400).json({
                msg: 'Email already in use',
            })
        }

    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
}

const loginUser = async (req, res) => {
    const {
        email,
        password
    } = req.body;
    try {
        const user = await userService.handleLogin(email, password);

        if (user) {
            const token = jwt.sign(user, process.env.JWT_SECRET);
            res.status(200).json({
                msg: 'Login successful',
                token: token,
            })
        } else {
            res.status(400).json({
                msg: 'Email or password is wrong',
                email: email,
                password: password,
            })
        }
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
}

module.exports = {
    registerUser,
    loginUser,
}