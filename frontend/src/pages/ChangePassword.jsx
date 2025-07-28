import React from 'react'
import * as formik from 'formik';
import * as yup from 'yup';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux'
import useToastAndNavigate from '../hooks/useToastAndNavigate';
import { changePasswordThunk, userLogoutThunk } from '../redux/authSlice';

const ChangenewPassword = () => {
    const { Formik } = formik;

    const dispatch = useDispatch();
    const showToast = useToastAndNavigate();

    const schema = yup.object().shape({
        currPassword: yup.string().required('Current password is required'),
        newPassword: yup.string()
            .required('New password is required')
            .notOneOf([yup.ref('currPassword')], 'New password should be different from current password'),
        confirmPassword: yup.string()
            .required('Confirm password is required')
            .oneOf([yup.ref('newPassword')], 'Confirm password should match new password'),
    });

    const handlePasswordChange = (values) => {
        dispatch(changePasswordThunk(values))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message, '/login')
                dispatch(userLogoutThunk())
            }).catch((err) => {
                showToast(false, err?.message)
            })
    }

    return (
        <Container className="vh-100 py-5">
            <Row className="align-items-center justify-content-center mt-5">
                <Col xs={12} sm={10} md={8} lg={6} xl={4}>
                    <Card className="p-4 p-md-5 shadow border-0">
                        <h3 className="text-center mb-4 fw-bold">Change Password</h3>
                        <Formik
                            validationSchema={schema}
                            onSubmit={handlePasswordChange}
                            initialValues={{
                                currPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                            }}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors, }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="validationFormik01">
                                            <Form.Label>Current Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="currPassword"
                                                value={values.currPassword}
                                                onChange={handleChange}
                                                isValid={touched.currPassword && !errors.currPassword}
                                                isInvalid={touched.currPassword && !!errors.currPassword}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.currPassword}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="validationFormik02">
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
                                        <Form.Group as={Col} controlId="validationFormik03">
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
                                            Change Password
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

export default ChangenewPassword;
