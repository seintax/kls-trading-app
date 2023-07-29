const router = require('express').Router()
const service = require('./reports.query')
const { secure } = require('../../../res/secure/secure')

router.get('/reports/salesbyitem', secure, service.sales_by_item)
router.get('/reports/salesbycategory', secure, service.sales_by_category)
router.get('/reports/salesbycollection', secure, service.sales_collection)
router.get('/reports/salessummary', secure, service.sales_summary)
router.get('/reports/expenses', secure, service.expenses)

module.exports = router