const Notification = require("../models/notificationModel")

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.userId })
            .populate('sender', 'fullName')
            .populate('blog', 'title')

        if (notifications.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No notifications found'
            })
        }

        res.status(200).json({
            success: true,
            notifications
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findById(id)
            .populate('sender', 'fullName')
            .populate('blog', 'title')


        if (notification.recipient.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to mark this notification as read'
            })
        }

        notification.isRead = true;

        await notification.save()

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            notification
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.markAllNotificationsAsRead = async (req, res) => {
    try {

        const notifications = await Notification.updateMany(
            { recipient: req.userId },
            { $set: { isRead: true } }
        )

        res.status(200).json({
            success: true,
            message: 'Marked all notifications as read',
            notifications
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getUnreadNotificationsCount = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.userId,
            isRead: false
        })

        res.status(200).json({
            success: true,
            count: notifications.length
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.sendNotification = async (req, res) => {
    try {

        const { recipient, type, blog, message } = req.body;

        const notification = await Notification.create({
            recipient,
            sender: req.userId,
            type,
            blog,
            message
        })

        res.status(200).json({
            success: true,
            notification
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}