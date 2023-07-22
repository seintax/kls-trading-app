const router = require('express').Router()
const service = require('./inventory.query')
const complex = require('./inventory.logic')
const { secure } = require('../../../res/secure/secure')

router
    .route('/inventory')
    .post(service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/inventory/branch', service._branch)
router.get('/inventory/id', secure, service._findone)
router.get('/inventory/search', secure, service._search)
router.post('/inventory/specify', service._specify)
router.get('/inventory/bystocks', service.byStocks)
router.get('/inventory/bytransmit', service.byTransmit)

router.post('/inventory/sqlacquire', complex.sqlAcquire)

module.exports = router