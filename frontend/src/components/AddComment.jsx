import React from 'react'
import * as formik from 'formik';
import * as yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addCommentThunk } from '../redux/blogSlice';
import useToastAndNavigate from '../hooks/useToastAndNavigate';

const AddComment = () => {

    const { Formik } = formik;

    const schema = yup.object().shape({
        content: yup.string().required(),
    });

    const dispatch = useDispatch();
    const showToast = useToastAndNavigate();

    const { user } = useSelector((state) => state.auth);
    const { blog } = useSelector((state) => state.blogs);

    const handleCommentAdd = (content, { resetForm }) => {
        resetForm();
        dispatch(addCommentThunk({ content, id: blog._id }))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message)
            }).catch((err) => {
                showToast(false, err?.message)
            })
    }

    return (
        <Formik
            validationSchema={schema}
            onSubmit={handleCommentAdd}
            initialValues={{
                content: '',
            }}
        >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group controlId="validationFormik01">
                        <Form.Control
                            as='textarea'
                            name="content"
                            rows={3}
                            placeholder="Leave a comment..."
                            value={values.content}
                            onChange={handleChange}
                            isValid={touched.content && !errors.content}
                            isInvalid={touched.content && !!errors.content}
                        />
                        <Form.Control.Feedback type='invalid'>{errors.content}</Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit" variant='outline-dark' className='mt-3'>
                        {user ? 'Post Comment' : 'Login to Comment'}
                    </Button>
                </Form>
            )}
        </Formik>
    )
}

export default AddComment