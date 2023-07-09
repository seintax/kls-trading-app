
const category = require('./src/library/category/category.route')
const masterlist = require('./src/library/masterlist/masterlist.route')
const option = require('./src/library/option/option.route')
const variant = require('./src/library/variant/variant.route')

const account = require('./src/system/account/account.route')
const schedule = require('./src/system/schedule/schedule.route')

module.exports = {
    account,
    category,
    schedule,
    masterlist,
    option,
    variant,
}