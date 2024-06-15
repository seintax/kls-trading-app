const router = require('express').Router()
const service = require('./statement.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/statement')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/statement/id', secure, service._findone)
router.get('/statement/search', secure, service._search)
router.post('/statement/specify', service._specify)
router.get('/statement/byfilter', secure, service.byFilter)
router.get('/statement/bynonerange', secure, service.byNoneRange)

module.exports = router