"use client";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Link from "next/link";


const AppHeader = () => {
  return (
    <Navbar expand="lg" className="bg-dark text-white py-3 shadow-sm">
      <Container>
        {/* Logo hoặc Brand */}
        <Link href="/" className="navbar-brand text-white fw-bold">
          <span style={{ color: "#ff7f50" }}>Cloth</span> Store
        </Link>

        {/* Toggle Button cho menu nhỏ */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />

        {/* Navigation Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Link href="/" className="nav-link text-white px-3">
              Home
            </Link>
            <Link href="/report" className="nav-link text-white px-3">
              Report
            </Link>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppHeader;

