const router = require('express').Router()
const service = require('./reports.query')
const { secure } = require('../../../res/secure/secure')

router.get('/reports/weekly', secure, service._weekly)

module.exports = router