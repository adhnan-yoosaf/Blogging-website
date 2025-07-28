const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please enter fullname']
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: [true, 'Email already exist']
    },
    password: {
        type: String,
        required: [true, 'Please enter password']
    },
    phone: {
        type: String,
        required: [true, 'Please enter phone number'],
        unique: [true, 'Phone number already exist']
    },
    profilePhoto: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    likedBlogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ],
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ],
    otp: { type: String },
    otpExpiry: { type: Date }

}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema)

module.exports = User;