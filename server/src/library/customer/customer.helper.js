const { Table } = require("../../utilities/builder.utility")

const customer = new Table("pos_archive_customer", {
    id: 'cust_id',
    name: 'cust_name',
    address: 'cust_address',
    contact: 'cust_contact',
    email: 'cust_email',
    start: 'cust_start',
    recent: 'cust_recent',
    count: 'cust_count',
    value: 'cust_value',
    waive: 'cust_waive',
    status: 'cust_status',
})

module.exports = customer