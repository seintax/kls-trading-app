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

module.exports = customer