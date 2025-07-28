import React from 'react'
import { Card } from 'react-bootstrap'
import './BlogCard.css'
import { Link } from 'react-router-dom'

const BlogCard = ({ blog }) => {

    const truncateText = (str, length) => {
        return str.length > length ? str.substring(0, length) + '...' : str;
    }
    const date = new Date(blog.createdAt);

    const formattedDate = date.toLocaleDateString('en', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })

    return (
        <Link to={`/blog/${blog._id}`} className='text-decoration-none'>
            <Card className="blog-card shadow-sm border-0 mb-3">
                <div className="blog-image-container">
                    <Card.Img src={`${process.env.REACT_APP_BASE_URL}/${blog.coverImage}`} alt={blog.title} />
                </div>
                <Card.Body>
                    <span>{blog.category.toUpperCase()}</span>
                    <Card.Title>{truncateText(blog.title, 45)}</Card.Title>
                    <small>{formattedDate}</small>
                </Card.Body>
            </Card>
        </Link>
    )
}

export default BlogCard;