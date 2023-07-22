const handler = require("express-async-handler")
const { Query } = require("../utilities/builder.utility")
const { mysqlpool, proceed } = require("../../src/utilities/callback.utility")
const getreceipt = require("../feature/receipt/receipt.helper")
const getdelivery = require("../feature/delivery/delivery.helper")
const getreceivable = require("../feature/receivable/receivable.helper")
const getpurchase = require("../feature/purchase/purchase.helper")
const getinventory = require("../feature/inventory/inventory.helper")
const gettransfer = require("../feature/transfer/transfer.helper")
const gettransmit = require("../feature/transmit/transmit.helper")
const gettransaction = require("../cashier/transaction/transaction.helper")
const getdispensing = require("../cashier/dispensing/dispensing.helper")
const getpayment = require("../cashier/payment/payment.helper")
const getcredit = require("../cashier/credit/credit.helper")
const getrefund = require("../cashier/refund/refund.helper")
const getreturned = require("../cashier/returned/returned.helper")
const getcustomer = require("../library/customer/customer.helper")
const getreimburse = require("../cashier/reimburse/reimburse.helper")

function q(object) {
    return new Query(object.alias, object.value)
}

const op = { add: "+", min: "-", mul: "*", div: "/" }

const sqlCreateReceipt = handler(async (req, res) => {
    mysqlpool.getConnection((err, con) => {
        if (err) return res.status(401).json(force(err))
        con.beginTransaction(async (err) => {
            if (err) return err

            let createReceipt = await new Promise(async (resolve, reject) => {
                const builder = getreceipt.insert(req.body)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "createReceipt",
                        insertResult: { id: ans.insertId ? ans.insertId : undefined }
                    })
                })
            })

            let runningDelivery = await new Promise(async (resolve, reject) => {
                const sql = getdelivery
                    .statement("delivery_update_receipt")
                    .inject({
                        id: req.body.delivery
                    })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "runningDelivery",
                        updateResult: { id: req.body.delivery, alterated: ans.affectedRows }
                    })
                })
            })

            let runningReceivable = await new Promise(async (resolve, reject) => {
                const sql = getreceivable
                    .statement("receivable_update_delivery")
                    .inject({
                        remaining: req.body.remaining,
                        id: req.body.receivable
                    })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "runningReceivable",
                        updateResult: { id: req.body.receivable, alterated: ans.affectedRows }
                    })
                })

                // let data = {
                //     balance: req.body.remaining,
                //     received: req.body.receiving,
                //     id: req.body.receivable
                // }
                // const builder = getreceivable.update(data)
                // await con.query(builder.sql, builder.arr, async (err, ans) => {
                //     if (err) con.rollback(() => reject(err))
                //     resolve({ occurence: "updateReceivable", updateResult: { id: data.id, alterated: ans.affectedRows } })
                // })
            })

            let runningPurchase = await new Promise(async (resolve, reject) => {
                const sql = getpurchase
                    .statement("purchase_update_receivable")
                    .inject({
                        id: req.body.purchase
                    })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "runningPurchase",
                        updateResult: { id: req.body.purchase, alterated: ans.affectedRows }
                    })
                })
            })

            let statusPurchase = await new Promise(async (resolve, reject) => {
                const sql = getpurchase
                    .statement("purchase_update_status")
                    .inject({
                        id: req.body.purchase
                    })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "statusPurchase",
                        updateResult: { id: req.body.purchase, alterated: ans.affectedRows }
                    })
                })
            })

            let createInventory = await new Promise(async (resolve, reject) => {
                let data = {
                    product: req.body.product,
                    variant: req.body.variant,
                    category: req.body.purchase_category,
                    delivery: req.body.delivery,
                    purchase: req.body.purchase,
                    receipt: receipt.insertResult.id,
                    supplier: req.body.supplier,
                    store: req.body.store,
                    received: req.body.quantity,
                    stocks: req.body.quantity,
                    cost: req.body.costing,
                    base: req.body.pricing,
                    price: req.body.pricing,
                    acquisition: "PROCUREMENT"
                }
                const builder = getinventory.insert(data)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "createInventory",
                        insertResult: { id: ans.insertId ? ans.insertId : undefined }
                    })
                })
            })
            let result = {
                createReceipt,
                runningDelivery,
                runningReceivable,
                runningPurchase,
                statusPurchase,
                createInventory,
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

const sqlCreateTransmit = handler(async (req, res) => {
    mysqlpool.getConnection((err, con) => {
        if (err) return res.status(401).json(force(err))
        con.beginTransaction(async (err) => {
            if (err) return err
            let transmit = await new Promise(async (resolve, reject) => {
                const builder = gettransmit.insert(req.body)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "transmit", insertResult: { id: ans.insertId ? ans.insertId : undefined } })
                })
            })

            let running_transfer = await new Promise(async (resolve, reject) => {
                const sql = gettransfer
                    .statement("transfer_update_transmit")
                    .inject({
                        id: req.body.transfer
                    })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "running transfer", updateResult: { id: req.body.transfer, alterated: ans.affectedRows } })
                })
            })

            let running_source = await new Promise(async (resolve, reject) => {
                const sql = getinventory
                    .statement("inventory_update_transfer")
                    .inject({
                        id: req.body.item,
                        operator: op.min,
                        qty: req.body.quantity
                    })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "running source", updateResult: { id: req.body.item, alterated: ans.affectedRows } })
                })
            })

            let destination_inventory = await new Promise(async (resolve, reject) => {
                let data = {
                    product: req.body.product,
                    variant: req.body.variant,
                    category: req.body.category,
                    delivery: req.body.delivery,
                    purchase: req.body.purchase,
                    supplier: req.body.supplier,
                    store: req.body.destination,
                    received: req.body.quantity,
                    stocks: req.body.quantity,
                    cost: req.body.cost,
                    base: req.body.pricing,
                    price: req.body.pricing,
                    acquisition: "TRANSMIT",
                    source: req.body.source,
                    transfer: req.body.transfer,
                    transmit: transmit.insertResult.id
                }
                const builder = getinventory.insert(data)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "destination inventory", insertResult: { id: ans.insertId ? ans.insertId : undefined } })
                })
            })

            let result = { transmit, running_transfer, running_source, destination_inventory, data: req.body }
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

const sqlDeleteTransmit = handler(async (req, res) => {
    mysqlpool.getConnection((err, con) => {
        if (err) return res.status(401).json(force(err))
        con.beginTransaction(async (err) => {
            if (err) return err

            let destination_inventory = await new Promise(async (resolve, reject) => {
                let data = { transmit: req.body.id }
                const builder = getinventory.remove(data)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "destination inventory", deleteResult: { id: req.body.id } })
                })
            })

            let transmit = await new Promise(async (resolve, reject) => {
                let data = { id: req.body.id }
                const builder = gettransmit.delete(data)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "transmit", insertResult: { id: ans.insertId ? ans.insertId : undefined } })
                })
            })

            let running_transfer = await new Promise(async (resolve, reject) => {
                const sql = gettransfer
                    .statement("transfer_update_transmit")
                    .inject({
                        id: req.body.transfer
                    })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "running transfer", updateResult: { id: req.body.transfer, alterated: ans.affectedRows } })
                })
            })

            let running_source = await new Promise(async (resolve, reject) => {
                const sql = getinventory
                    .statement("inventory_update_transfer")
                    .inject({
                        id: req.body.item,
                        operator: op.add,
                        qty: req.body.quantity
                    })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "running source", updateResult: { id: req.body.item, alterated: ans.affectedRows } })
                })
            })

            let result = { transmit, running_transfer, running_source, destination_inventory, data: req.body }
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

const sqlCreateTransaction = handler(async (req, res) => {
    mysqlpool.getConnection((err, con) => {
        if (err) return res.status(401).json(force(err))
        con.beginTransaction(async (err) => {
            if (err) return err

            let transaction = await new Promise(async (resolve, reject) => {
                const builder = gettransaction.insert(req.body.transaction)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "transaction", insertResult: { id: ans.insertId ? ans.insertId : undefined } })
                })
            })

            let dispensing = await Promise.all(req.body.dispensing
                ?.map(async (dispense) => {
                    let result = await new Promise(async (resolve, reject) => {
                        const builder = getdispensing.insert(dispense)
                        await con.query(builder.sql, builder.arr, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({ occurence: "dispensing", insertResult: { id: ans.insertId ? ans.insertId : undefined } })
                        })
                    })

                    let running_inventory = await new Promise(async (resolve, reject) => {
                        const sql = getinventory
                            .statement("inventory_update_dispensing")
                            .inject({
                                id: dispense.item,
                                operator: op.min,
                                qty: dispense.purchase
                            })
                        await con.query(sql, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({ occurence: "running inventory", updateResult: { id: dispense.item, alterated: ans.affectedRows } })
                        })
                    })

                    return { result, running_inventory }
                })
            )

            let payment = await Promise.all(req.body.payment
                ?.map(async (pay) => {
                    let result = await new Promise(async (resolve, reject) => {
                        const builder = getpayment.insert(pay)
                        await con.query(builder.sql, builder.arr, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({ occurence: "sales payment", insertResult: { id: ans.insertId ? ans.insertId : undefined } })
                        })
                    })
                    return result
                })
            )

            let credit = await Promise.all(req.body.credit
                ?.map(async (cred) => {
                    let result = await new Promise(async (resolve, reject) => {
                        const builder = getcredit.insert(cred)
                        await con.query(builder.sql, builder.arr, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({ occurence: "credit", insertResult: { id: ans.insertId ? ans.insertId : undefined } })
                        })
                    })

                    if (cred?.credit_payment?.code) {
                        var credit_partial = await new Promise(async (resolve, reject) => {
                            const builder = getpayment.insert(cred?.credit_payment)
                            await con.query(builder.sql, builder.arr, async (err, ans) => {
                                if (err) con.rollback(() => reject(err))
                                resolve({ occurence: "credit payment", insertResult: { id: ans.insertId ? ans.insertId : undefined } })
                            })
                        })
                    }

                    let running_customer = await new Promise(async (resolve, reject) => {
                        const sql = getcustomer
                            .statement("running_via_credit")
                            .inject({
                                id: cred.creditor,
                            })
                        await con.query(sql, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({ occurence: "running customer", updateResult: { id: cred.creditor, alterated: ans.affectedRows } })
                        })
                    })

                    return { result, running_customer, credit_partial }
                })
            )

            let result = { transaction, dispensing, payment, credit, data: req.body }
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

const sqlCreateReturn = handler(async (req, res) => {
    mysqlpool.getConnection((err, con) => {
        if (err) return res.status(401).json(force(err))
        con.beginTransaction(async (err) => {
            if (err) return err

            let transaction = await new Promise(async (resolve, reject) => {
                const builder = gettransaction.update(req.body.transaction)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "transaction", updateResult: { id: req.body.transaction.id } })
                })
            })

            let refund = await new Promise(async (resolve, reject) => {
                const builder = getrefund.insert(req.body.refund)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "refund", insertResult: { id: ans.insertId ? ans.insertId : undefined } })
                })
            })

            let dispensing = await Promise.all(req.body.dispensing
                ?.map(async (dispense) => {
                    let result = await new Promise(async (resolve, reject) => {
                        const builder = getdispensing.update(dispense)
                        await con.query(builder.sql, builder.arr, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({ occurence: "dispensing", updateResult: { id: dispense.id } })
                        })
                    })

                    let running_inventory = await new Promise(async (resolve, reject) => {
                        const sql = getinventory
                            .statement("inventory_update_dispensing")
                            .inject({
                                id: dispense.item,
                                operator: op.add,
                                qty: dispense.qty
                            })
                        await con.query(sql, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({ occurence: "running inventory", updateResult: { id: dispense.item, alterated: ans.affectedRows } })
                        })
                    })

                    return { result, running_inventory }
                })
            )

            let returned = await Promise.all(req.body.returned
                ?.map(async (returns) => {
                    let result = await new Promise(async (resolve, reject) => {
                        let data = {
                            ...returns,
                            refund: refund.insertResult.id
                        }
                        const builder = getreturned.insert(data)
                        await con.query(builder.sql, builder.arr, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({ occurence: "returned", insertResult: { id: ans.insertId ? ans.insertId : undefined } })
                        })
                    })

                    return result
                })
            )

            if (req.body.credit) {
                var credit = await new Promise(async (resolve, reject) => {
                    const builder = getcredit.update(req.body.credit)
                    await con.query(builder.sql, builder.arr, async (err, ans) => {
                        if (err) con.rollback(() => reject(err))
                        resolve({ occurence: "credit", updateResult: { id: req.body.credit.id } })
                    })
                })

                var running_customer = await new Promise(async (resolve, reject) => {
                    const sql = getcustomer
                        .statement("running_via_credit")
                        .inject({
                            id: req.body.credit.creditor,
                        })
                    await con.query(sql, async (err, ans) => {
                        if (err) con.rollback(() => reject(err))
                        resolve({ occurence: "running customer", updateResult: { id: req.body.credit.creditor, alterated: ans.affectedRows } })
                    })
                })
            }

            let reimburse = await new Promise(async (resolve, reject) => {
                let data = {
                    ...req.body.reimburse,
                    refund: refund.insertResult.id
                }
                const builder = getreimburse.insert(data)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "reimburse", insertResult: { id: ans.insertId ? ans.insertId : undefined } })
                })
            })

            if (req.body.payment) {
                var payment = await Promise.all(req.body.payment
                    ?.map(async (pay) => {
                        let result = await new Promise(async (resolve, reject) => {
                            const builder = getpayment.update(pay)
                            await con.query(builder.sql, builder.arr, async (err, ans) => {
                                if (err) con.rollback(() => reject(err))
                                resolve({ occurence: "payment", updateResult: { id: pay.id } })
                            })
                        })
                        return result
                    })
                )
            }

            let result = { transaction, refund, dispensing, returned, credit, running_customer, reimburse, payment, data: req.body }
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
    sqlCreateReceipt,
    sqlCreateTransmit,
    sqlCreateTransaction,
    sqlCreateReturn,
}