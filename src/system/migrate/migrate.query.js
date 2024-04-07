const { cloud } = require('../../../res/data/mysql')
const table = require('./migrate.helper')

const showTables = async (param, callback) => {
    let sql = table.migrate.showTables
    cloud.query(sql, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const selectTable = async (param, callback) => {
    let sql = table.migrate.selectTable.replaceAll("@tableName", param.table)
    cloud.query(sql, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const pagedTable = async (param, callback) => {
    let sql = table.migrate.pagedTable.replaceAll("@tableName", param.table).replaceAll("@offset", param.offset).replaceAll("@limit", param.limit)
    cloud.query(sql, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const countTable = async (param, callback) => {
    let sql = table.migrate.countTable.replaceAll("@tableName", param.table)
    cloud.query(sql, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

module.exports = {
    showTables,
    selectTable,
    pagedTable,
    countTable,
}