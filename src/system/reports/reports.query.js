const handler = require("express-async-handler")
const { proceed, force, mysqlpool } = require("../../utilities/callback.utility")
const helper = require('./reports.helper')

const _weekly = handler(async (req, res) => {
    const sql = helper.weekly.inject({
        fr: req.query.fr,
        to: req.query.to
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({ data: ans }, req))
    })
})

module.exports = {
    _weekly
}