import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Navbar from './Navbar';
import './home.css';

const Home = () => {
    return (
        <>
            <Navbar />
            <header className="hero-section">
                <div className="overlay"></div>
                <Container className="hero-content text-center">
                    <h1 className="main-title">Eco-Sort: Revolutionizing Waste Management</h1>
                    <p className="subtitle">A smarter, cleaner future for our cities</p>
                    <Button variant="outline-light" className="cta-button">Join the Movement</Button>
                </Container>
            </header>

            <section className="features-section text-center">
                <Container>
                    <h2 className="section-title">Our Key Features</h2>
                    <Row className="justify-content-center">
                        <Col md={4} className="feature-box">
                            <i className="fas fa-recycle feature-icon"></i>
                            <h3>Smart Bins</h3>
                            <p>Real-time monitoring of waste levels and intelligent scheduling for collection.</p>
                        </Col>
                        <Col md={4} className="feature-box">
                            <i className="fas fa-map-marker-alt feature-icon"></i>
                            <h3>Optimized Routes</h3>
                            <p>Efficient routes for waste collectors, reducing costs and carbon footprint.</p>
                        </Col>
                        <Col md={4} className="feature-box">
                            <i className="fas fa-chart-pie feature-icon"></i>
                            <h3>Data Insights</h3>
                            <p>Comprehensive analytics to enhance waste management strategies.</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="cta-section text-center">
                <Container>
                    <h2>Be Part of the Change</h2>
                    <p>Contribute to a sustainable future with Eco-Sort.</p>
                    <Button variant="success" className="cta-button-large">Get Started</Button>
                </Container>
            </section>

            <footer className="footer text-center">
                <Container>
                    <p>&copy; 2024 Eco-Sort. All Rights Reserved | <a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Service</a></p>
                </Container>
            </footer>
        </>
    );
};

export default Home;