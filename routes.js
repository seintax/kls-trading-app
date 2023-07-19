
const transaction = require('./src/cashier/transaction/transaction.route')
const dispensing = require('./src/cashier/dispensing/dispensing.route')
const credit = require('./src/cashier/credit/credit.route')
const payment = require('./src/cashier/payment/payment.route')
const refund = require('./src/cashier/refund/refund.route')
const returned = require('./src/cashier/returned/returned.route')
const reimburse = require('./src/cashier/reimburse/reimburse.route')

const purchase = require('./src/feature/purchase/purchase.route')
const receivable = require('./src/feature/receivable/receivable.route')
const delivery = require('./src/feature/delivery/delivery.route')
const receipt = require('./src/feature/receipt/receipt.route')
const inventory = require('./src/feature/inventory/inventory.route')
const transfer = require('./src/feature/transfer/transfer.route')
const transmit = require('./src/feature/transmit/transmit.route')

const category = require('./src/library/category/category.route')
const masterlist = require('./src/library/masterlist/masterlist.route')
const option = require('./src/library/option/option.route')
const variant = require('./src/library/variant/variant.route')
const supplier = require('./src/library/supplier/supplier.route')
const customer = require('./src/library/customer/customer.route')
const branch = require('./src/library/branch/branch.route')

const account = require('./src/system/account/account.route')
const schedule = require('./src/system/schedule/schedule.route')
const expenses = require('./src/system/expenses/expenses.route')

const complex = require('./src/complex/complex.route')

module.exports = {
    transaction,
    dispensing,
    credit,
    payment,
    refund,
    returned,
    reimburse,
    purchase,
    receivable,
    delivery,
    receipt,
    inventory,
    transfer,
    transmit,
    category,
    masterlist,
    option,
    variant,
    supplier,
    customer,
    branch,
    account,
    schedule,
    expenses,
    complex
}