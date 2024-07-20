const router = require('express').Router()
const service = require('./notification.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/notification')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/notification/id', secure, service._findone)
router.get('/notification/search', secure, service._search)
router.post('/notification/specify', service._specify)
router.post('/notification/latest', service._latest)

module.exports = router