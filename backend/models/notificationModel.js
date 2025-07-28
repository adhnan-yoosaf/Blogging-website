const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['like', 'follow', 'comment', 'other'],
        required: true
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    message: {
        type: String
    }
}, { timestamps: true })

const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification;