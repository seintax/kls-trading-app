const { Table } = require("../../utilities/builder.utility")

const masterlist = new Table("pos_stock_masterlist", {
    id: 'prod_id',
    name: 'prod_name',
    category: 'prod_category',
    status: 'prod_status',
})

module.exports = masterlist