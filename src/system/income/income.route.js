const router = require('express').Router()
const service = require('./income.query')
const { secure } = require('../../../res/secure/secure')

router.get('/income/sales', secure, service.sales)
router.get('/income/purchases', secure, service.purchases)
router.get('/income/goodsin', secure, service.goods_in)
router.get('/income/goodsout', secure, service.goods_out)
router.get('/income/expenses', secure, service.expenses)

module.exports = router