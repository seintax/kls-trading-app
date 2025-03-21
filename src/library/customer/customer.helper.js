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
    paid: 'cust_paid',
    waive: 'cust_waive',
    sales: 'cust_sales',
    status: 'cust_status',
})

customer.register("customer_update_credit",
    `UPDATE pos_archive_customer SET 
        cust_count=(
                SELECT IFNULL(COUNT(*),0) 
                FROM pos_sales_credit 
                WHERE cred_creditor=cust_id 
                    AND cred_status='ON-GOING'
            ),
        cust_value=(
                SELECT IFNULL(SUM(cred_outstand),0) 
                FROM pos_sales_credit 
                WHERE cred_creditor=cust_id 
                    AND cred_status='ON-GOING'
            )
        WHERE cust_id=@id`)

customer.register("customer_update_settle",
    `UPDATE pos_archive_customer SET 
        cust_paid=(
                SELECT IFNULL(SUM(paym_amount),0) 
                FROM pos_payment_collection 
                WHERE paym_customer=cust_id 
                    AND paym_type='CREDIT' 
                    AND paym_trans IS NULL
            )
        WHERE cust_id=@id`)

customer.register("customer_update_sales",
    `UPDATE pos_archive_customer SET 
        cust_sales=(
                SELECT IFNULL(SUM(trns_net),0) 
                FROM pos_sales_transaction 
                WHERE trns_customer=cust_id
            )
        WHERE cust_id=@id`)

module.exports = customer