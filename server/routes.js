
const purchase = require('./src/feature/purchase/purchase.route')
const receivable = require('./src/feature/receivable/receivable.route')
const delivery = require('./src/feature/delivery/delivery.route')
const receipt = require('./src/feature/receipt/receipt.route')
const inventory = require('./src/feature/inventory/inventory.route')

const category = require('./src/library/category/category.route')
const masterlist = require('./src/library/masterlist/masterlist.route')
const option = require('./src/library/option/option.route')
const variant = require('./src/library/variant/variant.route')
const supplier = require('./src/library/supplier/supplier.route')
const customer = require('./src/library/customer/customer.route')
const branch = require('./src/library/branch/branch.route')

const account = require('./src/system/account/account.route')
const schedule = require('./src/system/schedule/schedule.route')

const complex = require('./src/complex/complex.route')

module.exports = {
    purchase,
    receivable,
    delivery,
    receipt,
    inventory,
    category,
    masterlist,
    option,
    variant,
    supplier,
    customer,
    branch,
    account,
    schedule,
    complex
}