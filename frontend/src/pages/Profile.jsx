import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import './Profile.css'
import { getBlogsByUserThunk } from '../redux/blogSlice'
import BlogCard from '../components/BlogCard'
import { useNavigate, useParams } from 'react-router-dom'
import { followUserThunk, getUserByIdThunk, unFollowUserThunk } from '../redux/userSlice'
import profilePicPlaceholder from '../images/profile-pic-placeholder.png'
import useToastAndNavigate from '../hooks/useToastAndNavigate'
import { setUser } from '../redux/authSlice'

const Profile = () => {

    const dispatch = useDispatch();

    const showToast = useToastAndNavigate();

    const navigate = useNavigate();

    const { id } = useParams();

    const loggedInUser = useSelector((state) => state.auth.user)

    const [profileUser, setProfileUser] = useState();

    const { blogs } = useSelector((state) => state.blogs)

    console.log(profileUser)

    useEffect(() => {
        dispatch(getUserByIdThunk(id))
            .unwrap()
            .then((data) => {
                setProfileUser(data.user)
            })
        dispatch(getBlogsByUserThunk(id))
    }, [id])

    const handleFollow = () => {
        dispatch(followUserThunk(id))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message)
                dispatch(setUser(data.follower))
                setProfileUser(data.followed)
            }).catch((err) => {
                showToast(false, err?.message)
            })
    }

    const handleUnfollow = () => {
        dispatch(unFollowUserThunk(id))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message)
                dispatch(setUser(data.follower))
                setProfileUser(data.followed)
            }).catch((err) => {
                showToast(false, err?.message)
            })
    }

    return (
        <Container>
            <Card className='bg-white my-5 border-0 shadow-sm profile-card'>
                <Row className='text-center text-lg-start p-5 align-items-center'>
                    <Col md={12} lg={4} className='d-flex justify-content-center justify-content-lg-end'>
                        <div className='profile-pic-container'>
                            <Image
                                src={profileUser?.profilePhoto ? `${process.env.REACT_APP_BASE_URL}/${profileUser?.profilePhoto}` : profilePicPlaceholder}
                                alt='profile-photo'
                                className='profile-pic shadow me-lg-1'
                            />
                        </div>
                    </Col>
                    <Col md={12} lg={4}>
                        <h4 className='fw-bold fs-2 mt-3 mt-lg-0'>{profileUser?.fullName}</h4>
                        <Row>
                            <Col>
                                <p className='mb-0 mx-0 fs-4 ms-lg-4'><strong>{profileUser?.followers?.length}</strong></p>
                                <p><small>Followers</small></p>
                            </Col>
                            <Col>
                                <p className='mb-0 mx-0 fs-4 ms-lg-4' ><strong>{profileUser?.following?.length}</strong></p>
                                <p><small>Following</small></p>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={12} lg={4} className='d-flex justify-content-center justify-content-lg-start'>
                        {
                            profileUser?._id === loggedInUser?._id
                                ? <Button variant='outline-dark' className='align-self-center rounded-pill px-5 mt-sm-4' onClick={() => navigate('/profile/edit')}>Edit Profile</Button>
                                : loggedInUser?.following?.includes(profileUser?._id)
                                    ? <Button variant='outline-dark' className='align-self-center rounded-pill px-5 mt-sm-4' onClick={handleUnfollow}>Following</Button>
                                    : <Button variant='dark' className='align-self-center rounded-pill px-5 mt-sm-4' onClick={handleFollow}>Follow</Button>

                        }
                    </Col>
                </Row>
            </Card>
            {blogs && (
                <Row>
                    {
                        blogs.map((blog, i) => (
                            <Col md={6} lg={4} xl={3} key={i}>
                                <BlogCard blog={blog} />
                            </Col>
                        ))
                    }
                </Row>
            )}

        </Container>
    )
}

export default Profile