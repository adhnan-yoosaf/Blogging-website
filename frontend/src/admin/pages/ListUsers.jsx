import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useToastAndNavigate from '../../hooks/useToastAndNavigate'
import { deleteUserThunk, getAllUsersThunk, userRoleUpdateThunk } from '../../redux/userSlice'

const ListUsers = () => {

    const dispatch = useDispatch();

    const showToast = useToastAndNavigate();

    const navigate = useNavigate();

    const { users } = useSelector((state) => state.user)

    const formatDate = (date) => {
        date = new Date(date);
        const formattedDate = date.toLocaleDateString('en', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
        return formattedDate;
    }

    const [show, setShow] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null)

    const handleClose = () => { setShow(false) };
    const handleShow = (id) => {
        setShow(true)
        setUserToDelete(id)
    };

    useEffect(() => {
        dispatch(getAllUsersThunk())
            .unwrap()
            .catch((err) => {
                showToast(false, err?.message)
            })
    }, [])

    const handleUserRoleUpdate = (id, role) => {
        dispatch(userRoleUpdateThunk({ id, role }))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message)
            }).catch((err) => {
                showToast(false, err.message)
            })
    }

    const handleUserDelete = (id) => {
        dispatch(deleteUserThunk(id))
            .then((data) => {
                showToast(data?.success, data?.message)
            }).catch((err) => {
                showToast(false, err?.message)
            })
        handleClose()
    }

    return (
        <Container>
            <Row className='mt-5'>
                <Col>
                    <Table striped bordered responsive hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Date Joined</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, i) => (
                                <tr key={user._id}>
                                    <td>{i + 1}</td>
                                    <td onClick={() => navigate(`/profile/${user._id}`)} className='fw-bold link-dark'>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>{formatDate(user.createdAt)}</td>
                                    <td>
                                        <Form.Select
                                            defaultValue={user.role}
                                            onChange={(e) => handleUserRoleUpdate(user._id, e.target.value)}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </Form.Select>
                                    </td>
                                    <td className="text-center">
                                        <MdDelete
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleShow(user._id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>This action is irreversible</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="outline-dark" onClick={() => handleUserDelete(userToDelete)}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default ListUsers