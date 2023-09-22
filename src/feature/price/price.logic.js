const handler = require("express-async-handler")
const { mysqlpool, proceed } = require("../../utilities/callback.utility")
const getservice = require("./price.helper")
const getinventory = require("../inventory/inventory.branch")

const sqlAdjustPrice = handler(async (req, res) => {
    mysqlpool.getConnection((err, con) => {
        con.beginTransaction(async (err) => {
            if (err) return err

            let price = await new Promise(async (resolve, reject) => {
                const builder = getservice.insert(req.body.price)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "createPrice",
                        createResult: { id: req.body.price.id }
                    })
                })
            })

            let inventory = await new Promise(async (resolve, reject) => {
                const builder = getinventory.update(req.body.inventory)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "updateInventory",
                        updateResult: { id: req.body.inventory.id }
                    })
                })
            })

            let result = {
                price,
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
    sqlAdjustPrice
}