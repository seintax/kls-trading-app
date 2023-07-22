const handler = require("express-async-handler")
const { mysqlpool, proceed } = require("../../utilities/callback.utility")
const getservice = require("./adjustment.helper")
const getinventory = require("../inventory/inventory.helper")

const sqlAdjustment = handler(async (req, res) => {
    mysqlpool.getConnection((err, con) => {
        if (err) return res.status(401).json(force(err))
        con.beginTransaction(async (err) => {
            if (err) return err

            var adjustment
            if (!req.body.adjustment?.id) {
                adjustment = await new Promise(async (resolve, reject) => {
                    const builder = getservice.insert(req.body.adjustment)
                    await con.query(builder.sql, builder.arr, async (err, ans) => {
                        if (err) con.rollback(() => reject(err))
                        resolve({
                            occurence: "createAdjustment",
                            insertResult: { id: ans.insertId ? ans.insertId : undefined }
                        })
                    })
                })
            }

            if (req.body.adjustment.id) {
                if (req.body.adjustment.delete) {
                    adjustment = await new Promise(async (resolve, reject) => {
                        const builder = getservice.delete(req.body.adjustment)
                        await con.query(builder.sql, builder.arr, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({
                                occurence: "deleteAdjustment",
                                deleteResult: { id: req.body.adjustment.id }
                            })
                        })
                    })
                }
            }

            let runningInventory = await new Promise(async (resolve, reject) => {
                let id = req.body.inventory.id
                let sqlStatement = req.body.inventory.operator === "+"
                    ? "inventory_update_addition_adjustment"
                    : "inventory_update_deduction_adjustment"
                const sql = getinventory
                    .statement(sqlStatement)
                    .inject({
                        id: id,
                        operator: req.body.inventory.operator,
                        qty: req.body.inventory.quantity
                    })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "runningInventory",
                        updateResult: { id: id, alterated: ans.affectedRows }
                    })
                })
            })

            let result = {
                adjustment,
                runningInventory,
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
    sqlAdjustment
}