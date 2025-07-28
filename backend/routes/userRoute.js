const express = require('express');
const { userRegister, getAllUsers, userLogin, userLogout, getUserById, userProfileUpdate, deleteUser, followUser, unfollowUser, changePassword, generatePasswordResetOtp, confirmPasswordReset, userRoleUpdate } = require('../controllers/userController');
const { userAuthenticate, userAuthorize } = require('../middleware/auth');
const fileUpload = require('../middleware/fileUpload');
const router = express.Router();


router.route('/register').post(userRegister)
router.route('/login').post(userLogin)
router.route('/logout').post(userLogout)
router.route('/change-password').put(userAuthenticate, changePassword)
router.route('/reset-password/generate-otp').post(generatePasswordResetOtp)
router.route('/reset-password/confirm').post(confirmPasswordReset)
router.route('/all-users').get(userAuthenticate, userAuthorize(['admin']), getAllUsers)
router.route('/profile').put(userAuthenticate, fileUpload('profilePhoto').single('profilePhoto'), userProfileUpdate)
router.route('/profile/:id').get(getUserById)
router.route('/role-update/:id').put(userAuthenticate, userAuthorize(['admin']), userRoleUpdate)
router.route('/:id').delete(userAuthenticate, userAuthorize(['admin']), deleteUser)
router.route('/follow/:id').put(userAuthenticate, followUser)
router.route('/unfollow/:id').put(userAuthenticate, unfollowUser)

module.exports = router;