import React, { useEffect } from 'react'
import * as formik from 'formik';
import * as yup from 'yup';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import useToastAndNavigate from '../hooks/useToastAndNavigate';
import RichTextEditor from '../components/RichTextEditor';
import { createBlogThunk, editBlogThunk, getBlogByIdThunk } from '../redux/blogSlice';
import { useParams } from 'react-router-dom';

const EditBlog = () => {
    const { Formik } = formik;

    const dispatch = useDispatch();
    const showToast = useToastAndNavigate();

    const { id } = useParams();

    const { blog } = useSelector((state) => state.blogs)


    useEffect(() => {
        dispatch(getBlogByIdThunk(id))
            .unwrap()
            .catch((err) => {
                showToast(false, err?.message)
            })
    }, [])

    const schema = yup.object().shape({
        title: yup.string().required(),
        content: yup.string().required(),
        coverImage: yup.string().required(),
        category: yup.string().required(),
    });

    const handleBlogEdit = (values) => {
        dispatch(editBlogThunk({ _id: blog._id, ...values }))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message, `/blog/${blog._id}`)
            }).catch((err) => {
                showToast(false, err?.message)
            })
    }

    return (
        <Container>
            <Row className="align-items-center justify-content-center mt-5">
                <Col md={8} lg={6}>
                    <Card className="p-4 p-md-5 shadow border-0">
                        <h3 className='text-center fw-bold'>Edit Blog</h3>
                        <Formik
                            validationSchema={schema}
                            onSubmit={handleBlogEdit}
                            initialValues={{
                                title: blog?.title || '',
                                content: blog?.content || '',
                                coverImage: blog?.coverImage || '',
                                category: blog?.category || ''
                            }}
                            enableReinitialize
                        >

                            {({ handleSubmit, handleChange, values, touched, errors, setFieldValue }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Row className="mb-1">
                                        <Form.Group as={Col} controlId="validationFormik01">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                placeholder='Enter a blog title'
                                                value={values.title}
                                                onChange={handleChange}
                                                isValid={touched.title && !errors.title}
                                                isInvalid={touched.title && !!errors.title}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.title}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-1">
                                        <Form.Group as={Col} controlId='validationForm02'>
                                            <Form.Label>Category</Form.Label>
                                            <Form.Select
                                                name='category'
                                                value={values.category}
                                                onChange={handleChange}
                                                isValid={touched.category && !errors.category}
                                                isInvalid={touched.category && !!errors.category}
                                            >
                                                <option>Select a category</option>
                                                <option value="tech">Tech</option>
                                                <option value="lifestyle">lifestyle</option>
                                                <option value="travel">Travel</option>
                                                <option value="education">Education</option>
                                                <option value="entertainment">Entertainment</option>
                                                <option value="others">Others</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.category}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId='validationForm03'>
                                            <Form.Label>Cover Image</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="coverImage"
                                                onChange={(e) => setFieldValue('coverImage', e.currentTarget.files[0])}
                                                isValid={touched.coverImage && !errors.coverImage}
                                                isInvalid={touched.coverImage && !!errors.coverImage}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.coverImage}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group as={Col} controlId='validationForm04'>
                                            <Form.Label>Content</Form.Label>
                                            <RichTextEditor
                                                initialValue={blog?.content}
                                                value={values.content}
                                                onChange={(value) => setFieldValue('content', value)}
                                            />
                                        </Form.Group>
                                    </Row>

                                    <div className="mt-5">
                                        <Button type="submit" variant='dark' className='w-100'>
                                            Update
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

export default EditBlog;
