const { cloud } = require("../../../res/data/mysql")
const router = require('express').Router()

router.post('/upload', async (req, res) => {
    let data = req.body?.data?.split("{_}")
    let batch = await Promise.all(data?.map(async sql => {
        let response = await new Promise((resolve, reject) => {
            cloud.query(sql, async (err, ans) => {
                if (err) return reject(err)
                resolve({ response: ans })
            })
        })
        return response
    }))
    return res.status(200).json({
        success: true,
        message: `${data.length} api calls have finished.`,
        response: batch,
    })
})

module.exports = router