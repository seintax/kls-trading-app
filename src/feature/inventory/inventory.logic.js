const handler = require("express-async-handler")
const { mysqlpool, proceed } = require("../../utilities/callback.utility")
const getbranch = require("./inventory.branch")
const gettransmit = require("../transmit/transmit.helper")
const gettransfer = require("../transfer/transfer.helper")

const sqlAcquire = handler(async (req, res) => {
    mysqlpool.getConnection((err, con) => {
        con.beginTransaction(async (err) => {
            if (err) return err
            let updateInventory = await new Promise(async (resolve, reject) => {
                const builder = getbranch.update(req.body.inventory)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "updateInventory", updateResult: { id: req.body.inventory.id } })
                })
            })

            let updateTransmit = await new Promise(async (resolve, reject) => {
                const builder = gettransmit.update(req.body.transmit)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "updateTransmit", updateResult: { id: req.body.transmit.id } })
                })
            })

            let runningTransfer = await new Promise(async (resolve, reject) => {
                const sql = gettransfer
                    .statement("transfer_update_transmit")
                    .inject({
                        id: req.body.transfer.id,
                    })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "runningTransfer", updateResult: { id: req.body.transfer.id, alterated: ans.affectedRows } })
                })
            })
            let result = {
                updateInventory,
                updateTransmit,
                runningTransfer,
                data: req.body
            }
            con.commit((err) => {
                if (err) con.rollback(() => {
                    con.release()
                    return res.status(401).json(force(err))
                })
                con.release()
                res.status(200).json(proceed(result, req))
            })
        })
    })
})

module.exports = {
    sqlAcquire
}