import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useToastAndNavigate from '../../hooks/useToastAndNavigate'
import { getAllContactMsgThunk, markContactMsgAsReadThunk, sendReplyThunk } from '../../redux/contactSlice'
import { Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap'
import * as formik from 'formik';
import * as yup from 'yup';

const ContactMessages = () => {

    const { Formik } = formik;

    const dispatch = useDispatch()

    const showToast = useToastAndNavigate()

    const { contactMsgs } = useSelector((state) => state.contacts)

    const schema = yup.object().shape({
        reply: yup.string().required('Please enter your email address'),
    });

    useEffect(() => {
        dispatch(getAllContactMsgThunk())
            .unwrap()
            .catch((err) => {
                showToast(false, err?.message)
            })
    }, [])

    const [show, setShow] = useState(false);
    const [contactToReply, setContactToReply] = useState(null)

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        setShow(true)
        setContactToReply(id)
    };

    const handleMarkAsRead = (id) => {
        dispatch(markContactMsgAsReadThunk(id))
    }

    const handleReply = (reply) => {
        console.log({ id: contactToReply, reply })
        dispatch(sendReplyThunk({ id: contactToReply, reply }))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message)
                handleClose()
            }).catch((err) => {
                showToast(false, err?.message)
            })
    }

    return (
        <Container>
            <Row>
                <Col className='my-4'>
                    <h3>Contact Messages</h3>
                </Col>
                {contactMsgs.map(c => (
                    <Card key={c._id} className={`mb-3 p-3 ${c.isRead ? 'opacity-75' : ''}`}>
                        <Card.Body>
                            <Card.Title><strong>From:</strong> {c?.name}</Card.Title>
                            <Card.Text><strong>subject:</strong> {c?.subject}</Card.Text>
                            <Card.Text><strong>message:</strong> {c?.message}</Card.Text>
                            <small>{new Date(c.createdAt).toLocaleString()}</small>
                        </Card.Body>

                        <div className=' d-flex gap-3 ms-3'>
                            <Button
                                variant='outline-dark'
                                onClick={() => handleMarkAsRead(c._id)}
                                disabled={c.isRead}

                            >
                                Mark as Read
                            </Button>
                            <Button
                                variant='outline-dark'
                                onClick={() => handleShow(c._id)}
                            >
                                Reply
                            </Button>
                        </div>
                    </Card>
                ))}
            </Row>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton >
                    <Modal.Title>Reply</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        validationSchema={schema}
                        initialValues={{ reply: '' }}
                        onSubmit={(values) => handleReply(values.reply)}
                    >
                        {({ handleSubmit, handleChange, values, touched, errors }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="validationFormik01">
                                        <Form.Control
                                            as='textarea'
                                            name="reply"
                                            value={values.reply}
                                            onChange={handleChange}
                                            isValid={touched.reply && !errors.reply}
                                            isInvalid={touched.reply && !!errors.reply}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.reply}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Modal.Footer>
                                    <Button variant="dark" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="outline-dark" type='submit'>
                                        Send
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        )}
                    </Formik>

                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default ContactMessages