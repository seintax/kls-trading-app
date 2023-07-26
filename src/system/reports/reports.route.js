const router = require('express').Router()
const service = require('./reports.query')
const { secure } = require('../../../res/secure/secure')

router.get('/reports/weekly', secure, service._weekly)
router.get('/reports/weeklygrosssales', secure, service.weekly_gross_sales)
router.get('/reports/weeklyrefunds', secure, service.weekly_refunds)
router.get('/reports/weeklydiscounts', secure, service.weekly_discounts)
router.get('/reports/weeklynetsales', secure, service.weekly_net_sales)
router.get('/reports/weeklygrossprofit', secure, service.weekly_gross_profit)
router.get('/reports/weeklycollectibles', secure, service.weekly_collectibles)
router.get('/reports/collectibles', secure, service.collectibles)

module.exports = router