const mysql = require('mysql')

var hs = mysql.createPool({
    host: "srv547.hstgr.io",
    user: "u480442611_trading_root",
    password: "?sQOdM0u",
    database: "u480442611_trading_db",
    waitForConnections: true,
    multipleStatements: true,
    connectionLimit: 10,
    queueLimit: 0
})

hs.getConnection((err, con) => {
    if (err) {
        console.info(`\x1b[41m`, `ERROR`, '\x1b[0m', `Failed to load server @ hostinger.ph/mysql:production`)
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error(`\x1b[41m`, `ERROR`, '\x1b[0m', 'PROTOCOL_CONNECTION_LOST: Database connection was closed.\n')
        }
        else if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error(`\x1b[41m`, `ERROR`, '\x1b[0m', 'ER_CON_COUNT_ERROR: Database has too many connections.\n')
        }
        else if (err.code === 'ECONNREFUSED') {
            console.error(`\x1b[41m`, `ERROR`, '\x1b[0m', 'ECONNREFUSED: Database connection was refused.\n')
        }
        else {
            console.error(`\x1b[41m`, `ERROR`, '\x1b[0m', `${err.code}\n`)
        }
    }
    else {
        console.info(`\x1b[43m`, `CLOUD`, '\x1b[0m', `@ hostinger.ph/mysql.io\n`)
    }
    if (con) con.release()
    return
})

module.exports = hs
