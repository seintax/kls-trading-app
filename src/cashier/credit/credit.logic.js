const handler = require("express-async-handler")
const { mysqlpool, proceed } = require("../../utilities/callback.utility")
const getservice = require("./credit.helper")
const getpayment = require("../payment/payment.helper")
const getcustomer = require("../../library/customer/customer.helper")

const sqlSettleCredit = handler(async (req, res) => {
    mysqlpool.getConnection((err, con) => {
        con.beginTransaction(async (err) => {
            if (err) return err

            let credit = await new Promise(async (resolve, reject) => {
                const builder = getservice.update(req.body.credit)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "updateCredit",
                        updateResult: { id: req.body.credit.id }
                    })
                })
            })

            let outstanding = await new Promise(async (resolve, reject) => {
                const builder = getservice.insert(req.body.outstanding)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "createOutstandingCredit",
                        insertResult: { id: ans.insertId ? ans.insertId : undefined }
                    })
                })
            })

            let payments = await Promise.all(req.body.payment
                ?.map(async (pay) => {
                    let result = await new Promise(async (resolve, reject) => {
                        const builder = getpayment.insert(pay)
                        await con.query(builder.sql, builder.arr, async (err, ans) => {
                            if (err) con.rollback(() => reject(err))
                            resolve({
                                occurence: "creditPayment",
                                insertResult: { id: ans.insertId ? ans.insertId : undefined }
                            })
                        })
                    })
                    return result
                })
            )

            let runningCustomer = await new Promise(async (resolve, reject) => {
                let id = req.body.customer.id
                const sql = getcustomer
                    .statement("customer_update_credit")
                    .inject({
                        id: id,
                    })
                await con.query(sql, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "runningCustomer",
                        updateResult: { id: id, alterated: ans.affectedRows }
                    })
                })
            })

            let result = {
                credit,
                outstanding,
                payments,
                runningCustomer,
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
    sqlSettleCredit
}