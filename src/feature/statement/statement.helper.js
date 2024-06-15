const { Table } = require("../../utilities/builder.utility")

const statement = new Table("pos_income_statement", {
    id: 'incm_id',
    time: 'incm_time',
    beg: 'incm_beg',
    end: 'incm_end',
    month: 'incm_month',
    year: 'incm_year',
    noofdays: 'incm_noofdays',
    branch: 'incm_store',
    category: 'incm_category',
    data: 'incm_data',
    inventory: 'incm_inventory',
    by: 'incm_by',
})

module.exports = statement