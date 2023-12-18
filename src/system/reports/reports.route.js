const router = require('express').Router()
const service = require('./reports.query')
const { secure } = require('../../../res/secure/secure')

router.get('/reports/salesbyitem', secure, service.sales_by_item)
router.get('/reports/salesbycategory', secure, service.sales_by_category)
router.get('/reports/salesbycollection', secure, service.sales_collection)
router.get('/reports/salessummary', secure, service.sales_summary)
router.get('/reports/expenses', secure, service.expenses)
router.get('/reports/expenses', secure, service.expenses)
router.get('/reports/expensessummary', secure, service.expenses_summary)
router.get('/reports/cashiersummary', secure, service.cashier_summary)
router.get('/reports/inventoryvaluation', secure, service.inventory_valuation)

module.exports = router