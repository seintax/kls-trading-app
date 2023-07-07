const my = require('../../res/data/mysql')
const handler = require("express-async-handler")

const proceed = (json) => {
    return { success: true, ...json }
}

const sqlerror = (err) => {
    return process.env.NODE_ENV === "development" ? err : {
        message: `SQL_${err.code}`,
        errno: err.errno,
        sqlState: err.sqlState
    }
}

const poolwrap = handler(async (param, callback) => {
    my.pool.query(param.sql, param.arr, async (err, ans) => {
        if (err) return callback(sqlerror(err))
        if (ans.length > 1) return callback({ err: "Expecting a single result." })
        return callback(null, { single: ans.length === 1, data: param?.fnc(ans) })
    })
})

const poolarray = handler(async (param, callback) => {
    my.pool.query(param.sql, param.arr, async (err, ans) => {
        if (err) throw new Error(err)
        return callback(null, param?.fnc(ans))
    })
})

module.exports = {
    proceed,
    poolwrap,
    poolarray
}