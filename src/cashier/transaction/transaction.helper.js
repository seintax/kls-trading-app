const { Table } = require("../../utilities/builder.utility")

const transaction = new Table("pos_sales_transaction", {
    id: 'trns_id',
    code: 'trns_code',
    time: 'trns_time',
    vat: 'trns_vat',
    total: 'trns_total',
    less: 'trns_less',
    net: 'trns_net',
    return: 'trns_return',
    discount: 'trns_discount',
    tended: 'trns_tended',
    change: 'trns_change',
    method: 'trns_method',
    status: 'trns_status',
    account: 'trns_account',
    customer: 'trns_customer',
    date: 'trns_date',
}, [
    {
        key: "trns_account",
        reference: { table: "sys_account", key: "acct_id" },
        include: {
            account_name: 'acct_fullname',
            account_store: 'acct_store',
        }
    },
    {
        key: "trns_customer",
        reference: { table: "pos_archive_customer", key: "cust_id" },
        include: {
            customer_name: 'cust_name',
            customer_address: 'cust_address',
            customer_contact: 'cust_contact',
            customer_email: 'cust_email',
            customer_start: 'cust_start',
            customer_recent: 'cust_recent',
            customer_count: 'cust_count',
            customer_value: 'cust_value',
            customer_waive: 'cust_waive',
        }
    },
])

module.exports = transaction