const { Table } = require("../../utilities/builder.utility")

const transfer = new Table("pos_transfer_request", {
    id: 'trnr_id',
    time: 'trnr_time',
    source: 'trnr_source',
    destination: 'trnr_store',
    category: 'trnr_category',
    date: 'trnr_date',
    status: 'trnr_status',
    count: 'trnr_count',
    value: 'trnr_value',
    srp: 'trnr_srp',
    arrive: 'trnr_arrive'
})

transfer.register("transfer_update_transmit",
    `UPDATE pos_transfer_request SET 
        trnr_count=(
                SELECT IFNULL(SUM(trni_quantity),0) 
                FROM pos_transfer_receipt 
                WHERE trni_transfer=trnr_id
            ),
        trnr_value=(
                SELECT IFNULL(SUM(trni_quantity * trni_baseprice),0) 
                FROM pos_transfer_receipt 
                WHERE trni_transfer=trnr_id
            ),
        trnr_srp=(
                SELECT IFNULL(SUM(trni_quantity * trni_pricing),0) 
                FROM pos_transfer_receipt 
                WHERE trni_transfer=trnr_id
            ),
        trnr_arrive=(
                SELECT IFNULL(SUM(invt_received),0) 
                FROM pos_stock_inventory 
                WHERE invt_transfer=trnr_id 
                    AND invt_acquisition='TRANSFER'
            )
        WHERE trnr_id=@id`)

module.exports = transfer