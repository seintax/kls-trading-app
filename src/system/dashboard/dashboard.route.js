const router = require('express').Router()
const service = require('./dashboard.query')
const { secure } = require('../../../res/secure/secure')

router.get('/dashboard/weekly', secure, service._weekly)
router.get('/dashboard/weeklygrosssales', secure, service.weekly_gross_sales)
router.get('/dashboard/weeklycreditsales', secure, service.weekly_credit_sales)
router.get('/dashboard/weeklyrefunds', secure, service.weekly_refunds)
router.get('/dashboard/weeklydiscounts', secure, service.weekly_discounts)
router.get('/dashboard/weeklynetsales', secure, service.weekly_net_sales)
router.get('/dashboard/weeklygrossprofit', secure, service.weekly_gross_profit)
router.get('/dashboard/weeklycollectibles', secure, service.weekly_collectibles)
router.get('/dashboard/weeklycreditcollection', secure, service.weekly_credit_collection)
router.get('/dashboard/collectibles', secure, service.collectibles)

module.exports = router