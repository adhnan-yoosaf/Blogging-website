import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white text-dark mt-5 py-4">
            <Container>
                <Row className="text-center text-md-start">
                    <Col md={4} className="mb-3 mb-md-0">
                        <h5>About</h5>
                        <p>
                            Welcome to my cozy corner of the internet - where thoughts turn into words and words into stories.
                        </p>
                    </Col>

                    <Col md={4} className="mb-3 mb-md-0">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/" className="text-decoration-none text-dark">Home</Link></li>
                            <li><Link to="/all-blogs" className="text-decoration-none text-dark">All Blogs</Link></li>
                            <li><Link to="/about" className="text-decoration-none text-dark">About</Link></li>
                            <li><Link to="/contact" className="text-decoration-none text-dark">Contact</Link></li>
                        </ul>
                    </Col>


                    <Col md={4}>
                        <h5>Follow Us</h5>
                        <div className="d-flex justify-content-center justify-content-md-start gap-3">
                            <a className="text-dark fs-4">
                                <FaFacebook />
                            </a>
                            <a className="text-dark fs-4">
                                <FaTwitter />
                            </a>
                            <a className="text-dark fs-4">
                                <FaInstagram />
                            </a>
                            <a className="text-dark fs-4">
                                <FaGithub />
                            </a>
                        </div>
                    </Col>
                </Row>

                <hr className="bg-light my-4" />

                <Row>
                    <Col className="text-center">
                        <small>&copy; {new Date().getFullYear()} Blogora. All rights reserved.</small>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
