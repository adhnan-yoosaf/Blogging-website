const User = require("../models/userModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const nodemailer = require('nodemailer')
const crypto = require('crypto');
const Notification = require("../models/notificationModel");

exports.userRegister = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;
        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the data"
            })
        }

        const userData = {
            fullName,
            email,
            password,
            phone
        }

        const user = await User.create(userData)

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all data"
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password)

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const options = {
            userId: user._id,
            userRole: user.role
        }

        const token = jwt.sign(options, process.env.JWT_SECRET_KEY, { expiresIn: '30m' });

        const userData = user.toObject();
        delete userData.password

        res.status(200).cookie('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'None',
          maxAge: 30 * 60 * 1000 // 30 minutes
        }).json({
          success: true,
          message: 'User login successful',
          user: userData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.userLogout = (req, res) => {
    try {
        res.status(200).clearCookie('token').json({
            success: true,
            message: 'User logged out successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password')

        if (!users) {
            return res.status(404).json({
                success: false,
                message: 'Users not found'
            })
        }

        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getUserById = async (req, res) => {
    try {

        const { id } = req.params;

        const user = await User.findById(id).select('-password')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.userProfileUpdate = async (req, res) => {
    try {
        const { fullName, email, phone } = req.body;

        const profilePhoto = req.file?.path;

        const deleteFile = (path) => {
            fs.promises.unlink(path).catch((err) => console.log('Profile photo deleting failed', err))
        }

        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            profilePhoto && deleteFile(profilePhoto)

            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (fullName) user.fullName = fullName;

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                profilePhoto && deleteFile(profilePhoto)

                return res.status(409).json({
                    success: false,
                    message: 'Email is already in use'
                })
            }
            user.email = email;
        }

        if (phone && phone !== user.phone) {
            const existingUser = await User.findOne({ phone });
            if (existingUser) {
                profilePhoto && deleteFile(profilePhoto)

                return res.status(409).json({
                    success: false,
                    message: 'Phone number is already in use'
                })
            }
            user.phone = phone
        }

        if (profilePhoto) {
            user.profilePhoto && deleteFile(user.profilePhoto)

            user.profilePhoto = profilePhoto;
        }

        const updatedUser = await user.save()

        res.status(200).json({
            success: true,
            message: 'User profile updated successfully',
            user: updatedUser
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.userRoleUpdate = async (req, res) => {
    try {

        const { id } = req.params;

        const { role } = req.body;

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        user.role = role;

        await user.save()

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        if (user.profilePhoto) {
            fs.promises.unlink(user.profilePhoto).catch((err) => console.log('Profile Photo deletion failed', err))
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            user
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            message: error.message
        })
    }
}

exports.followUser = async (req, res) => {
    try {
        const followerId = req.userId;

        const followedId = req.params.id;

        if (followerId === followedId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot follow yourself'
            })
        }

        const follower = await User.findById(followerId).select('-password');
        const followed = await User.findById(followedId).select('-password');

        if (!followed) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        if (followed.followers.includes(followerId)) {
            return res.status(400).json({
                success: false,
                message: 'You already follow this user'
            })
        }

        followed.followers.push(followerId);
        follower.following.push(followedId);

        await followed.save()
        await follower.save()

        await Notification.create({
            recipient: followed._id,
            sender: follower._id,
            type: 'follow'
        })

        res.status(200).json({
            success: true,
            message: 'Followed successfully',
            follower,
            followed
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.unfollowUser = async (req, res) => {
    try {
        const followerId = req.userId;

        const followedId = req.params.id;

        if (followerId === followedId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot unfollow yourself'
            })
        }

        const follower = await User.findById(followerId).select('-password');
        const followed = await User.findById(followedId).select('-password');

        if (!followed) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        if (!followed.followers.includes(followerId)) {
            return res.status(400).json({
                success: false,
                message: 'You are not following this user'
            })
        }

        followed.followers = followed.followers.filter((id) => id.toString() !== followerId)
        follower.following = follower.followers.filter((id) => id.toString() !== followedId)

        await followed.save()
        await follower.save()

        await Notification.findOneAndDelete({
            recipient: followed._id,
            sender: follower._id,
            type: 'follow'
        })

        res.status(200).json({
            success: true,
            message: 'Unfollowed successfully',
            follower,
            followed
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { currPassword, newPassword } = req.body;

        if (!currPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please enter all the data'
            })
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const isPasswordMatched = await bcrypt.compare(currPassword, user.password);

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: 'Current Password is incorrect'
            })
        }

        user.password = newPassword;

        await user.save()

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.generatePasswordResetOtp = async (req, res) => {

    const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email'
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const otp = crypto.randomInt(100000, 999999);

        const otpExpiry = new Date(Date.now() + (5 * 60 * 1000))

        user.otp = otp;
        user.otpExpiry = otpExpiry;

        await user.save();

        const emailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password reset OTP",
            html: `<p>Your password reset OTP: <strong>${otp}</strong></p>
                <p>Note: OTP is valid for 5 mins only</p>`
        }

        await transport.sendMail(emailOptions)

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.confirmPasswordReset = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please ente all the data'
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            })
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired'
            })
        }

        user.password = newPassword;
        user.otp = null;
        user.otpExpiry = null;

        await user.save()

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
