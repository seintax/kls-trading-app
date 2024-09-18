const handler = require("express-async-handler")
const { mysqlpool, proceed } = require("../../utilities/callback.utility")
const getbranch = require("./inventory.branch")
const getinventory = require("./inventory.helper")
const gettransmit = require("../transmit/transmit.helper")
const gettransfer = require("../transfer/transfer.helper")

const sqlAcquire = handler(async (req, res) => {
    mysqlpool.getConnection((err, con) => {
        con.beginTransaction(async (err) => {
            if (err) return err
            let updateInventory = await new Promise(async (resolve, reject) => {
                const builder = getbranch.update(req.body.inventory)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => resolve(err))
                    resolve({ occurence: "updateInventory", updateResult: { id: req.body.inventory.id, ans } })
                })
            })

            let updateTransmit = await new Promise(async (resolve, reject) => {
                const builder = gettransmit.update(req.body.transmit)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => resolve(err))
                    resolve({ occurence: "updateTransmit", updateResult: { id: req.body.transmit.id, ans } })
                })
            })

            let runningTransfer = await new Promise(async (resolve, reject) => {
                const sql = gettransfer
                    .statement("transfer_update_transmit")
                    .inject({
                        id: req.body.transfer.id,
                    })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => resolve(err))
                    resolve({ occurence: "runningTransfer", updateResult: { id: req.body.transfer.id, ans } })
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



const sqlCancel = handler(async (req, res) => {
    mysqlpool.getConnection((err, con) => {
        con.beginTransaction(async (err) => {
            if (err) return err
            let updateDestinationInventory = await new Promise(async (resolve, reject) => {
                const builder = getbranch.update(req.body.destination)
                // console.info('updateDestinationInventory', builder.sql)
                // resolve(true)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "updateDestination", updateResult: { id: req.body.destination.id } })
                })
            })

            let updateTransmit = await new Promise(async (resolve, reject) => {
                const builder = gettransmit.update(req.body.transmit)
                // console.info('updateTransmit', builder.sql)
                // resolve(true)
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
                // console.info('runningTransfer', sql)
                // resolve(true)
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "runningTransfer", updateResult: { id: req.body.transfer.id, alterated: ans.affectedRows } })
                })
            })
            let updateSourceInventory = await new Promise(async (resolve, reject) => {
                let id = req.body.source.id
                const sql = getinventory
                    .statement("inventory_update_transfer")
                    .inject({
                        id: id,
                        operator: req.body.source.operator,
                        qty: req.body.source.quantity
                    })
                // console.info('updateSourceInventory', sql)
                // resolve(true)
                await con.query(sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "updateSource", updateResult: { id: req.body.source.id } })
                })
            })
            let result = {
                updateDestinationInventory,
                updateTransmit,
                runningTransfer,
                updateSourceInventory,
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
    sqlAcquire,
    sqlCancel,
}