import React, { useEffect, useState } from 'react';
import { Button, Container, Dropdown, Form, Image, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { IoIosCloseCircle, IoIosNotifications } from "react-icons/io";
import logo from '../images/sample-logo.png'
import { useDispatch, useSelector } from 'react-redux';
import useToastAndNavigate from '../hooks/useToastAndNavigate';
import profilePhotoPlaceholder from '../images/profile-pic-placeholder.png'
import './Header.css';
import { userLogoutThunk } from '../redux/authSlice';
import { getAllNotificationsThunk, getUnreadNotificationCountThunk, markAllNotificationAsReadThunk, markNotificationAsReadThunk } from '../redux/notificationSlice';

const Header = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const showToast = useToastAndNavigate();

    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const { notifications } = useSelector((state) => state.notifications)

    const [searchExpanded, setSearchExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState(null);

    const handleLogout = () => {
        dispatch(userLogoutThunk())
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message, '/login')
            }).catch((err) => {
                showToast(false, err?.message)
            })
    }

    const handleSearchExpand = () => {
        setSearchExpanded(!searchExpanded);
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/all-blogs?search=${encodeURIComponent(searchQuery)}`)
        }
    }

    const [unReadCount, setUnreadCount] = useState();

    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (user && isAuthenticated) {
            dispatch(getUnreadNotificationCountThunk())
                .unwrap()
                .then((data) => {
                    setUnreadCount(data.count)
                }).catch((err) => {
                    if (err?.message === 'Token not found' || 'jwt expired') {
                        dispatch(userLogoutThunk())
                    }
                    showToast(false, err?.message)
                })
        }
    }, [user, isAuthenticated])

    const handleShowNotifications = () => {
        dispatch(getAllNotificationsThunk())
    }

    const handleMarkAsRead = (e, notif) => {
        e.stopPropagation()
        if (!notif.isRead) {
            dispatch(markNotificationAsReadThunk(notif._id))
        }
        if (unReadCount !== 0) {
            setUnreadCount(unReadCount - 1)
        }
    }

    const handleMarkAllAsRead = (e) => {
        e.stopPropagation()
        setUnreadCount(0)
        dispatch(markAllNotificationAsReadThunk())
    }

    return (
        <Navbar expand="lg" className="border-bottom" >
            <Container>
                <Navbar.Brand as={Link} to="/" className='position-relative'>
                    <Image src={logo} alt='logo' />
                    <span>Blogora</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <div className="centered-nav">
                        <Nav>
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/categories">Categories</Nav.Link>
                            <Nav.Link as={Link} to="/about">About</Nav.Link>
                        </Nav>
                    </div>
                    <Nav className="ms-auto">
                        <div className="header-search-container d-lg-flex align-items-center justify-content-end">
                            <div className={`search-wrapper ${searchExpanded ? 'expanded' : ''}`}>
                                {searchExpanded ? (
                                    <Form
                                        className="w-100"
                                        onSubmit={handleSearch}
                                    >
                                        <Form.Group className="d-flex align-items-center gap-2 mb-0">
                                            <Form.Control
                                                className="header-search-input"
                                                placeholder="Search for products, categories etc..."
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            <IoIosCloseCircle className="header-search-close" onClick={handleSearchExpand} />
                                        </Form.Group>
                                    </Form>
                                ) : (
                                    <>
                                        <FaSearch className="header-search-icon" onClick={handleSearchExpand} />
                                    </>
                                )}
                            </div>
                        </div>
                        {user && (
                            <Dropdown
                                show={showNotifications}
                                onClick={handleShowNotifications}
                                onToggle={(isOpen) => setShowNotifications(isOpen)}
                                className='position-relative notif-dropdown'
                            >
                                <Dropdown.Toggle
                                    className='border-0 p-0 notification-toggle bg-transparent text-black'
                                >
                                    <IoIosNotifications className='header-notification' />
                                    <span className='notification-count'>{unReadCount}</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {notifications.length === 0 ? (
                                        <Dropdown.Item disabled>No notifications</Dropdown.Item>
                                    ) : (
                                        <>
                                            <Dropdown.Item
                                                className='text-center fw-bold'
                                                onClick={(e) => handleMarkAllAsRead(e)}
                                            >
                                                Mark all as Read
                                            </Dropdown.Item>
                                            {notifications.map((notif, i) => (
                                                <Dropdown.Item
                                                    key={i}
                                                    className={notif.isRead ? 'read-notification' : ''}
                                                    onClick={(e) => handleMarkAsRead(e, notif)}
                                                >
                                                    <div>
                                                        {notif.message ? (
                                                            <p>{notif.message}</p>
                                                        ) : (
                                                            <>
                                                                <strong>{notif.sender.fullName}</strong>
                                                                {notif.type === 'like' && ' liked your blog'}
                                                                {notif.type === 'follow' && ' started following you'}
                                                                {notif.type === 'comment' && ` commented on ${notif.blog?.title || 'Deleted Blog'}`}
                                                            </>
                                                        )}
                                                    </div>
                                                    <small>{new Date(notif.createdAt).toLocaleString()}</small>
                                                </Dropdown.Item>
                                            ))}

                                        </>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        )}



                        {
                            user && isAuthenticated
                                ? (
                                    <Dropdown className='header-dropdown'>
                                        <Dropdown.Toggle variant="link" className="dropdown-toggle-img p-0 border-0">
                                            <Image
                                                src={user?.profilePhoto ? `${process.env.REACT_APP_BASE_URL}/${user?.profilePhoto}` : profilePhotoPlaceholder}
                                                alt="profile"
                                                className="dropdown-profile-img"
                                                roundedCircle
                                            />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item as={Link} to={`/profile/${user?._id}`}>Profile</Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/dashboard">Dashboard</Dropdown.Item>
                                            <Dropdown.Item as={Link} to='/create'>Create Blog</Dropdown.Item>
                                            <Dropdown.Item as={Link} to='/all-blogs'>All Blogs</Dropdown.Item>
                                            <Dropdown.Item as={Link} to='/bookmarks'>Bookmarks</Dropdown.Item>
                                            <Dropdown.Item as={Link} to='/change-password'>Change Password</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )
                                : <Button as={Link} to={'/login'} className='header-btn'>Login</Button>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    )
}

export default Header