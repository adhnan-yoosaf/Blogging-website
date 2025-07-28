const Blog = require("../models/blogModel")
const Notification = require("../models/notificationModel")
const User = require("../models/userModel")
const fs = require('fs')

exports.createBlog = async (req, res) => {
    try {
        const { title, content, category } = req.body

        const coverImage = req.file?.path;

        if (!title || !content || !coverImage || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please enter all the data'
            })
        }

        const blogData = {
            title,
            content,
            coverImage,
            category,
            author: req.userId
        }

        const blog = await Blog.create(blogData);

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            blog
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.userId
        const { title, content, category } = req.body;
        const coverImage = req.file?.path;

        const blog = await Blog.findById(blogId)
            .populate('author', 'fullName')
            .populate('comments.author', 'fullName profilePhoto')

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            })
        }

        if (blog.author._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this blog"
            })
        }

        if (title) blog.title = title;
        if (content) blog.content = content;
        if (coverImage) {
            fs.promises.unlink(blog.coverImage).catch((err) => console.log('Profile photo deleting failed', err))
            blog.coverImage = coverImage
        }
        if (category) blog.category = category;

        await blog.save();

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            blog
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'fullName');

        if (!blogs) {
            return res.status(404).json({
                success: false,
                message: 'No blogs found'
            })
        }

        res.status(200).json({
            success: true,
            blogs
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id)
            .populate('author', 'fullName profilePhoto')
            .populate('comments.author', 'fullName profilePhoto')

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            })
        }

        res.status(200).json({
            success: true,
            blog
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getBlogsByUser = async (req, res) => {
    try {
        const { id } = req.params;

        const blogs = await Blog.find({ author: id })

        if (!blogs) {
            return res.status(404).json({
                success: false,
                message: 'Blogs not found'
            })
        }

        res.status(200).json({
            success: true,
            blogs
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getMyBlogs = async (req, res) => {
    try {
        const userId = req.userId;
        const blogs = await Blog.find({ author: userId });

        if (blogs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blogs not found'
            })
        }

        res.status(200).json({
            success: true,
            blogs
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (blog.author.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this blog'
            })
        }

        fs.promises.unlink(blog.coverImage).catch((err) => console.log('Blog Image deleting failed', err))

        await blog.deleteOne()

        if (blog.author.toString() !== req.userId) {
            await Notification.create({
                recipient: blog.author,
                sender: req.userId,
                type: 'other',
                message: `${blog.title} has been removed by the admin`
            })
        }

        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully',
            blog
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.addCommentToBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required'
            })
        }

        const blog = await Blog.findById(blogId);

        blog.comments.push({
            content,
            author: req.userId
        })

        await blog.save();

        if (blog.author.toString() !== req.userId) {
            await Notification.create({
                recipient: blog.author,
                sender: req.userId,
                type: 'comment',
                blog: blog._id,
            })
        }

        const updatedBlog = await Blog.findById(blogId)
            .populate('author', 'fullName')
            .populate('comments.author', 'fullName profilePhoto')

        res.status(200).json({
            success: true,
            message: 'Comment added successfully',
            blog: updatedBlog
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.editCommentById = async (req, res) => {
    try {
        const { blogId, commentId } = req.params;

        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required'
            })
        }

        const blog = await Blog.findById(blogId)
            .populate('author', 'fullName')
            .populate('comments.author', 'fullName profilePhoto')

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            })
        }

        const comment = blog.comments.find((c) => c._id.toString() === commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            })
        }

        comment.content = content;

        await blog.save();

        res.status(200).json({
            success: true,
            message: 'Comment edited successfully',
            blog
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findOne({ 'comments._id': id })
            .populate('author', 'fullName')
            .populate('comments.author', 'fullName profilePhoto')

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'blog not found'
            })
        }

        const comment = blog.comments.id(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'comment not found'
            })
        }

        if (comment.author._id.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorised to delete this comment'
            })
        }

        comment.deleteOne();
        await blog.save();

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
            blog
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.likeBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.userId;
        const blog = await Blog.findById(blogId).populate('author', 'fullName profilePhoto').populate('comments.author', 'fullName profilePhoto');
        const user = await User.findById(userId);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            })
        }

        if (blog.likes.includes(userId)) {
            blog.likes = blog.likes.filter((id) => id.toString() !== userId);
            user.likedBlogs = user.likedBlogs.filter((id) => id.toString() !== blogId);
            await blog.save()
            await user.save()

            if (blog.author._id.toString() !== req.userId) {
                await Notification.findOneAndDelete({
                    recipient: blog.author._id,
                    sender: userId,
                    type: 'like',
                    blog: blog._id
                })
            }

            return res.status(200).json({
                success: true,
                message: 'blog unliked',
                blog
            })

        }

        if (blog.dislikes.includes(userId)) {
            blog.dislikes = blog.dislikes.filter((id) => id.toString() !== userId);
        }

        blog.likes.push(userId)
        user.likedBlogs.push(blogId)

        await blog.save()
        await user.save()

        if (blog.author._id.toString() !== req.userId) {
            await Notification.create({
                recipient: blog.author._id,
                sender: userId,
                type: 'like',
                blog: blog._id
            })
        }

        res.status(200).json({
            success: true,
            message: 'blog liked',
            blog
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.dislikeBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.userId;
        const blog = await Blog.findById(blogId).populate('author', 'fullName profilePhoto').populate('comments.author', 'fullName profilePhoto')

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            })
        }

        if (blog.dislikes.includes(userId)) {
            blog.dislikes = blog.dislikes.filter((id) => id.toString() !== userId);
            await blog.save();

            return res.status(200).json({
                success: true,
                message: 'blog undisliked',
                blog
            })

        }

        if (blog.likes.includes(userId)) {
            blog.likes = blog.likes.filter((id) => id.toString() !== userId);
        }

        blog.dislikes.push(userId)

        await blog.save()

        await Notification.findOneAndDelete({
            recipient: blog.author._id,
            sender: userId,
            type: 'like',
            blog: blog._id
        })

        res.status(200).json({
            success: true,
            message: 'blog disliked',
            blog
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.bookmarkBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.userId;

        const user = await User.findById(userId).select('-password');

        if (user.bookmarks.includes(blogId)) {
            user.bookmarks = user.bookmarks.filter((id) => id.toString() !== blogId);
            await user.save();

            return res.status(200).json({
                success: true,
                message: 'Blog unbookmarked',
                user
            })
        }

        user.bookmarks.push(blogId);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Blog bookmarked',
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getBookmarkedBlogs = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate('bookmarks').select('bookmarks')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.status(200).json({
            success: false,
            bookmarks: user.bookmarks
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getBlogsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const blogs = await Blog.find({ category })

        res.status(200).json({
            success: true,
            blogs
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}