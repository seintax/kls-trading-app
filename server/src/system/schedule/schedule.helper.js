const { Table } = require("../../utilities/builder.utility")

const schedule = new Table("pos_shift_schedule", {
    id: 'shft_id',
    account: 'shft_account',
    start: 'shft_start',
    beg_cash: 'shft_beg_cash',
    status: 'shft_status',
    close: 'shft_close',
    end_cash: 'shft_end_cash',
    total_hrs: 'shft_total_hrs',
})

module.exports = schedule