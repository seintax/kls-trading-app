const router = require('express').Router()
const service = require('./prints.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/prints')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/prints/id', secure, service._findone)
router.get('/prints/search', secure, service._search)
router.post('/prints/specify', service._specify)

module.exports = router