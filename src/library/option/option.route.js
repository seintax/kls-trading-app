const router = require('express').Router()
const service = require('./option.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/option')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/option/id', secure, service._findone)
router.get('/option/search', secure, service._search)
router.post('/option/specify', service._specify)

module.exports = router