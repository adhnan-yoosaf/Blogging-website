import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Modal, Row, Table } from 'react-bootstrap'
import './UserDashboard.css'
import { deleteBlogThunk, getBlogsByUserThunk } from '../redux/blogSlice'
import { useDispatch, useSelector } from 'react-redux'
import useToastAndNavigate from '../hooks/useToastAndNavigate'
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom'

const UserDashboard = () => {

    const dispatch = useDispatch();

    const showToast = useToastAndNavigate();

    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth)

    const { blogs } = useSelector((state) => state.blogs)

    const recentBlogs = [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    useEffect(() => {
        dispatch(getBlogsByUserThunk(user._id))
            .unwrap()
            .catch((err) => {
                showToast(false, err?.message)
            })
    }, [])

    const totalComments = blogs?.reduce((prev, curr) => {
        return prev + curr.comments.length
    }, 0)

    const totalLikes = blogs?.reduce((prev, curr) => {
        return prev + curr.likes.length
    }, 0)

    const totalDislikes = blogs?.reduce((prev, curr) => {
        return prev + curr.dislikes.length
    }, 0)

    const formatDate = (date) => {
        date = new Date(date);
        const formattedDate = date.toLocaleDateString('en', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
        return formattedDate;
    }

    const handleBlogDelete = (id) => {
        dispatch(deleteBlogThunk(id))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message)
            }).catch((err) => {
                showToast(false, err?.message)
            })
        handleClose()
    }


    const [show, setShow] = useState(false);

    const handleClose = () => { setShow(false) };
    const handleShow = (id) => {
        setShow(true)
        setBlogToDelete(id)
    };

    const [blogToDelete, setBlogToDelete] = useState(null)


    return (
        <Container>
            <Row>
                <Col className='d-flex justify-content-between'>
                    <h2 className='mt-3 fw-bold'>Dashboard</h2>
                    {user?.role === 'admin' && (
                        <Button className='align-self-center' variant='outline-dark' onClick={() => navigate('admin')}>Switch to Admin</Button>
                    )}
                </Col>
            </Row>
            <Row className="mb-4">
                <Col sm={6} lg={3}>
                    <Card className="p-3 mb-2 shadow-sm">
                        <h5>Total Blogs</h5>
                        <p className="fs-3 fw-bold">{blogs.length}</p>
                    </Card>
                </Col>
                <Col sm={6} lg={3}>
                    <Card className="p-3 mb-2 shadow-sm">
                        <h4>Comments</h4>
                        <p className='fs-3 fw-bold'>
                            {totalComments}
                        </p>
                    </Card>
                </Col>
                <Col sm={6} lg={3}>
                    <Card className="p-3 mb-2 shadow-sm">
                        <h4>Likes</h4>
                        <p className='fs-3 fw-bold'>
                            {totalLikes}
                        </p>
                    </Card>
                </Col>
                <Col sm={6} lg={3}>
                    <Card className="p-3 mb-2 shadow-sm">
                        <h4>Dislikes</h4>
                        <p className='fs-3 fw-bold'>
                            {totalDislikes}
                        </p>
                    </Card>
                </Col>
            </Row>
            <Row className='my-3'>
                <h4>Blogs</h4>
                <Col>
                    {recentBlogs.length === 0 ? (
                        <h4 className='text-center mt-5'>No Blogs Found</h4>
                    ) : (
                        <Table striped bordered hover className='recent-blogs-table table-responsive'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Published</th>
                                    <th>Likes</th>
                                    <th>Dislikes</th>
                                    <th>Comments</th>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBlogs.map((blog, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td onClick={() => navigate(`/blog/${blog._id}`)} className='blog-title'>{blog.title}</td>
                                        <td>{formatDate(blog.createdAt)}</td>
                                        <td>{blog.likes.length}</td>
                                        <td>{blog.dislikes.length}</td>
                                        <td>{blog.comments.length}</td>
                                        <td className='align-middle text-center'><FaEdit onClick={() => navigate(`/blog/${blog._id}/edit`)} /></td>
                                        <td className='align-middle text-center'><MdDelete onClick={() => handleShow(blog._id)} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table >
                    )}
                </Col >
            </Row >
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>This action is irreversible</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this blog?</Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="outline-dark" onClick={() => handleBlogDelete(blogToDelete)}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container >
    )
}

export default UserDashboard