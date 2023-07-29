const handler = require("express-async-handler")
const { mysqlpool, proceed } = require("../../utilities/callback.utility")
const getservice = require("./transmit.helper")
const gettransfer = require("../transfer/transfer.helper")
const getinventory = require("../inventory/inventory.helper")

const op = { add: "+", min: "-", mul: "*", div: "/" }

const sqlTransmit = handler(async (req, res) => {
    mysqlpool.getConnection((err, con) => {
        if (err) return res.status(401).json(force(err))
        con.beginTransaction(async (err) => {
            if (err) return err

            var transmit
            if (!req.body.transmit?.id) {
                transmit = await new Promise(async (resolve, reject) => {
                    const builder = getservice.insert(req.body.transmit)
                    await con.query(builder.sql, builder.arr, async (err, ans) => {
                        if (err) con.rollback(() => reject(err))
                        resolve({
                            occurence: "createTransmit",
                            insertResult: { id: ans.insertId ? ans.insertId : undefined }
                        })
                    })
                })
            }

            if (req.body.transmit.id) {
                if (!req.body.transmit?.delete) {
                    transmit = await new Promise(async (resolve, reject) => {
                        const builder = getservice.update(req.body.transmit)
                        await con.query(builder.sql, builder.arr, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({
                                occurence: "updateTransmit",
                                updateResult: { id: req.body.transmit.id }
                            })
                        })
                    })
                }

                if (req.body.transmit.delete) {
                    transmit = await new Promise(async (resolve, reject) => {
                        const builder = getservice.delete(req.body.transmit)
                        await con.query(builder.sql, builder.arr, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({
                                occurence: "deleteTransmit",
                                deleteResult: { id: req.body.transmit.id }
                            })
                        })
                    })
                }
            }

            let runningTransfer = await new Promise(async (resolve, reject) => {
                let id = req.body.transfer.id
                const sql = gettransfer
                    .statement("transfer_update_transmit")
                    .inject({ id: id })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "runningTransfer",
                        updateResult: { id: id, alterated: ans.affectedRows }
                    })
                })
            })

            let runningSource = await new Promise(async (resolve, reject) => {
                let id = req.body.source.id
                const sql = getinventory
                    .statement("inventory_update_transfer")
                    .inject({
                        id: id,
                        operator: req.body.source.operator,
                        qty: req.body.source.quantity
                    })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "runningSource",
                        updateResult: { id: id, alterated: ans.affectedRows }
                    })
                })
            })

            // let destination_inventory = await new Promise(async (resolve, reject) => {
            //     let data = {
            //         product: req.body.product,
            //         variant: req.body.variant,
            //         category: req.body.category,
            //         delivery: req.body.delivery,
            //         purchase: req.body.purchase,
            //         supplier: req.body.supplier,
            //         store: req.body.destination,
            //         received: req.body.quantity,
            //         stocks: req.body.quantity,
            //         cost: req.body.cost,
            //         base: req.body.pricing,
            //         price: req.body.pricing,
            //         acquisition: "TRANSMIT",
            //         source: req.body.source,
            //         transfer: req.body.transfer,
            //         transmit: transmit.insertResult.id
            //     }
            //     const builder = getinventory.insert(data)
            //     await con.query(builder.sql, builder.arr, async (err, ans) => {
            //         if (err) con.rollback(() => reject(err))
            //         resolve({ occurence: "destination inventory", insertResult: { id: ans.insertId ? ans.insertId : undefined } })
            //     })
            // })

            let destination = await new Promise(async (resolve, reject) => {
                if (!req.body.destination.id) {
                    let data = {
                        ...req.body.destination,
                        transmit: transmit.insertResult.id
                    }
                    const builder = getinventory.insert(data)
                    await con.query(builder.sql, builder.arr, async (err, ans) => {
                        if (err) con.rollback(() => reject(err))
                        resolve({
                            occurence: "createTransferInventory",
                            insertResult: { id: ans.insertId ? ans.insertId : undefined }
                        })
                    })
                }

                if (req.body.destination.id) {
                    if (!req.body.destination.delete) {
                        const builder = getinventory.update(req.body.destination)
                        await con.query(builder.sql, builder.arr, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({
                                occurence: "updateTransferInventory",
                                updateResult: { id: req.body.destination.id }
                            })
                        })
                    }

                    if (req.body.destination.delete) {
                        const builder = getinventory.delete(req.body.destination)
                        await con.query(builder.sql, builder.arr, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({
                                occurence: "deleteTransferInventory",
                                deleteResult: { id: req.body.destination.id }
                            })
                        })
                    }
                }
            })

            let result = {
                transmit,
                runningSource,
                runningTransfer,
                destination,
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
    sqlTransmit
}