import React, { useEffect } from 'react';
import vectorArt from '../images/sample-vector-art.svg';
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { getAllBlogsThunk } from '../redux/blogSlice';
import useToastAndNavigate from '../hooks/useToastAndNavigate';
import BlogCard from '../components/BlogCard';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Home = () => {

    const dispatch = useDispatch();
    const showToast = useToastAndNavigate();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllBlogsThunk())
            .unwrap()
            .then((data) => {
                return showToast(data.success, data.message)
            }).catch((err) => {
                return showToast(false, err.message)
            })
    }, [])

    const { blogs } = useSelector((state) => state.blogs)

    const recentBlogs = [...blogs]
        .sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4)

    const popularBlogs = [...blogs]
        .sort(
            (a, b) => b.likes.length - a.likes.length)
        .slice(0, 4)

    return (
        <>
            <Container>
                <Row className='bg-white mt-3 mx-0 p-4 rounded shadow-sm'>
                    <Col className='home-text-col' md={8} lg={6}>
                        <h2>Publish your passion</h2>
                        <p>Create a unique and beautiful blog. Share your knowledge, ideas and experiences</p>
                        <div>
                            <Button onClick={() => navigate('/create')}>Start Writing</Button>
                            <Button onClick={() => navigate('/all-blogs')}>Explore Blogs</Button>
                        </div>
                    </Col>
                    <Col className='home-img-col' md={4} lg={6}>
                        <Image src={vectorArt} alt='art' fluid />
                    </Col>
                </Row>

                <Row>
                    <Col md={6} className='mt-3'>
                        <Card className='border-0 p-3 shadow-sm'>
                            <h4 className='fw-bold my-3'>Popular Blogs</h4>
                            <Row>
                                {popularBlogs.length !== 0 ? (
                                    popularBlogs.map((blog) => (
                                        <Col lg={6} key={blog._id}>
                                            <BlogCard blog={blog} />
                                        </Col>
                                    ))
                                ) : (
                                    <Col>
                                        <h4 className='text-center'>No blogs found</h4>
                                    </Col>
                                )}
                            </Row>
                        </Card>
                    </Col>
                    <Col md={6} className='mt-3'>
                        <Card className='border-0 p-3 shadow-sm'>
                            <h4 className="my-3 fw-bold">Recent Blogs</h4>
                            <Row>
                                {recentBlogs.length !== 0 ? (
                                    recentBlogs.map((blog) => (
                                        <Col lg={6} key={blog._id}>
                                            <BlogCard blog={blog} />
                                        </Col>
                                    ))
                                ) : (
                                    <Col>
                                        <h4 className='text-center'>No blogs found</h4>
                                    </Col>
                                )}
                            </Row>

                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>

    );
};

export default Home;
