const router = require('express').Router()
const service = require('./schedule.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/schedule')
    .post(service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/schedule/id', secure, service._findone)
router.get('/schedule/search', secure, service._search)

module.exports = router