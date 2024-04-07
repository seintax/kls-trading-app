const router = require('express').Router()
const service = require('./migrate.query')
const cloud = require("../../../res/data/cloud")

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

router.get('/cloud/tables', async (req, res) => {
    await service.showTables(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans || {},
        })
    })
})

router.get('/cloud/select', async (req, res) => {
    await service.selectTable(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans || {},
        })
    })
})

router.get('/cloud/paged', async (req, res) => {
    await service.pagedTable(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans || {},
        })
    })
})

router.get('/cloud/count', async (req, res) => {
    await service.countTable(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans.length === 1 ? ans[0] : ans,
        })
    })
})

router.post('/cloud/upload', async (req, res) => {
    try {
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
            message: `${data.length} api calls have been completely processed.`,
            response: `${batch.reduce((prev, curr) => prev + curr.response.affectedRows, 0)}/${batch.length} successful response.`,
        })
    }
    catch (err) {
        return res.status(200).json({
            success: false,
            message: "error",
            response: err,
        })
    }
})

module.exports = router