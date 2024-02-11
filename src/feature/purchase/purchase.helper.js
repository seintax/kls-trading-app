const { Table } = require("../../utilities/builder.utility")

const purchase = new Table("pos_purchase_order", {
    id: 'pord_id',
    time: 'pord_time',
    date: 'pord_date',
    supplier: 'pord_supplier',
    store: 'pord_store',
    category: 'pord_category',
    itemcount: 'pord_item_count',
    ordertotal: 'pord_order_total',
    requesttotal: 'pord_request_total',
    receivedtotal: 'pord_received_total',
    rawtotal: 'pord_raw_total',
    progress: 'pord_progress',
    status: 'pord_status',
    expected: 'pord_expected',
    by: 'pord_by',
}, [
    {
        key: "pord_supplier",
        reference: { table: "pos_archive_supplier", key: "supp_id" },
        include: {
            supplier_name: 'supp_name',
            supplier_address: 'supp_address',
            supplier_details: 'supp_details',
            supplier_telephone: 'supp_telephone',
            supplier_cellphone: 'supp_cellphone',
            supplier_email: 'supp_email',
            supplier_rating: 'supp_rating',
            supplier_status: 'supp_status',
        }
    },
    {
        key: "pord_by",
        reference: { table: "sys_account", key: "acct_id" },
        include: {
            account_name: 'acct_fullname',
            account_store: 'acct_store',
        }
    },
])

purchase.register("purchase_update_receivable",
    `UPDATE pos_purchase_order SET 
        pord_item_count=(
                SELECT IFNULL(COUNT(*),0) 
                FROM pos_purchase_receivable 
                WHERE rcvb_purchase=pord_id 
            ),
        pord_order_total=(
                SELECT IFNULL(SUM(rcvb_ordered),0) 
                FROM pos_purchase_receivable 
                WHERE rcvb_purchase=pord_id 
            ),
        pord_received_total=(
                SELECT IFNULL(SUM(rcvb_received),0) 
                FROM pos_purchase_receivable 
                WHERE rcvb_purchase=pord_id 
            ),  
        pord_raw_total=(
                SELECT IFNULL(SUM(rcvb_rawcost),0) 
                FROM pos_purchase_receivable 
                WHERE rcvb_purchase=pord_id 
            )
        WHERE pord_id=@id`)

purchase.register("purchase_update_status",
    `UPDATE pos_purchase_order SET 
        pord_request_total=(
                pord_order_total-pord_received_total
            ),
        pord_progress=CONCAT(
                pord_received_total, 
                '/', 
                pord_order_total
            ),
        pord_status=IF(
                pord_order_total=pord_received_total, 
                'CLOSED', 
                'PENDING'
            )    
        WHERE pord_id=@id`)

module.exports = purchase
