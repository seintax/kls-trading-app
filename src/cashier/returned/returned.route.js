const router = require('express').Router()
const service = require('./returned.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/returned')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/returned/id', secure, service._findone)
router.get('/returned/search', secure, service._search)
router.post('/returned/specify', service._specify)
router.get('/returned/bycode', service.byCode)

module.exports = router