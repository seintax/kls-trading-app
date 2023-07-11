const handler = require("express-async-handler")
const { mysqlpool, proceed } = require("../../src/utilities/callback.utility")
const getreceipt = require("../feature/receipt/receipt.helper")
const getdelivery = require("../feature/delivery/delivery.helper")
const getreceivable = require("../feature/receivable/receivable.helper")
const getpurchase = require("../feature/purchase/purchase.helper")
const getinventory = require("../feature/inventory/inventory.helper")

const sqlCreateReceipt = handler(async (req, res) => {
    mysqlpool.getConnection((err, con) => {
        if (err) return res.status(401).json(force(err))
        con.beginTransaction(async (err) => {
            if (err) return err
            let receipt = await new Promise(async (resolve, reject) => {
                const builder = getreceipt.insert(req.body)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "receipt", insertResult: { id: ans.insertId ? ans.insertId : undefined } })
                })
            })

            let delivery = await new Promise(async (resolve, reject) => {
                let data = {
                    count: req.body.receiving,
                    id: req.body.delivery
                }
                const builder = getdelivery.update(data)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "delivery", updateResult: { id: data.id, alterated: ans.affectedRows } })
                })
            })

            let receivable = await new Promise(async (resolve, reject) => {
                let data = {
                    balance: req.body.remaining,
                    received: req.body.receiving,
                    id: req.body.receivable
                }
                const builder = getreceivable.update(data)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "receivable", updateResult: { id: data.id, alterated: ans.affectedRows } })
                })
            })

            let purchase = await new Promise(async (resolve, reject) => {
                let data = {
                    receivedtotal: req.body.receivedtotal,
                    id: req.body.purchase
                }
                const builder = getpurchase.update(data)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({ occurence: "purchase", updateResult: { id: data.id, alterated: ans.affectedRows } })
                })
            })

            let inventory = await new Promise(async (resolve, reject) => {
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
                    resolve({ occurence: "inventory", insertResult: { id: ans.insertId ? ans.insertId : undefined } })
                })
            })
            let result = { receipt, delivery, receivable, purchase, inventory }
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
    sqlCreateReceipt
}