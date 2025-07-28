const express = require('express');
const { userAuthenticate, userAuthorize } = require('../middleware/auth');
const { reportBlog, getAllReports, resolveReport } = require('../controllers/reportController');
const router = express.Router();

router.route('/submit').post(userAuthenticate, reportBlog)
router.route('/all').get(userAuthenticate, userAuthorize(['admin']), getAllReports)
router.route('/resolve/:id').put(userAuthenticate, userAuthorize(['admin']), resolveReport)

module.exports = router;