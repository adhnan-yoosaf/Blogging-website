import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Footer from '../components/Footer';

const About = () => {
    return (
        <>
            <Container className="mt-5">
                <Row className="justify-content-center text-center">
                    <Col md={8}>
                        <h1 className="mb-4 fw-bold">About Us</h1>
                        <p className="lead">
                            Welcome to a space built for thinkers, storytellers, ranters, and readers alike. This is your platform.
                        </p>
                    </Col>
                </Row>

                <Row className="mt-4 align-items-stretch">
                    <Col md={6} className="mb-4">
                        <Card className="p-4 shadow-sm h-100">
                            <h4>Write. Share. Be Heard.</h4>
                            <p>
                                Whether you're a seasoned writer or someone with a spark of an idea, this platform gives you the tools to express yourself freely.
                                Hit "Publish" and let your thoughts travel across the world. No gatekeepers, no approval queues—just pure expression.
                            </p>
                        </Card>
                    </Col>

                    <Col md={6} className="mb-4">
                        <Card className="p-4 shadow-sm h-100">
                            <h4>Read. Explore. Connect.</h4>
                            <p>
                                Every blog you see here is written by someone like you — curious, creative, and brave enough to hit "publish."
                                Discover fresh voices, unique perspectives, and stories that stick. Or just get lost in a rabbit hole of inspiration.
                            </p>
                        </Card>
                    </Col>
                </Row>


                <Row>
                    <Col>
                        <Card className="p-4 shadow-sm text-center mb-4">
                            <h5 className="mb-3">A blogging platform for everyone.</h5>
                            <p>
                                We believe everyone has a story worth telling — whether it's a deep dive into tech, a funny slice-of-life tale, or a brutally honest late-night thought.
                                This is your blank canvas. Paint with words.
                            </p>
                            <p className="text-muted fst-italic">No fame required. Just your voice.</p>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default About;
