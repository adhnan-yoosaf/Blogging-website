import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import BlogCard from '../components/BlogCard'
import useToastAndNavigate from '../hooks/useToastAndNavigate'
import { getAllBlogsThunk } from '../redux/blogSlice'
import { useLocation, useSearchParams } from 'react-router-dom'

const AllBlogs = () => {

    const dispatch = useDispatch()
    const showToast = useToastAndNavigate();

    const { blogs } = useSelector((state) => state.blogs)

    useEffect(() => {
        dispatch(getAllBlogsThunk())
            .unwrap()
            .then((data) => {
                return showToast(data.success, data.message)
            }).catch((err) => {
                return showToast(false, err.message)
            })
    }, [])

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const [filteredBlogs, setFilteredBlogs] = useState([])

    useEffect(() => {
        const search = searchParams.get('search');
        if (search) {
            setSearchTerm(search.toLowerCase());
        }
    }, [location.search]);

    useEffect(() => {
        let result = [...blogs];

        if (searchTerm) {
            result = blogs.filter((b) =>
                b.title.toLowerCase().includes(searchTerm) || b.content.toLowerCase().includes(searchTerm)
            );
        }

        setFilteredBlogs(result);
    }, [searchTerm, blogs]);


    return (
        <Container>
            <Row className='my-3'>
                <Col>
                    {!searchTerm && (<h2 className='fw-bold'>All Blogs</h2>)}
                </Col>
            </Row>
            <Row>
                {
                    searchTerm ? (
                        filteredBlogs.map((blog, i) => (
                            <Col md={6} lg={4} xl={3} key={i}>
                                <BlogCard blog={blog} />
                            </Col>
                        ))
                    ) : (
                        blogs.length !== 0 ? (
                            blogs.map((blog, i) => (
                                <Col md={6} lg={4} xl={3} key={i}>
                                    <BlogCard blog={blog} />
                                </Col>
                            ))
                        ) : (
                            <Col>
                                <h4 className='text-center'>No blogs found</h4>
                            </Col>
                        )
                    )
                }
            </Row>
        </Container>
    )
}

export default AllBlogs