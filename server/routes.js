
const category = require('./src/library/category/category.route')

const account = require('./src/system/account/account.route')
const schedule = require('./src/system/schedule/schedule.route')

module.exports = {
    account,
    category,
    schedule,
}