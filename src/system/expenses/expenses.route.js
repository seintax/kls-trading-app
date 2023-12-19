const router = require('express').Router()
const service = require('./expenses.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/expenses')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/expenses/id', secure, service._findone)
router.get('/expenses/search', secure, service._search)
router.post('/expenses/specify', service._specify)
router.get('/expenses/allexpenses', service.allExpenses)

module.exports = router