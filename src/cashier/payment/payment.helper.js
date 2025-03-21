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
        key: "paym_trans",
        reference: { table: "pos_sales_transaction", key: "trns_code" },
        include: {
            transaction_id: 'trns_id',
            transaction_time: 'trns_time',
            transaction_vat: 'trns_vat',
            transaction_total: 'trns_total',
            transaction_less: 'trns_less',
            transaction_net: 'trns_net',
            transaction_return: 'trns_return',
            transaction_discount: 'trns_discount',
            transaction_tended: 'trns_tended',
            transaction_change: 'trns_change',
            transaction_method: 'trns_method',
            transaction_status: 'trns_status',
            transaction_account: 'trns_account',
            transaction_date: 'trns_date',
        }
    },
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
    }
])

module.exports = payment