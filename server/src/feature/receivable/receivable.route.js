const router = require('express').Router()
const service = require('./receivable.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/receivable')
    .post(service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/receivable/id', secure, service._findone)
router.get('/receivable/search', secure, service._search)
router.post('/receivable/specify', service._specify)

module.exports = router