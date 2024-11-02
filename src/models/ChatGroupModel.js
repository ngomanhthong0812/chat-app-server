const db = require('../config/databse');

const getChatListByUserId = async function (user_id) {
    try {
        const [chats] = await db.execute(`
            SELECT
                c.avatar_url,
                c.chat_name,
                msg.*,
                sender.last_name AS sender_last_name,
                sender.first_name AS sender_first_name,
                GROUP_CONCAT(DISTINCT us2.first_name, ' ', us2.last_name) AS participants
            FROM users us
            JOIN user_chat uc ON uc.user_id = us.id
            JOIN chats c ON uc.chat_id = c.id
            JOIN messages msg ON c.id = msg.chat_id
            JOIN users sender ON msg.user_id = sender.id
            JOIN user_chat uc2 ON uc2.chat_id = c.id AND uc2.user_id != us.id
            JOIN users us2 ON uc2.user_id = us2.id
            WHERE
                us.id = ? AND
                msg.sent_at = (
                    SELECT MAX(sent_at)
                    FROM messages
                    WHERE chat_id = c.id
                )
            GROUP BY c.id, msg.id;
        `, [user_id]);

        const [groups] = await db.execute(`
            SELECT
                us.active_status,
                g.avatar_url,
                g.group_name AS chat_name,
                msg.*,
                sender.last_name AS sender_last_name,
                sender.first_name AS sender_first_name
            FROM users us
            JOIN user_group ug ON ug.user_id = us.id
            JOIN groups g ON ug.group_id = g.id
            JOIN messages msg ON g.id = msg.group_id
            JOIN users sender ON msg.user_id = sender.id
            WHERE
                us.id = ? AND
                msg.sent_at = (
                    SELECT MAX(sent_at)
                    FROM messages
                    WHERE group_id = g.id
                );
        `, [user_id]);

        return chats.concat(groups); // Trả về danh sách chat và nhóm
    } catch (error) {
        throw new Error("Error get chatList: " + error.message);
    }
}

const getActiveStatusByChatId = async (chat_id, user_id) => {
    try {
        const [active_status_chat] = await db.execute(
            `SELECT
              us.active_status
            FROM
             users us
            JOIN user_chat uc ON us.id = uc.user_id
            WHERE uc.chat_id = ? AND us.id != ? AND us.active_status = 1`,
            [chat_id, user_id]
        );


        return active_status_chat.length > 0;
    } catch (error) {
        throw new Error("Error get active status: " + error.message);
    }
}

const getActiveStatusByGroupId = async (group_id, user_id) => {
    try {
        const [active_status_group] = await db.execute(
            `SELECT
              us.active_status
             FROM
              users us
             JOIN
              user_group ug ON us.id = ug.user_id
             WHERE ug.group_id = ? AND us.id != ? AND  us.active_status = 1`,
            [group_id, user_id]
        );
        return active_status_group.length > 0;
    } catch (error) {
        throw new Error("Error get active status: " + error.message);
    }
}

module.exports = {
    getChatListByUserId,
    getActiveStatusByChatId,
    getActiveStatusByGroupId,
}
