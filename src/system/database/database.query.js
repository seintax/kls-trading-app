const handler = require("express-async-handler")
const { mysqlpool, proceed, force } = require("../../utilities/callback.utility")


const getData = handler(async (req, res) => {
    const sql = `
        SELECT * 
        FROM ${req.query.tb} 
        WHERE ${req.query.tag}_id > ${req.query.max}
    `
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({ data: ans }, req))
    })
})

module.exports = {
    getData
}