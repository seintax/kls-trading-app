const router = require('express').Router()
const service = require('./receivable.query')
const complex = require('./receivable.logic')
const { secure } = require('../../../res/secure/secure')

router
    .route('/receivable')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/receivable/id', secure, service._findone)
router.get('/receivable/search', secure, service._search)
router.post('/receivable/specify', service._specify)
router.get('/receivable/bypurchase', service.byPurchase)
router.get('/receivable/bybalance', service.byBalance)

router.post('/receivable/sqlreceivable', complex.sqlReceivable)

module.exports = router