const router = require('express').Router()
const service = require('./branch.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/branch')
    .post(service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/branch/id', secure, service._findone)
router.get('/branch/search', secure, service._search)
router.post('/branch/specify', service._specify)

module.exports = router