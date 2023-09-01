const { Table } = require("../../utilities/builder.utility")

const payment = new Table("pos_payment_collection", {
    id: 'paym_id',
    code: 'paym_trans',
    customer: 'paym_customer',
    time: 'paym_time',
    type: 'paym_type',
    method: 'paym_method',
    total: 'paym_total',
    amount: 'paym_amount',
    refcode: 'paym_refcode',
    refdate: 'paym_refdate',
    refstat: 'paym_refstat',
    returned: 'paym_returned',
    reimburse: 'paym_reimburse',
    account: 'paym_account',
    store: 'paym_store'
}, [
    {
        key: "paym_customer",
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
    {
        key: "paym_account",
        reference: { table: "sys_account", key: "acct_id" },
        include: {
            account_name: 'acct_fullname',
            account_store: 'acct_store',
        }
    },
])

module.exports = payment