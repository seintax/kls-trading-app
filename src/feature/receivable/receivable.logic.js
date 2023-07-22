const handler = require("express-async-handler")
const { mysqlpool, proceed } = require("../../utilities/callback.utility")
const getservice = require("./receivable.helper")
const getpurchase = require("../purchase/purchase.helper")

const sqlReceivable = handler(async (req, res) => {
    mysqlpool.getConnection((err, con) => {
        con.beginTransaction(async (err) => {
            if (err) return err
            var receivable
            if (!req.body.receivable.id) {
                receivable = await new Promise(async (resolve, reject) => {
                    const builder = getservice.insert(req.body.receivable)
                    await con.query(builder.sql, builder.arr, async (err, ans) => {
                        if (err) con.rollback(() => reject(err))
                        resolve({
                            occurence: "createReceivable",
                            insertResult: { id: ans.insertId ? ans.insertId : undefined }
                        })
                    })
                })
            }

            if (req.body.receivable.id) {
                if (!req.body.receivable.delete) {
                    receivable = await new Promise(async (resolve, reject) => {
                        const builder = getservice.update(req.body.receivable)
                        await con.query(builder.sql, builder.arr, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({
                                occurence: "updateReceivable",
                                updateResult: { id: req.body.receivable.id }
                            })
                        })
                    })
                }

                if (req.body.receivable.delete) {
                    receivable = await new Promise(async (resolve, reject) => {
                        const builder = getservice.delete(req.body.receivable)
                        await con.query(builder.sql, builder.arr, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({
                                occurence: "deleteReceivable",
                                deleteResult: { id: req.body.receivable.id }
                            })
                        })
                    })
                }
            }

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

            let result = {
                receivable,
                runningPurchase,
                statusPurchase,
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
    sqlReceivable
}