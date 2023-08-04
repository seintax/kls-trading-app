const router = require('express').Router()
const service = require('./credit.query')
const complex = require('./credit.logic')
const { secure } = require('../../../res/secure/secure')

router
    .route('/credit')
    .post(service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/credit/id', secure, service._findone)
router.get('/credit/search', secure, service._search)
router.post('/credit/specify', service._specify)
router.get('/credit/byongoing', service.byOngoing)
router.get('/credit/byallongoing', service.byAllOngoing)
router.get('/credit/bytransaction', service.byTransaction)
router.get('/credit/byfirst', service.byFirst)

router.post('/credit/sqlsettlecredit', complex.sqlSettleCredit)

module.exports = router