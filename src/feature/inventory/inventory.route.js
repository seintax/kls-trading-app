const router = require('express').Router()
const service = require('./inventory.query')
const complex = require('./inventory.logic')
const { secure } = require('../../../res/secure/secure')

router
    .route('/inventory')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/inventory/branch', service._branch)
router.get('/inventory/id', secure, service._findone)
router.get('/inventory/search', secure, service._search)
router.post('/inventory/specify', service._specify)
// router.patch('/inventory/cancel', service.cancel)
router.get('/inventory/bystocks', service.byStocks)
router.get('/inventory/bystocksinfo', service.byStocksInfo)
router.get('/inventory/bytransmit', service.byTransmit)
router.get('/inventory/byproduct', service.byProduct)
router.get('/inventory/byitem', service.byItem)
router.get('/inventory/byreceipt', service.byReceipt)
router.get('/inventory/bystockrecord', service.byStockRecord)
router.get('/inventory/bypricecheck', service.byPriceCheck)

router.post('/inventory/sqlacquire', complex.sqlAcquire)
router.post('/inventory/sqlcancel', complex.sqlCancel)

module.exports = router