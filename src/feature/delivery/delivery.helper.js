const { Table } = require("../../utilities/builder.utility")

const delivery = new Table("pos_delivery_request", {
    id: 'dlvr_id',
    time: 'dlvr_time',
    supplier: 'dlvr_supplier',
    refcode: 'dlvr_refcode',
    date: 'dlvr_date',
    remarks: 'dlvr_remarks',
    count: 'dlvr_count',
    value: 'dlvr_value',
    by: 'dlvr_by',
    store: 'dlvr_store',
}, [
    {
        key: "dlvr_supplier",
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
    }
])

delivery.register("delivery_update_receipt",
    `UPDATE pos_delivery_request SET 
        dlvr_count=(
                SELECT IFNULL(SUM(rcpt_quantity),0) 
                FROM pos_delivery_receipt 
                WHERE rcpt_delivery=dlvr_id
            ),
        dlvr_value=(
                SELECT IFNULL(SUM(rcpt_quantity * rcpt_pricing),0) 
                FROM pos_delivery_receipt 
                WHERE rcpt_delivery=dlvr_id
            )
        WHERE dlvr_id=@id`)

module.exports = delivery