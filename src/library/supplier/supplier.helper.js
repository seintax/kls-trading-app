const { Table } = require("../../utilities/builder.utility")

const supplier = new Table("pos_archive_supplier", {
    id: 'supp_id',
    name: 'supp_name',
    address: 'supp_address',
    details: 'supp_details',
    telephone: 'supp_telephone',
    cellphone: 'supp_cellphone',
    email: 'supp_email',
    rating: 'supp_rating',
    status: 'supp_status',
})

module.exports = supplier