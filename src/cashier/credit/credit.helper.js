const { Table } = require("../../utilities/builder.utility")

const credit = new Table("pos_sales_credit", {
    id: 'cred_id',
    creditor: 'cred_creditor',
    code: 'cred_trans',
    time: 'cred_time',
    total: 'cred_total',
    partial: 'cred_partial',
    balance: 'cred_balance',
    payment: 'cred_payment',
    returned: 'cred_returned',
    waived: 'cred_waived',
    outstand: 'cred_outstand',
    tended: 'cred_tended',
    change: 'cred_change',
    reimburse: 'cred_reimburse',
    status: 'cred_status',
    settledon: 'cred_settledon',
    account: 'cred_account',
    store: 'cred_store'
}, [
    {
        key: "cred_creditor",
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
            customer_paid: 'cust_paid',
            customer_waive: 'cust_waive',
            customer_status: 'cust_status',
        }
    },
    {
        key: "cred_trans",
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
        key: "cred_account",
        reference: { table: "sys_account", key: "acct_id" },
        include: {
            account_name: 'acct_fullname',
            account_store: 'acct_store',
        }
    }
])

credit.register("credit_unsettled",
    `SELECT
            cred_creditor,
            cust_name,
            cred_store,
            SUM(cred_balance) AS value,
            paid
        FROM 
            pos_sales_credit a
                LEFT JOIN pos_archive_customer b
                    ON b.cust_id = a.cred_creditor 
                LEFT JOIN (
                    SELECT 
                        paym_customer,
                        SUM(paym_amount) AS paid
                    FROM  
                        pos_payment_collection
                    WHERE 
                        paym_type = 'CREDIT' AND
                        paym_trans IS NULL AND
                        paym_store LIKE '%@store%'
                    GROUP BY
                        paym_customer
                ) c                
                    ON c.paym_customer = a.cred_creditor 
        WHERE 
            cred_store LIKE '%@store%' AND 
            cust_value > 0
        GROUP BY 
            cred_creditor,
            cust_name,
            cred_store,
            paid;`
)

module.exports = credit