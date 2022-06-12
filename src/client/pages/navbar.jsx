import React from 'react';
import { Nav } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import LogoHorizontal from './rw_w_80.png';

function MyNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Navbar.Brand href="/">
        <div className="mx-lg-5"><img src={LogoHorizontal} alt="rw logo" /></div>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/">
            <p className="fs-4 mx-lg-3 pt-lg-2">BROWSE</p>
          </Nav.Link>
          <Nav.Link href="/upload-file">
            <p className="fs-4 mx-lg-3 pt-lg-2">UPLOAD</p>
          </Nav.Link>
          <Nav.Link href="/login">
            <p className="fs-4 mx-lg-3 pt-lg-2">USER</p>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default MyNavbar;
