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

module.exports = transfer