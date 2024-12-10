"use client";

import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"; // Import icons from react-icons

const AppFooter = () => {
  return (
    <footer className="bg-body-tertiary py-5">
      <Container>
        <Row>
          {/* Column 1: About Us */}
          <Col sm={12} md={4}>
            <h5>About Us</h5>
            <p>
              We are a clothing store offering a wide variety of stylish and trendy clothing for all ages and sizes.
            </p>
          </Col>

          {/* Column 3: Social Media */}
          <Col sm={12} md={4}>
            <h5>Follow Us</h5>
            <div className="d-flex gap-3">
              <Link href="https://www.facebook.com" className="text-dark" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={24} />
              </Link>
              <Link href="https://www.instagram.com" className="text-dark" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={24} />
              </Link>
              <Link href="https://www.twitter.com" className="text-dark" target="_blank" rel="noopener noreferrer">
                <FaTwitter size={24} />
              </Link>
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col className="text-center">
            <p>&copy; {new Date().getFullYear()} Clothing Store. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default AppFooter;
