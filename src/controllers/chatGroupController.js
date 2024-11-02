const { getChatListByUserId, getActiveStatusByChatId, getActiveStatusByGroupId } = require('../models/ChatGroupModel');

const chatList = async (req, res) => {
    const { user_id } = req.body;
    try {
        const chatList = await getChatListByUserId(user_id);
        if (chatList) {
            res.status(200).json({ msg: 'Chat list successful', chatList });
        } else {
            res.status(404).json({ msg: 'Chat list not found' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Server error' } + error.message);
    }
}

const activeStatusChat = async (req, res) => {
    const { chat_id, user_id } = req.body;
    try {
        const active_status = await getActiveStatusByChatId(chat_id, user_id);
        if (active_status) {
            res.status(200).json({ msg: 'Hoạt động', status: active_status });
        } else {
            res.status(200).json({ msg: 'Không hoạt động', status: active_status });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Server error' } + error.message);
    }
}

const activeStatusGroup = async (req, res) => {
    const { group_id, user_id } = req.body;
    try {
        const active_status = await getActiveStatusByGroupId(group_id, user_id);
        if (active_status) {
            res.status(200).json({ msg: 'Hoạt động', status: active_status });
        } else {
            res.status(200).json({ msg: 'Không hoạt động', status: active_status });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Server error' } + error.message);
    }
}
module.exports = {
    chatList,
    activeStatusChat,
    activeStatusGroup,
}