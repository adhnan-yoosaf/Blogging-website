import React from 'react'
import * as formik from 'formik';
import * as yup from 'yup';
import { Button, Card, Col, Container, Form, Image, Row } from 'react-bootstrap';
import loginImage from '../images/login.svg';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import useToastAndNavigate from '../hooks/useToastAndNavigate';
import { userLoginThunk } from '../redux/authSlice';

const Login = () => {
    const { Formik } = formik;

    const dispatch = useDispatch();
    const showToast = useToastAndNavigate();

    const schema = yup.object().shape({
        email: yup.string().required('Please enter your email address').email('Please enter a valid email'),
        password: yup.string().required('Please enter your password'),
    });

    const handleLogin = (loginData) => {
        dispatch(userLoginThunk(loginData))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message, '/')
            }).catch((err) => {
                showToast(false, err?.message)
            })
    }


    return (
        <Container className="vh-100 py-5">
            <Row className="align-items-center justify-content-center mt-5">
                <Col lg={6} className="mb-4 mb-lg-0 d-none d-lg-flex justify-content-center">
                    <Image src={loginImage} alt="login" className="w-75 w-md-50" />
                </Col>

                <Col xs={12} sm={10} md={8} lg={6} xl={4}>
                    <Card className="p-4 p-md-5 shadow border-0">
                        <h3 className="text-center mb-4 fw-bold">Login</h3>
                        <Formik
                            validationSchema={schema}
                            onSubmit={handleLogin}
                            initialValues={{
                                email: '',
                                password: '',
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
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={values.password}
                                                onChange={handleChange}
                                                isValid={touched.password && !errors.password}
                                                isInvalid={touched.password && !!errors.password}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <p className='text-end'>
                                        <Link to={'/reset-password'} className='text-black'>Forgot Password?</Link>
                                    </p>
                                    <div className="mt-3">
                                        <Button type="submit" variant='dark' className='w-100'>
                                            Login
                                        </Button>
                                        <p className='text-center mt-2'>Don't have an account? <Link to={'/register'} className='text-black'>Register here.</Link></p>
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

export default Login;
