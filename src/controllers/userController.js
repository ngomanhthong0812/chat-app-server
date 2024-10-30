const userService = require('../services/userService');

const registerUser = async (req, res) => {
    const { user, email, password } = req.body;
    try {
        const result = await userService.registerUser(user, email, password);

        res.status(201).json({
            msg: 'Create successful user',
            userId: result.userId,
        })
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
}

module.exports = {
    registerUser
}