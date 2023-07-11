const my = require('../../res/data/mysql')
const handler = require("express-async-handler")

const force = (err) => {
    return { success: false, err: err }
}

const proceed = (json, req) => {
    if (req.auth) return { success: true, ...json, authorized: req?.auth?.id ? true : false }
    return { success: true, ...json }
}

const sqlerror = (err) => {
    return process.env.NODE_ENV === "development" ? err : {
        message: `SQL_${err.code}`,
        errno: err.errno,
        sqlState: err.sqlState,
        details: err
    }
}

const poolremove = handler(async (param, callback) => {
    my.pool.query(param.sql, param.arr, async (err, ans) => {
        if (err) return callback(sqlerror(err))
        return callback(null, { deleteResult: { id: param.id, deleted: ans.affectedRows } })
    })
})

const poolinject = handler(async (param, callback) => {
    my.pool.query(param.sql, param.arr, async (err, ans) => {
        if (err) return callback(sqlerror(err))
        return callback(null, { insertResult: { id: ans.insertId ? ans.insertId : undefined } })
    })
})

const poolalter = handler(async (param, callback) => {
    my.pool.query(param.sql, param.arr, async (err, ans) => {
        if (err) return callback(sqlerror(err))
        return callback(null, { updateResult: { id: param.id, alterated: ans.affectedRows } })
    })
})

const poolwrap = handler(async (param, callback) => {
    my.pool.query(param.sql, param.arr, async (err, ans) => {
        if (err) return callback(sqlerror(err))
        if (ans.length > 1) return callback({ err: "Expecting a single result." })
        return callback(null, { distinctResult: { distinct: ans.length === 1, data: param?.fnc(param.aka, ans) } })
    })
})

const poolarray = handler(async (param, callback) => {
    my.pool.query(param.sql, param.arr, async (err, ans) => {
        if (err) throw new Error(err)
        return callback(null, { recordCount: ans.length || 0, arrayResult: param?.fnc(param.aka, ans) })
    })
})

const mysqlpool = my.pool

module.exports = {
    force,
    proceed,
    poolinject,
    poolalter,
    poolremove,
    poolwrap,
    poolarray,
    mysqlpool
}