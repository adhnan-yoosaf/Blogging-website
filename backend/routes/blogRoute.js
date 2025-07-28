const express = require('express');
const { createBlog, updateBlog, getAllBlogs, getBlogById, deleteBlog, likeBlog, dislikeBlog, getBlogsByUser, getMyBlogs, addCommentToBlog, deleteComment, bookmarkBlog, getBookmarkedBlogs, editCommentById, getBlogsByCategory } = require('../controllers/blogController');
const { userAuthenticate, userAuthorize } = require('../middleware/auth');
const fileUpload = require('../middleware/fileUpload');
const router = express.Router();

router.route('/create').post(userAuthenticate, fileUpload('blogImage').single('coverImage'), createBlog)
router.route('/all').get(getAllBlogs)
router.route('/my-blogs').get(userAuthenticate, getMyBlogs)
router.route('/bookmarks').get(userAuthenticate, getBookmarkedBlogs)
router.route('/user/:id').get(getBlogsByUser)
router.route('/:id')
    .put(userAuthenticate, fileUpload('blogImage').single('coverImage'), updateBlog)
    .delete(userAuthenticate, deleteBlog)
    .get(getBlogById)
router.route('/:id/comment').post(userAuthenticate, addCommentToBlog)
router.route('/:blogId/comment/edit/:commentId').put(userAuthenticate, editCommentById)
router.route('/comment/:id').delete(userAuthenticate, deleteComment)
router.route('/:id/like').put(userAuthenticate, likeBlog)
router.route('/:id/dislike').put(userAuthenticate, dislikeBlog)
router.route('/:id/bookmark').post(userAuthenticate, bookmarkBlog)
router.route('/categories/:category').get(getBlogsByCategory)



module.exports = router;