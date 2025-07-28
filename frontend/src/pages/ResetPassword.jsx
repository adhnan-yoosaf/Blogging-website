import React from 'react'
import * as formik from 'formik';
import * as yup from 'yup';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux'
import useToastAndNavigate from '../hooks/useToastAndNavigate';
import './ResetPassword.css'
import { confirmPasswordResetThunk, generatePasswordResetOtpThunk } from '../redux/userSlice';

const ResetPassword = () => {
    const { Formik } = formik;

    const dispatch = useDispatch();
    const showToast = useToastAndNavigate();

    const schema = yup.object().shape({
        email: yup.string().required('Email is required'),
        otp: yup.string().required('OTP is required'),
        newPassword: yup.string().required('New password is required'),
        confirmPassword: yup.string()
            .required('Confirm password is required')
            .oneOf([yup.ref('newPassword')], 'Confirm password should match new password'),
    });

    const handleOtpSend = (email) => {
        dispatch(generatePasswordResetOtpThunk({ email }))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message)
            }).catch((err) => {
                showToast(false, err?.message)
            })
    }

    const handlePasswordResetConfirm = (resetData) => {
        dispatch(confirmPasswordResetThunk(resetData))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message, '/login')
            }).catch((err) => {
                showToast(false, err?.message)
            })

    }

    return (
        <Container className="vh-100 py-5">
            <Row className="align-items-center justify-content-center mt-5">
                <Col xs={12} sm={10} md={8} lg={6} xl={4}>
                    <Card className="p-4 p-md-5 shadow border-0">
                        <h3 className="text-center mb-4 fw-bold">Reset Password</h3>
                        <Formik
                            validationSchema={schema}
                            onSubmit={handlePasswordResetConfirm}
                            initialValues={{
                                email: '',
                                otp: '',
                                newPassword: '',
                                confirmPassword: ''
                            }}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors, }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="validationFormik01">
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
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="validationFormik02">
                                            <Form.Label>OTP</Form.Label>
                                            <div className="position-relative">
                                                <Form.Control
                                                    type="text"
                                                    name="otp"
                                                    value={values.otp}
                                                    onChange={handleChange}
                                                    isValid={touched.otp && !errors.otp}
                                                    isInvalid={touched.otp && !!errors.otp}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.otp}
                                                </Form.Control.Feedback>
                                                <Button className='reset-password-otp-btn' onClick={() => handleOtpSend(values.email)}>Send OTP</Button>
                                            </div>
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="validationFormik03">
                                            <Form.Label>New Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="newPassword"
                                                value={values.newPassword}
                                                onChange={handleChange}
                                                isValid={touched.newPassword && !errors.newPassword}
                                                isInvalid={touched.newPassword && !!errors.newPassword}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.newPassword}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="validationFormik04">
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="confirmPassword"
                                                value={values.confirmPassword}
                                                onChange={handleChange}
                                                isValid={touched.confirmPassword && !errors.confirmPassword}
                                                isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.confirmPassword}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <div className="mt-4">
                                        <Button type="submit" variant='dark' className='w-100'>
                                            Reset Password
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPassword;
