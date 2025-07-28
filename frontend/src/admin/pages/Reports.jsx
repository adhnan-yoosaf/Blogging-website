import React, { useEffect } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import useToastAndNavigate from '../../hooks/useToastAndNavigate';
import { getAllReportsThunk, resolveReportThunk } from '../../redux/reportSlice';
import { useNavigate } from 'react-router-dom';
import { deleteBlogThunk } from '../../redux/blogSlice';

const Reports = () => {
    const dispatch = useDispatch();
    const showToast = useToastAndNavigate();
    const navigate = useNavigate();

    const { reports } = useSelector((state) => state.reports);

    useEffect(() => {
        dispatch(getAllReportsThunk())
            .unwrap()
            .catch((err) => {
                showToast(false, err?.message);
            });
    }, [])

    const handleBlogDelete = (id) => {
        dispatch(deleteBlogThunk(id))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message);
            })
            .catch((err) => {
                showToast(false, err?.message);
            });
    };

    const handleResolveReport = (id) => {
        dispatch(resolveReportThunk(id))
            .unwrap()
            .then((data) => {
                showToast(data?.success, data?.message);
            })
            .catch((err) => {
                showToast(false, err?.message);
            });
    };

    return (
        <Container>
            <Row className="my-3">
                <Col>
                    <h2>Reports</h2>
                </Col>
            </Row>

            <Row>
                {reports && reports.length > 0 ? (
                    reports.map((report) => (
                        <Col md={12} key={report._id}>
                            <Card className="mb-3 shadow-sm">
                                <Card.Body>
                                    <Card.Title>
                                        {report.blog?.title || 'Deleted Blog'}
                                    </Card.Title>
                                    <Card.Text>
                                        <strong>From:</strong> {report.sender.fullName}<br />
                                        <strong>Reason:</strong> {report.reason}<br />
                                        <strong>Status: </strong>
                                        <span>
                                            {report.isResolved ? 'Resolved' : 'Pending'}
                                        </span>
                                    </Card.Text>

                                    <div className="d-flex flex-wrap gap-2 mt-3">
                                        <Button
                                            variant="outline-dark"
                                            onClick={() => navigate(`/blog/${report.blog?._id}`)}
                                            disabled={!report.blog?._id}
                                        >
                                            View Blog
                                        </Button>

                                        <Button
                                            variant="dark"
                                            onClick={() => handleBlogDelete(report.blog?._id)}
                                            disabled={!report.blog?._id}
                                        >
                                            Delete Blog
                                        </Button>

                                        <Button
                                            variant="outline-dark"
                                            onClick={() => handleResolveReport(report._id)}
                                            disabled={report.isResolved}
                                        >
                                            {report.isResolved ? 'Resolved' : 'Mark As Resolved'}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <h4>No Reports Found</h4>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default Reports;
