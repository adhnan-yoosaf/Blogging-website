const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter the blog title']
    },
    content: {
        type: String,
        required: [true, 'Please enter the blog content']
    },
    coverImage: {
        type: String,
        required: [true, 'Please enter the blog coverImage']
    },
    category: {
        type: String,
        required: [true, 'Please enter the blog category'],
        enum: ['tech', 'lifestyle', 'travel', 'education', 'news', 'entertainment', 'finance', 'others']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [commentSchema]
}, { timestamps: true })

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;