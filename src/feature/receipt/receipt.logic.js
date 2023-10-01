const handler = require("express-async-handler")
const { mysqlpool, proceed } = require("../../utilities/callback.utility")
const getservice = require("./receipt.helper")
const getdelivery = require("../delivery/delivery.helper")
const getpurchase = require("../purchase/purchase.helper")
const getreceivable = require("../receivable/receivable.helper")
const getinventory = require("../inventory/inventory.helper")

const sqlReceipt = handler(async (req, res) => {
    mysqlpool.getConnection((err, con) => {
        if (err) return res.status(401).json(force(err))
        con.beginTransaction(async (err) => {
            if (err) return err
            var receipt
            if (!req.body.receipt?.id) {
                receipt = await new Promise(async (resolve, reject) => {
                    const builder = getservice.insert(req.body.receipt)
                    await con.query(builder.sql, builder.arr, async (err, ans) => {
                        if (err) con.rollback(() => reject(err))
                        resolve({
                            occurence: "createReceipt",
                            insertResult: { id: ans.insertId ? ans.insertId : undefined }
                        })
                    })
                })
            }

            if (req.body.receipt.id) {
                if (!req.body.receipt?.delete) {
                    receipt = await new Promise(async (resolve, reject) => {
                        const builder = getservice.update(req.body.receipt)
                        await con.query(builder.sql, builder.arr, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({
                                occurence: "updateReciept",
                                updateResult: { id: req.body.receipt.id }
                            })
                        })
                    })
                }

                if (req.body.receipt.delete) {
                    receipt = await new Promise(async (resolve, reject) => {
                        const builder = getservice.delete(req.body.receipt)
                        await con.query(builder.sql, builder.arr, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({
                                occurence: "deleteReciept",
                                deleteResult: { id: req.body.receipt.id }
                            })
                        })
                    })
                }
            }

            let runningDelivery = await new Promise(async (resolve, reject) => {
                let id = req.body.delivery.id
                const sql = getdelivery
                    .statement("delivery_update_receipt")
                    .inject({ id: id })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "runningDelivery",
                        updateResult: { id: id, alterated: ans.affectedRows }
                    })
                })
            })

            let runningReceivable = await new Promise(async (resolve, reject) => {
                let id = req.body.receivable.id
                const sql = getreceivable
                    .statement("receivable_update_delivery")
                    .inject({
                        remaining: req.body.receivable.remaining,
                        id: id
                    })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "runningReceivable",
                        updateResult: { id: id, alterated: ans.affectedRows }
                    })
                })
            })

            let runningPurchase = await new Promise(async (resolve, reject) => {
                let id = req.body.purchase.id
                const sql = getpurchase
                    .statement("purchase_update_receivable")
                    .inject({ id: id })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "runningPurchase",
                        updateResult: { id: id, alterated: ans.affectedRows }
                    })
                })
            })

            let statusPurchase = await new Promise(async (resolve, reject) => {
                let id = req.body.purchase.id
                const sql = getpurchase
                    .statement("purchase_update_status")
                    .inject({ id: id })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "statusPurchase",
                        updateResult: { id: id, alterated: ans.affectedRows }
                    })
                })
            })

            let inventory = await new Promise(async (resolve, reject) => {
                if (!req.body.inventory.id) {
                    let data = {
                        ...req.body.inventory,
                        receipt: receipt.insertResult.id,
                    }
                    const builder = getinventory.insert(data)
                    await con.query(builder.sql, builder.arr, async (err, ans) => {
                        if (err) con.rollback(() => reject(err))
                        resolve({
                            occurence: "createInventory",
                            insertResult: { id: ans.insertId ? ans.insertId : undefined }
                        })
                    })
                }

                if (req.body.inventory.id) {
                    if (!req.body.inventory.delete) {
                        const builder = getinventory.update(req.body.inventory)
                        await con.query(builder.sql, builder.arr, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({
                                occurence: "updateInventory",
                                updateResult: { id: req.body.inventory.id }
                            })
                        })
                    }

                    if (req.body.inventory.delete) {
                        const builder = getinventory.delete(req.body.inventory)
                        await con.query(builder.sql, builder.arr, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({
                                occurence: "deleteInventory",
                                deleteResult: { id: req.body.inventory.id }
                            })
                        })
                    }
                }
            })

            let result = {
                receipt,
                runningDelivery,
                runningReceivable,
                runningPurchase,
                statusPurchase,
                inventory,
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
    sqlReceipt
}