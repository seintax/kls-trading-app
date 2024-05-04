const { Table } = require("../../utilities/builder.utility")

const variant = new Table("lib_variant", {
    id: 'vrnt_id',
    product: 'vrnt_product',
    category: 'vrnt_category',
    serial: 'vrnt_serial',
    option1: 'vrnt_option1',
    model: 'vrnt_model',
    option2: 'vrnt_option2',
    brand: 'vrnt_brand',
    option3: 'vrnt_option3',
    alert: 'vrnt_alert',
}, [
    {
        key: "vrnt_product",
        reference: { table: "pos_stock_masterlist", key: "prod_id" },
        include: {
            product_name: 'prod_name',
        }
    },
])

module.exports = variant