const express = require('express')
const { getNotifications, markNotificationAsRead, getUnreadNotificationsCount, markAllNotificationsAsRead, sendNotification } = require('../controllers/notificationController')
const { userAuthenticate } = require('../middleware/auth')
const router = express.Router()

router.route('/all').get(userAuthenticate, getNotifications)
router.route('/mark-as-read/all').put(userAuthenticate, markAllNotificationsAsRead)
router.route('/unread-count').get(userAuthenticate, getUnreadNotificationsCount)
router.route('/:id/mark-as-read').put(userAuthenticate, markNotificationAsRead)
router.route('/send').post(userAuthenticate, sendNotification)

module.exports = router;