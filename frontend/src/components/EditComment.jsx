import React from 'react'
import * as formik from 'formik';
import * as yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { editCommentThunk } from '../redux/blogSlice';
import useToastAndNavigate from '../hooks/useToastAndNavigate';

const EditComment = ({ commentId, setIsCommentEditing }) => {

    const { Formik } = formik;

    const dispatch = useDispatch();
    const showToast = useToastAndNavigate();

    const schema = yup.object().shape({
        content: yup.string().required(),
    });

    const { blog } = useSelector((state) => state.blogs);

    const comment = blog.comments.find((c) => c._id === commentId)

    const handleCommentEdit = (content, { resetForm }) => {
        resetForm();
        dispatch(editCommentThunk({ blogId: blog._id, commentId, content }))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message)
            }).catch((err) => {
                showToast(false, err?.message)
            })
        setIsCommentEditing(false)
    }

    return (
        <Formik
            validationSchema={schema}
            onSubmit={handleCommentEdit}
            initialValues={{
                content: comment?.content,
            }}
            enableReinitialize
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
                        update comment
                    </Button>
                    <Button
                        type="button"
                        variant='dark'
                        className='mt-3 ms-3'
                        onClick={() => setIsCommentEditing(false)}
                    >
                        cancel
                    </Button>
                </Form>
            )}
        </Formik>
    )
}

export default EditComment