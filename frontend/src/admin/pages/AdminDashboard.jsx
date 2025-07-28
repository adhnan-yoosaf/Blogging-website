import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Modal, Row, Table } from 'react-bootstrap'
import { FaUserShield, FaTrashAlt, FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import './AdminDashboard.css'
import { useDispatch, useSelector } from 'react-redux'
import useToastAndNavigate from '../../hooks/useToastAndNavigate'
import { deleteBlogThunk, getAllBlogsThunk } from '../../redux/blogSlice'
import { deleteUserThunk, getAllUsersThunk } from '../../redux/userSlice'
import { MdDelete } from 'react-icons/md'
import { getAllReportsThunk } from '../../redux/reportSlice'
import { getAllContactMsgThunk } from '../../redux/contactSlice'

const AdminDashboard = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const showToast = useToastAndNavigate();

    useEffect(() => {
        dispatch(getAllBlogsThunk())
            .unwrap()
            .catch((err) => {
                showToast(false, err?.message)
            })

        dispatch(getAllUsersThunk())
            .unwrap()
            .catch((err) => {
                showToast(false, err?.message)
            })

        dispatch(getAllReportsThunk())
            .unwrap()
            .catch((err) => {
                showToast(false, err?.message)
            })

        dispatch(getAllContactMsgThunk())
            .unwrap()
            .catch((err) => {
                showToast(false, err?.message)
            })
    }, [])

    const { users } = useSelector((state) => state.user)

    const recentUsers = [...users]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)

    const { blogs } = useSelector((state) => state.blogs)

    const recentBlogs = [...blogs]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)


    const { reports } = useSelector((state) => state.reports)

    const { contactMsgs } = useSelector((state) => state.contacts)

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

    const handleDeleteUser = (id) => {
        dispatch(deleteUserThunk(id))
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
    const handleShow = () => {
        setShow(true)
    };

    const [blogToDelete, setBlogToDelete] = useState(null)
    const [userToDelete, setUserToDelete] = useState(null)
    const [deleteType, setDeleteType] = useState(null)

    return (
        <Container className="py-4">
            <h2 className="fw-bold mb-4">Admin Dashboard</h2>

            <Row className="mb-4">
                <Col sm={6} lg={3}>
                    <Card className="p-3 mb-2 shadow-sm" onClick={() => navigate('list-blogs')}>
                        <h5>Total Blogs</h5>
                        <p className="fs-3 fw-bold">{blogs.length}</p>
                    </Card>
                </Col>
                <Col sm={6} lg={3} >
                    <Card className="p-3 mb-2 shadow-sm" onClick={() => navigate('list-users')}>
                        <h5>Total Users</h5>
                        <p className="fs-3 fw-bold">{users.length}</p>
                    </Card>
                </Col>
                <Col sm={6} lg={3}>
                    <Card className="p-3 mb-2 shadow-sm" onClick={() => navigate('reports')}>
                        <h5>Reports</h5>
                        <p className="fs-3 fw-bold">{reports.length}</p>
                    </Card>
                </Col>
                <Col sm={6} lg={3}>
                    <Card className="p-3 mb-2 shadow-sm" onClick={() => navigate('contacts')}>
                        <h5>Contact Messages</h5>
                        <p className="fs-3 fw-bold">{contactMsgs.length}</p>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <h4>Recent Blogs</h4>
                <Col>
                    {recentBlogs && recentBlogs.length > 0 ? (
                        <Table striped bordered responsive hover className='recent-blogs-table'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Published</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBlogs.map((blog, i) => (
                                    <tr key={blog._id}>
                                        <td>{i + 1}</td>
                                        <td onClick={() => navigate(`/blog/${blog._id}`)} className='blog-title'>{blog.title}</td>
                                        <td>{blog.author.fullName}</td>
                                        <td>{formatDate(blog.createdAt)}</td>
                                        <td className="text-center">
                                            <MdDelete
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setBlogToDelete(blog._id)
                                                    setDeleteType('blog')
                                                    handleShow()
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <h5 className='text-center'>No Blogs Found</h5>
                    )}
                </Col>
            </Row>


            <Row>
                <h4>Recent Users</h4>
                <Col>
                    <Table striped bordered responsive hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Date joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers && recentUsers.map((user, i) => (
                                <tr key={user._id}>
                                    <td>{i + 1}</td>
                                    <td onClick={() => navigate(`/profile/${user._id}`)} className='fw-bold' style={{ cursor: 'pointer' }}>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{formatDate(user.createdAt)}</td>
                                    <td className="text-center">
                                        <MdDelete
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setDeleteType('user')
                                                setUserToDelete(user._id)
                                                handleShow()
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>This action is irreversible</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this {deleteType === 'blog' ? 'blog' : 'user'}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="outline-dark" onClick={() => {
                        if (deleteType === 'blog') {
                            handleBlogDelete(blogToDelete)
                        } else {
                            handleDeleteUser(userToDelete)
                        }
                    }}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;
