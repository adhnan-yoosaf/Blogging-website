import React from 'react'
import * as formik from 'formik';
import * as yup from 'yup';
import { Button, Card, Col, Container, Form, Image, Row } from 'react-bootstrap';
import loginImage from '../images/login.svg';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useToastAndNavigate from '../hooks/useToastAndNavigate';
import { userRegisterThunk } from '../redux/authSlice';

const Register = () => {
    const { Formik } = formik;

    const dispatch = useDispatch();
    const showToast = useToastAndNavigate();

    const schema = yup.object().shape({
        fullName: yup.string().required('Please enter your fullname'),
        email: yup.string().required('Please enter your email address').email('Please enter a valid email'),
        phone: yup.string().required('Please enter your phone number'),
        password: yup.string().required('Please enter your password'),
    });

    const handleRegister = (userData) => {
        dispatch(userRegisterThunk(userData))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message, '/login');
            }).catch((err) => {
                showToast(false, err?.message);
            })
    }

    return (
        <Container className="vh-100">
            <Row className="align-items-center justify-content-center mt-5">
                <Col lg={6} className="mb-4 mb-lg-0 d-none d-lg-flex justify-content-center">
                    <Image src={loginImage} alt="login" className="w-75 w-md-50" />
                </Col>

                <Col xs={12} sm={10} md={8} lg={6} xl={4}>
                    <Card className="p-4 p-md-5 shadow border-0">
                        <h3 className="text-center mb-4 fw-bold">Register</h3>
                        <Formik
                            validationSchema={schema}
                            onSubmit={handleRegister}
                            initialValues={{
                                fullName: '',
                                email: '',
                                phone: '',
                                password: '',
                            }}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors, }) => (
                                <Form noValidate onSubmit={handleSubmit}>
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
                                    <Row>
                                        <Form.Group as={Col} controlId="validationFormik04">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={values.password}
                                                onChange={handleChange}
                                                isValid={touched.password && !errors.email}
                                                isInvalid={touched.password && !!errors.password}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <div className="mt-5">
                                        <Button type="submit" variant='dark' className='w-100'>
                                            Register
                                        </Button>
                                        <p className='text-center mt-2'>Already have an account? <Link to={'/login'}>Login.</Link></p>
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

export default Register;
