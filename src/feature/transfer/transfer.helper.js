const { Table } = require("../../utilities/builder.utility")

const transfer = new Table("pos_transfer_request", {
    id: 'trnr_id',
    time: 'trnr_time',
    source: 'trnr_source',
    destination: 'trnr_store',
    category: 'trnr_category',
    date: 'trnr_date',
    arrival: 'trnr_arrival',
    status: 'trnr_status',
    count: 'trnr_count',
    value: 'trnr_value',
})

transfer.register("running_via_transfer_receipt",
    `UPDATE pos_transfer_request SET 
        trnr_count=(SELECT IFNULL(COUNT(*),0) FROM pos_transfer_receipt WHERE trni_transfer=trnr_id),
        trnr_value=(SELECT IFNULL(SUM(trni_quantity * trni_pricing),0) FROM pos_transfer_receipt WHERE trni_transfer=trnr_id)
            WHERE trnr_id=@id`)

module.exports = transfer