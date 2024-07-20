const { Table } = require("../../utilities/builder.utility")

const notification = new Table("sys_notification", {
    id: 'ntfy_id',
    date: 'ntfy_date',
    message: 'ntfy_message',
    url: 'ntfy_url',
})

notification.register('all_latest_notifications', `
    SELECT 
        * 
    FROM sys_notification
    WHERE 
        ntfy_type LIKE '%@type%' AND 
        ntfy_date BETWEEN '@date' AND '@date'
    ORDER BY 
        ntfy_id DESC 
    LIMIT @limit;
`)

module.exports = notification