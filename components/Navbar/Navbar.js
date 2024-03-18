import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Offcanvas, OverlayTrigger, Tooltip } from "react-bootstrap";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCirclePlus,
  faFileCircleQuestion,
  faFile,
  faFileCircleExclamation,
  faFileCircleCheck,
  faFileCircleXmark,
  faHouse,
  faUser,
  faRightFromBracket,
  faCircleUser,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";

function Navigationbar() {
  const [selectedTitle, setSelectedTitle] = useState("Proposal Status"); //FOR DROPDOWN TITLE
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown menu visibility

  const router = useRouter();

  // LOGOUT BUTTON
  const logoutButton = () => {
    window.localStorage.removeItem("isLoggedIn");
    window.localStorage.removeItem("userEmail");
  };

  // CARD'S CONTENTS
  const navLinks = [
    {
      id: 1,
      title: "Dashboard",
      link: "/",
      icon: faHouse,
    },
    {
      id: 2,
      title: "New Proposal",
      link: "/proposal",
      icon: faFileCirclePlus,
    },
    {
      id: 3,
      title: "Drafts",
      link: "/drafts",
      icon: faFile,
    },
    {
      id: 4,
      title: "Under Evaluation",
      link: "/evaluation",
      icon: faFileCircleQuestion,
    },
    {
      id: 5,
      title: "Revision",
      link: "/revision",
      icon: faFileCircleExclamation,
    },
    {
      id: 6,
      title: "Approved",
      link: "/approved",
      icon: faFileCircleCheck,
    },
    {
      id: 7,
      title: "Disapproved",
      link: "/disapproved",
      icon: faFileCircleXmark,
    },
  ];

  // FOR DROPDOWN TITLE
  const handleLinkClick = (title) => {
    const clickedItem = navLinks.find((item) => item.title === title);
    if (clickedItem && clickedItem.id >= 3 && clickedItem.id <= 7) {
      setSelectedTitle(title);
      localStorage.setItem("selectedTitle", title); // Save selected title to local storage
    } else {
      setSelectedTitle("Proposal Status"); // Set default title for items outside the dropdown menu
      localStorage.setItem("selectedTitle", "Proposal Status"); // Save default title to local storage
    }
  };

  // FOR DROPDOWN TITLE
  useEffect(() => {
    const storedTitle = localStorage.getItem("selectedTitle");
    if (storedTitle) {
      setSelectedTitle(storedTitle);
    }
  }, []); // Load selected title from local storage on component mount

  return (
    <Navbar
      expand="lg"
      className=" shadow-sm position"
      style={{ background: "#F2F2F2" }}
    >
      <Container>
        <Navbar.Brand className="d-flex align-items-center">
          <div className={styles.Nav_logo}></div>
          <span className="ms-2">Website Proposal</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" /> {/*SIDEBAR TOGGLER*/}
        {/* WHEN THE SCREEN GETS SMALLER THE NAVBAR TURNS TO SIDEBAR */}
        <Navbar.Offcanvas id={`offcanvasNavbar`} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand`}>
              Website Proposal
            </Offcanvas.Title>
          </Offcanvas.Header>
          {/* className="align-baseline" */}
          <Offcanvas.Body>
            <Nav className=" d-flex gap-4 justify-content-end ms-auto align-items-center">
              {/* PROPOSAL STATUS ARE SHOWN WITH DROPDOWN */}
              {navLinks.map((navItem) => (
                <React.Fragment key={navItem.id}>
                  {(navItem.id === 1 || navItem.id === 2) && (
                    <Link
                      href={navItem.link}
                      className={`${styles.custom_link} text-decoration-none ${
                        router.pathname === navItem.link ? styles.active : ""
                      }`}
                      onClick={() => handleLinkClick(navItem.title)}
                    >
                      <FontAwesomeIcon
                        icon={navItem.icon}
                        className="me-2"
                        style={{ color: "#CE5A67" }}
                      ></FontAwesomeIcon>
                      {navItem.title}
                    </Link>
                  )}
                </React.Fragment>
              ))}
              <NavDropdown
                title={selectedTitle}
                id="basic-nav-dropdown"
                show={dropdownOpen} // Show the dropdown based on state
                onMouseEnter={() => setDropdownOpen(true)} // Open the dropdown on mouse enter
                onMouseLeave={() => setDropdownOpen(false)} // Close the dropdown on mouse leave
              >
                {navLinks.map((navItem) => (
                  <React.Fragment key={navItem.id}>
                    {navItem.id >= 3 && navItem.id <= 7 && (
                      <Link
                        href={navItem.link}
                        className={`dropdown-item ${
                          router.pathname === navItem.link ? styles.active : ""
                        }`}
                        onClick={() => handleLinkClick(navItem.title)}
                      >
                        <FontAwesomeIcon
                          icon={navItem.icon}
                          className="me-2"
                          style={{ color: "#CE5A67" }}
                        />
                        {navItem.title}
                      </Link>
                    )}
                  </React.Fragment>
                ))}
              </NavDropdown>
              {/* PROFILE */}
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="tooltip-profile">Profile</Tooltip>}
              >
                <Link
                  href="/profile"
                  className="text-decoration-none justify-content-center"
                >
                  <FontAwesomeIcon
                    icon={faCircleUser}
                    className="me-2 fs-2"
                    style={{ color: "#CE5A67" }}
                  ></FontAwesomeIcon>
                </Link>
              </OverlayTrigger>
              {/* LOGOUT */}
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="tooltip-profile">Sign Out</Tooltip>}
              >
                <Link
                  href="/login"
                  className="text-decoration-none justify-content-center"
                >
                  <FontAwesomeIcon
                    icon={faDoorOpen}
                    className="fs-2"
                    style={{ color: "#CE5A67" }}
                    onClick={logoutButton}
                  ></FontAwesomeIcon>
                </Link>
              </OverlayTrigger>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default Navigationbar;
