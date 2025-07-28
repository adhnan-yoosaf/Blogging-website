import React, { useState } from 'react'
import * as formik from 'formik';
import * as yup from 'yup';
import { Button, Card, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import useToastAndNavigate from '../hooks/useToastAndNavigate';
import profilePhotoPlaceholder from '../images/profile-pic-placeholder.png'
import { IoIosAddCircle } from "react-icons/io";
import './ProfileEdit.css'
import { userProfileUpdateThunk } from '../redux/authSlice';

const ProfileEdit = () => {

    const { Formik } = formik;

    const dispatch = useDispatch();
    const showToast = useToastAndNavigate();

    const schema = yup.object().shape({
        fullName: yup.string().required('Please enter your fullname'),
        email: yup.string().required('Please enter your email address').email('Please enter a valid email'),
        phone: yup.string().required('Please enter your phone number'),
        profilePhoto: yup.string(),
    });

    const { user } = useSelector((state) => state.auth)

    const [profilePhotoPreview, setProfilePhotoPreview] = useState();

    const handleProfileUpdate = (values) => {
        dispatch(userProfileUpdateThunk(values))
            .unwrap()
            .then((data) => {
                showToast(data.success, data.message, `/profile/${user._id}`)
            }).catch((err) => {
                showToast(false, err.message)
            })

    }

    return (
        <Container>
            <Row className='justify-content-center mt-5'>
                <Col xs={12} sm={10} md={8} lg={6} xl={4}>
                    <Card className='p-5'>
                        <Formik
                            validationSchema={schema}
                            onSubmit={handleProfileUpdate}
                            initialValues={{
                                fullName: user?.fullName || '',
                                email: user?.email || '',
                                phone: user?.phone || '',
                                profilePhoto: user?.profilePhoto || '',
                            }}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors, setFieldValue }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Row>
                                        <Col className='d-flex justify-content-center'>
                                            <div className='profile-photo-section position-relative'>
                                                <Form.Label htmlFor='profilePhotoInput'>
                                                    <div className='img-container'>
                                                        {!profilePhotoPreview ? <Image src={user?.profilePhoto
                                                            ? `${process.env.REACT_APP_BASE_URL}/${user?.profilePhoto}`
                                                            : profilePhotoPlaceholder} alt='profile-photo' /> : <Image src={profilePhotoPreview} alt='profile-photo-preview' />}
                                                    </div>
                                                    {!user?.profilePhoto && <IoIosAddCircle />}
                                                </Form.Label>
                                            </div>
                                            <Form.Control
                                                type='file'
                                                name='profilePhoto'
                                                id='profilePhotoInput'
                                                className='d-none'
                                                onChange={(e) => {
                                                    setFieldValue('profilePhoto', e.currentTarget.files[0])
                                                    setProfilePhotoPreview(URL.createObjectURL(e.target.files[0]))
                                                }}
                                                isValid={touched.profilePhoto && !errors.profilePhoto}
                                                isInvalid={touched.profilePhoto && !!errors.profilePhoto}
                                            />
                                            <Form.Control.Feedback type='invalid'>{errors.profilePhoto}</Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Form.Group as={Col} controlId="validationFormik01">
                                            <Form.Label>Full Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="fullName"
                                                value={values.fullName}
                                                onChange={handleChange}
                                                isValid={touched.fullName && !errors.fullName}
                                                isInvalid={touched.fullName && !!errors.fullName}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.fullName}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group as={Col} controlId="validationFormik02">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                isValid={touched.email && !errors.email}
                                                isInvalid={touched.email && !!errors.email}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group as={Col} controlId="validationFormik03">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="phone"
                                                value={values.phone}
                                                onChange={handleChange}
                                                isValid={touched.phone && !errors.phone}
                                                isInvalid={touched.phone && !!errors.phone}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.phone}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Button type="submit" variant='dark' className='w-100 mt-3'>
                                        Update
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default ProfileEdit