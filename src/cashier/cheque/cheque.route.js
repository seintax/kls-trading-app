const router = require('express').Router()
const service = require('./cheque.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/cheque')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/cheque/id', secure, service._findone)
router.get('/cheque/search', secure, service._search)
router.post('/cheque/specify', service._specify)

module.exports = router