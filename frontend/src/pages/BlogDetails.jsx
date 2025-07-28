import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Container, Dropdown, Image, ListGroup, Modal, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { blogDislikeThunk, blogLikeThunk, bookmarkBlogThunk, deleteCommentThunk, getBlogByIdThunk } from '../redux/blogSlice';
import useToastAndNavigate from '../hooks/useToastAndNavigate';
import parse from 'html-react-parser';
import { AiOutlineDislike, AiOutlineLike, AiFillDislike, AiFillLike } from "react-icons/ai";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineReport } from "react-icons/md";
import './BlogDetails.css'
import { setUser } from '../redux/authSlice';
import AddComment from '../components/AddComment';
import EditComment from '../components/EditComment';
import { followUserThunk, unFollowUserThunk } from '../redux/userSlice';
import profilePhotoPlaceholder from '../images/profile-pic-placeholder.png'
import { reportBlogThunk } from '../redux/reportSlice';

const BlogDetails = () => {

    const { id } = useParams();

    const dispatch = useDispatch();
    const showToast = useToastAndNavigate();

    const { user } = useSelector((state) => state.auth)
    const { blog } = useSelector((state) => state.blogs);

    const [isLiked, setIsLiked] = useState();
    const [isDisliked, setIsDislike] = useState();
    const [isBookmarked, setIsBookmarked] = useState();
    const [isCommentEditing, setIsCommentEditing] = useState(false);
    const [commentToEdit, setCommentToEdit] = useState(null);
    const [isFollowing, setIsFollowing] = useState();

    const formatDate = (date) => {
        date = new Date(date);
        const formattedDate = date.toLocaleDateString('en', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
        return formattedDate;
    }

    const handleLike = () => {
        if (!user) {
            return showToast(false, 'You need to login to like a post')
        }
        dispatch(blogLikeThunk(blog._id))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message)
            }).catch((err) => {
                showToast(err?.success, err?.message)
            })
        setIsLiked(!isLiked)
        if (isDisliked) {
            setIsDislike(!isDisliked)
        }
    }

    const handleDislike = () => {
        if (!user) {
            return showToast(false, 'You need to login to dislike a post')
        }
        dispatch(blogDislikeThunk(blog._id))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message)
            }).catch((err) => {
                showToast(err?.success, err?.message)
            })
        setIsDislike(!isDisliked)
        if (isLiked) {
            setIsLiked(!isLiked)
        }
    }

    const handleBookmark = () => {
        if (!user) {
            return showToast(false, 'You need to login to bookmark a post')
        }
        dispatch(bookmarkBlogThunk(blog._id))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message)
                dispatch(setUser(data.user))
            }).catch((err) => {
                showToast(err?.success, err?.message)
            })
        setIsBookmarked(!isBookmarked)
    }

    const handleFollow = (id) => {
        if (!user) {
            return showToast(false, 'You need to login to follow')
        }
        dispatch(followUserThunk(id))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message)
                dispatch(setUser(data.follower))
            }).catch((err) => {
                showToast(err?.success, err?.message)
            })
    }

    const handleUnfollow = (id) => {
        dispatch(unFollowUserThunk(id))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message)
                dispatch(setUser(data.follower))
            }).catch((err) => {
                showToast(err?.success, err?.message)
            })
    }

    const handleCommentDelete = (id) => {
        dispatch(deleteCommentThunk(id))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message)
            }).catch((err) => {
                showToast(false, err?.message)
            })
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const reportOptions = [
        "Spam or misleading",
        "Hate speech or abusive content",
        "Harassment or bullying",
        "Violence or harmful behavior",
        "Inappropriate or adult content",
        "False information",
        "Copyright infringement",
        "Personal attack or defamation",
        "Plagiarized content",
        "Other"
    ]

    const [reportReason, setReportReason] = useState(null)

    const handleReport = (id) => {
        const reportData = { blog: id, reason: reportReason }
        dispatch(reportBlogThunk(reportData))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message)
            }).catch((err) => {
                showToast(false, err?.message)
            })
        handleClose()
    }

    useEffect(() => {
        dispatch(getBlogByIdThunk(id))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message)
            }).catch((err) => {
                showToast(false, err?.message)
            })
    }, [])

    useEffect(() => {
        if (blog && user) {
            setIsLiked(blog.likes?.includes(user._id));
            setIsDislike(blog.dislikes?.includes(user._id));
            setIsBookmarked(user.bookmarks?.includes(blog._id));
            setIsFollowing(user.following?.includes(blog.author._id));
        }
    }, [blog, user]);


    return (
        <Container>
            {blog ? (
                <>
                    <Row className='mt-2 mx-lg-5'>
                        <Col>
                            <Card className={`border-0 shadow-sm p-5 position-relative blog-section`}>
                                <Col className='blog-details-img-container'>
                                    <Image src={`${process.env.REACT_APP_BASE_URL}/${blog.coverImage}`} alt={blog?.title} fluid />
                                </Col>
                                <Col className='blog-details-title-section mb-2'>
                                    <h2>{blog?.title}</h2>
                                    <span className='me-3'><small>{formatDate(blog?.createdAt)}</small></span>
                                </Col>
                                <Col className='mb-3 gap-3 d-flex blog-author-section'>
                                    <Link to={`/profile/${blog.author._id}`} className='navigation-link'>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="img-container">
                                                <Image
                                                    src={blog.author.profilePhoto ? `${process.env.REACT_APP_BASE_URL}/${blog.author.profilePhoto}` : profilePhotoPlaceholder}
                                                    alt='profile-photo'
                                                    width={40}
                                                    height={40}
                                                    roundedCircle
                                                />
                                            </div>
                                            <span className='fw-bold'>{blog.author.fullName}</span>
                                        </div>
                                    </Link>

                                    {
                                        user?._id !== blog.author._id && (
                                            isFollowing
                                                ? <Button variant='outline-dark' className='follow-btn align-self-center' onClick={() => handleUnfollow(blog.author._id)}>Following</Button>
                                                : <Button variant='dark' className='follow-btn align-self-center' onClick={() => handleFollow(blog.author._id)}>Follow</Button>
                                        )
                                    }

                                </Col>
                                <Col className='blog-action-buttons-col'>
                                    <div className='d-flex align-items-center gap-2 mb-3'>
                                        <Button onClick={handleLike} variant='light'>{isLiked ? <AiFillLike /> : <AiOutlineLike />}</Button>
                                        <Button onClick={handleDislike} variant='light'>{isDisliked ? <AiFillDislike /> : <AiOutlineDislike />}</Button>
                                        <Button onClick={handleBookmark} variant='light'>{isBookmarked ? <FaBookmark /> : <FaRegBookmark />}</Button>
                                        <Dropdown className='report-dropdown'>
                                            <Dropdown.Toggle variant="light" className="border-0">
                                                <MdOutlineReport size={20} />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                {reportOptions.map((reason, index) => (
                                                    <Dropdown.Item
                                                        key={index}
                                                        onClick={() => {
                                                            setReportReason(reason);
                                                            handleShow();
                                                        }}
                                                    >
                                                        {reason}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </Col>
                                <Col>
                                    {parse(blog.content)}
                                </Col>
                            </Card>
                            <Card className='mt-3 p-4 shadow-sm border-0 comment-section'>
                                <h5 className='mb-4'>Comments ({blog.comments.length})</h5>

                                <ListGroup variant="flush" className='mb-4'>
                                    {blog.comments.length === 0 && <p className='text-muted'>No comments yet. Be the first to speak your mind!</p>}
                                    {blog.comments.map((comment, index) => (
                                        <ListGroup.Item key={index} className='d-flex align-items-start gap-3 position-relative'>
                                            <div className='img-container'>
                                                <Image
                                                    src={comment.author.profilePhoto ? `${process.env.REACT_APP_BASE_URL}/${comment.author.profilePhoto}` : profilePhotoPlaceholder}
                                                    roundedCircle
                                                    alt='profile-photo'
                                                />
                                            </div>
                                            <div>
                                                <strong>{comment.author.fullName}</strong>
                                                <span>{comment.author._id === blog.author._id && <small><Badge className='bg-dark ms-2'>Author</Badge></small>}</span>
                                                <p className='mb-1'>{comment.content}</p>
                                                <small className="text-muted">
                                                    {formatDate(comment.createdAt)}
                                                </small>
                                            </div>
                                            <Dropdown className='comment-dropdown'>
                                                {comment.author._id === user?._id && (
                                                    <Dropdown.Toggle>
                                                        <BsThreeDotsVertical />
                                                    </Dropdown.Toggle>
                                                )}

                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handleCommentDelete(comment._id)}>Delete</Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            setIsCommentEditing(true);
                                                            setCommentToEdit(comment._id);
                                                        }}
                                                    >
                                                        Edit
                                                    </Dropdown.Item>

                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>

                                {isCommentEditing
                                    ? <EditComment commentId={commentToEdit} setIsCommentEditing={setIsCommentEditing} />
                                    : <AddComment />}

                            </Card>
                        </Col>
                    </Row>
                </>
            ) : (
                <Row>
                    <Col>
                        <h2 className='text-center fw-bold mt-5'>Blog not found</h2>
                    </Col>
                </Row>
            )
            }
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Report this Blog</Modal.Title>
                </Modal.Header>
                <Modal.Body>{`Are you sure you want to report this blog for ${reportReason}?`}</Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>
                        No
                    </Button>
                    <Button variant="outline-dark" onClick={() => handleReport(blog?._id)}>
                        Yes, report
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container >
    )
}

export default BlogDetails