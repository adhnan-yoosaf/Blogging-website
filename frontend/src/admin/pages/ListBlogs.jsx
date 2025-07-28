import React, { useEffect } from 'react'
import { Col, Container, Row, Table } from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useToastAndNavigate from '../../hooks/useToastAndNavigate'
import { getAllBlogsThunk } from '../../redux/blogSlice'

const ListBlogs = () => {

    const dispatch = useDispatch();

    const showToast = useToastAndNavigate();

    const navigate = useNavigate();

    const { blogs } = useSelector((state) => state.blogs)

    const formatDate = (date) => {
        date = new Date(date);
        const formattedDate = date.toLocaleDateString('en', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
        return formattedDate;
    }

    useEffect(() => {
        dispatch(getAllBlogsThunk())
            .unwrap()
            .catch((err) => {
                showToast(false, err?.message)
            })
    }, [])

    return (
        <Container>
            <Row className='mt-5'>
                <Col>
                    <Table striped bordered responsive hover className='recent-blogs-table'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Published</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog, i) => (
                                <tr key={blog._id}>
                                    <td>{i + 1}</td>
                                    <td onClick={() => navigate(`/blog/${blog._id}`)} className='blog-title'>{blog.title}</td>
                                    <td>{blog.author.fullName}</td>
                                    <td>{formatDate(blog.createdAt)}</td>
                                    <td className="text-center">
                                        <MdDelete
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => alert("Delete this blog?")}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}

export default ListBlogs