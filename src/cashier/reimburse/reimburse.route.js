const router = require('express').Router()
const service = require('./reimburse.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/reimburse')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/reimburse/id', secure, service._findone)
router.get('/reimburse/search', secure, service._search)
router.post('/reimburse/specify', service._specify)

module.exports = router