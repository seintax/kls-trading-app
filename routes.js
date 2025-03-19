
const transaction = require('./src/cashier/transaction/transaction.route')
const dispensing = require('./src/cashier/dispensing/dispensing.route')
const credit = require('./src/cashier/credit/credit.route')
const payment = require('./src/cashier/payment/payment.route')
const cheque = require('./src/cashier/cheque/cheque.route')
const refund = require('./src/cashier/refund/refund.route')
const returned = require('./src/cashier/returned/returned.route')
const reimburse = require('./src/cashier/reimburse/reimburse.route')

const purchase = require('./src/feature/purchase/purchase.route')
const receivable = require('./src/feature/receivable/receivable.route')
const delivery = require('./src/feature/delivery/delivery.route')
const receipt = require('./src/feature/receipt/receipt.route')
const inventory = require('./src/feature/inventory/inventory.route')
const price = require('./src/feature/price/price.route')
const adjustment = require('./src/feature/adjustment/adjustment.route')
const transfer = require('./src/feature/transfer/transfer.route')
const transmit = require('./src/feature/transmit/transmit.route')

const category = require('./src/library/category/category.route')
const masterlist = require('./src/library/masterlist/masterlist.route')
const option = require('./src/library/option/option.route')
const variant = require('./src/library/variant/variant.route')
const inclusion = require('./src/library/inclusion/inclusion.route')
const supplier = require('./src/library/supplier/supplier.route')
const customer = require('./src/library/customer/customer.route')
const branch = require('./src/library/branch/branch.route')

const account = require('./src/system/account/account.route')
const schedule = require('./src/system/schedule/schedule.route')
const expenses = require('./src/system/expenses/expenses.route')
const permission = require('./src/system/permission/permission.route')
const roles = require('./src/system/roles/roles.route')
const config = require('./src/system/config/config.route')

const complex = require('./src/complex/complex.route')
const reports = require('./src/system/reports/reports.route')
const income = require('./src/system/income/income.route')
const statement = require("./src/feature/statement/statement.route")
const prints = require("./src/feature/prints/prints.route")
const dashboard = require('./src/system/dashboard/dashboard.route')
const migrate = require('./src/system/migrate/migrate.route')
const test = require('./src/system/test/test.route')
const notification = require("./src/system/notification/notification.route")
const database = require("./src/system/database/database.route")

module.exports = {
    transaction,
    dispensing,
    credit,
    payment,
    cheque,
    refund,
    returned,
    reimburse,
    purchase,
    receivable,
    delivery,
    receipt,
    inventory,
    price,
    adjustment,
    transfer,
    transmit,
    category,
    masterlist,
    option,
    variant,
    inclusion,
    supplier,
    customer,
    branch,
    account,
    schedule,
    expenses,
    permission,
    roles,
    config,
    complex,
    reports,
    income,
    statement,
    prints,
    dashboard,
    notification,
    migrate,
    test,
    database
}