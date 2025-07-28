import React, { useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import BlogCard from '../components/BlogCard'
import useToastAndNavigate from '../hooks/useToastAndNavigate'
import { getBookmarkedBlogsThunk } from '../redux/blogSlice'

const Bookmarks = () => {

    const dispatch = useDispatch();

    const showtoast = useToastAndNavigate();

    const { blogs } = useSelector((state) => state.blogs)

    useEffect(() => {
        dispatch(getBookmarkedBlogsThunk())
            .unwrap()
            .catch((err) => {
                showtoast(false, err?.message)
            })
    }, [])

    return (
        <Container>
            <Row>
                <Col className='my-4'>
                    <h2>Bookmarks</h2>
                </Col>
            </Row>
            <Row>
                {blogs.length !== 0 ? (
                    blogs.map((blog, i) => (
                        <Col md={6} lg={4} xl={3} key={i}>
                            <BlogCard blog={blog} />
                        </Col>
                    ))

                ) : (
                    <Col className='text-center'>
                        <h4>No bookmarks found</h4>
                    </Col>
                )}
            </Row>
        </Container>
    )
}

export default Bookmarks