const express = require('express');
const { submitContactMsg, getAllContactMsgs, markContactMsgAsRead, replyToContactMsg } = require('../controllers/contactMessageController');
const { userAuthenticate, userAuthorize } = require('../middleware/auth');
const router = express.Router();

router.route('/send').post(submitContactMsg)
router.route('/all').get(userAuthenticate, userAuthorize(['admin']), getAllContactMsgs)
router.route('/mark-as-read/:id').put(userAuthenticate, userAuthorize(['admin']), markContactMsgAsRead)
router.route('/reply/:id').post(userAuthenticate, userAuthorize(['admin']), replyToContactMsg)


module.exports = router;