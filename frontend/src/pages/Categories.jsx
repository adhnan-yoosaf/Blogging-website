import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap'
import './Categories.css'
import { getAllBlogsThunk, getBlogsByCategoryThunk } from '../redux/blogSlice';
import BlogCard from '../components/BlogCard';

const Categories = () => {

    const dispatch = useDispatch();

    const categories = ['All', 'tech', 'lifestyle', 'travel', 'education', 'news', 'entertainment', 'finance', 'others']

    const [selectedCategory, setSelectedCategory] = useState('All');

    const { blogs, loading } = useSelector((state) => state.blogs)

    useEffect(() => {
        if (selectedCategory === 'All') {
            dispatch(getAllBlogsThunk())
        } else {
            dispatch(getBlogsByCategoryThunk(selectedCategory))
        }
    }, [selectedCategory])

    return (
        <Container>
            <Row>
                <Col sm={12} className='categories-slider justify-content-xl-center'>
                    {categories.map((c, i) => (
                        <Button
                            variant={selectedCategory === c ? 'dark' : 'outline-dark'}
                            key={i}
                            onClick={() => setSelectedCategory(c)}
                        >
                            {c}
                        </Button>
                    ))}
                </Col>
            </Row>
            <Row className='mt-5'>
                {
                    loading
                        ? (
                            <Col className='d-flex justify-content-center align-middle'>
                                <Spinner animation='grow' />
                            </Col>
                        )
                        : (
                            blogs.length === 0
                                ? (
                                    <Col className='text-center'>
                                        <h2>No blogs found in this category</h2>
                                    </Col>
                                ) : (
                                    blogs.map((blog, i) => (
                                        <Col md={6} lg={4} xl={3} key={i}>
                                            <BlogCard blog={blog} />
                                        </Col>
                                    ))
                                )
                        )
                }
            </Row>
        </Container>
    )
}

export default Categories