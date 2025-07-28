import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import * as formik from 'formik';
import * as yup from 'yup';
import { Card, Container } from 'react-bootstrap';
import { useDispatch } from 'react-redux'
import useToastAndNavigate from '../hooks/useToastAndNavigate';
import { sendContactMsgThunk } from '../redux/contactSlice';

const Contact = () => {
    const { Formik } = formik;

    const dispatch = useDispatch();

    const showToast = useToastAndNavigate()

    const schema = yup.object().shape({
        name: yup.string().required('Please enter your name'),
        email: yup.string().required('Please enter a email').email('Invalid email'),
        subject: yup.string().required('Please enter a subject'),
        message: yup.string().required('Please enter a message'),
    });

    const handleContactSubmit = (values, { resetForm }) => {
        dispatch(sendContactMsgThunk(values))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message)
                resetForm()
            }).catch((err) => {
                showToast(false, err?.message)
            })
    }

    return (
        <Container>
            <Row className='justify-content-center mt-5 text-center'>
                <Col md={4}>
                    <h2>Contact Us</h2>
                </Col>
            </Row>
            <Row className='justify-content-center mt-3'>
                <Col md={4}>
                    <Formik
                        validationSchema={schema}
                        onSubmit={handleContactSubmit}
                        initialValues={{
                            name: '',
                            email: '',
                            subject: '',
                            message: '',
                        }}
                    >
                        {({ handleSubmit, handleChange, values, touched, errors }) => (
                            <Card className='p-5 border-0 shadow-sm'>
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="validationFormik01">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={values.name}
                                                onChange={handleChange}
                                                isInvalid={touched.name && !!errors.name}
                                                isValid={touched.name && !errors.name}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type='invalid'>
                                                {errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="validationFormik02">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                isValid={touched.email && !errors.email}
                                                isInvalid={touched.email && !!errors.email}
                                            />

                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type='invalid'>
                                                {errors.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group as={Col} controlId="validationFormik03">
                                            <Form.Label>Subject</Form.Label>
                                            <Form.Control
                                                type="subject"
                                                name="subject"
                                                value={values.subject}
                                                onChange={handleChange}
                                                isValid={touched.subject && !errors.subject}
                                                isInvalid={touched.subject && !!errors.subject}
                                            />

                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type='invalid'>
                                                {errors.subject}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group as={Col} controlId="validationFormik04">
                                            <Form.Label>Message</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="message"
                                                rows={5}
                                                value={values.message}
                                                onChange={handleChange}
                                                isValid={touched.message && !errors.message}
                                                isInvalid={touched.message && !!errors.message}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type='invalid'>
                                                {errors.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Button type="submit" variant='outline-dark' className='w-100 mt-3'>Submit</Button>
                                </Form>
                            </Card>
                        )}
                    </Formik>
                </Col>
            </Row>
        </Container>
    );
}

export default Contact;