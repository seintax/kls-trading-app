const { Table } = require("../../utilities/builder.utility")

const branch = new Table("pos_archive_store", {
    id: 'stre_id',
    code: 'stre_code',
    name: 'stre_name',
    address: 'stre_address',
    contact: 'stre_contact',
    status: 'stre_status',
})

module.exports = branch