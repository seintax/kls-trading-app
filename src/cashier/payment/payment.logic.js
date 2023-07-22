const handler = require("express-async-handler")
const { mysqlpool, proceed } = require("../../utilities/callback.utility")
const getservice = require("./payment.helper")
const getcheque = require("../cheque/cheque.helper")

const sqlChequePayment = handler(async (req, res) => {
    mysqlpool.getConnection((err, con) => {
        if (err) return res.status(401).json(force(err))
        con.beginTransaction(async (err) => {
            if (err) return err

            let payment = await new Promise(async (resolve, reject) => {
                const builder = getservice.update(req.body.payment)
                await con.query(builder.sql, builder.arr, async (err, ans) => {
                    if (err) con.rollback(() => reject(err))
                    resolve({
                        occurence: "updateChequeStatus",
                        updateResult: { id: req.body.payment.id }
                    })
                })
            })

            if (req.body?.cheque?.payment) {
                var cheque = await new Promise(async (resolve, reject) => {
                    const builder = getcheque.insert(req.body.cheque)
                    await con.query(builder.sql, builder.arr, async (err, ans) => {
                        if (err) con.rollback(() => reject(err))
                        resolve({
                            occurence: "createChequeReplacement",
                            insertResult: { id: ans.insertId ? ans.insertId : undefined }
                        })
                    })
                })
            }

            let result = {
                payment,
                cheque,
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
    sqlChequePayment
}