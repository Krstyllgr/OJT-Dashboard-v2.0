import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faUsers,
  faMagnifyingGlassChart,
  faFilePen,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";

function Home() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    const isLoggedIn = window.localStorage.getItem("isLoggedIn");
    setLoggedIn(isLoggedIn === "true");

    // Show modal if not logged in
    if (!isLoggedIn) {
      setShowModal(true);
    }
  }, []);



  const handleCloseModal = () => setShowModal(false);

  const [cards] = useState([
    {
      // DRAFTS
      title: "New Proposal",
      icon: faFile,
      color: "linear-gradient(40deg, #2193b0, #6dd5ed)",
      link: "/addProposal",
    },
    {
      // EVALUATION
      title: "Under Evaluation",
      icon: faMagnifyingGlassChart,
      color: "linear-gradient(40deg, #b993d6, #8ca6db)",
      link: "/evaluation",
    },
    {
      // REVISION
      title: "Revision",
      icon: faFilePen,
      color: "linear-gradient(40deg, #ffa751, #ffe259)",
      link: "/revision",
    },
    {
      // APPROVED
      title: "Approved",
      icon: faCircleCheck,
      color: "linear-gradient(40deg, #56ab2f, #a8e063)",
      link: "/approved",
    },
    {
      // DISAPPROVED
      title: "Disapproved",
      icon: faCircleXmark,
      color: "linear-gradient(40deg, #ff5e62, #ff9966)",
      link: "/disapproved",
    },
  ]);

  return (
    <div>
      {loggedIn ? (
        <>
          <Navbar />
          <section className="d-flex flex-column align-items-center">
            <Container
              className="container-fluid"
              style={{ marginTop: "13vh" }}
            >
              <Container>
                <h4>
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-danger me-3"
                  ></FontAwesomeIcon>
                  {"Hello "}
                </h4>
                <h4 className="ms-5">
                  {loggedIn && JSON.parse(window.localStorage.getItem("user")).name}
                </h4>
                <hr></hr>
              </Container>

              {/* CARDS */}
              <Row className="mt-3 d-flex flex-row">
                {cards.map((card, i) => (
                  <Col key={i} xs={12} md={6} lg={4} xl={3} className="mb-3">
                    <Link href={card.link} className="text-decoration-none">
                      <Card
                        className={`${styles.cards} border-0 text-light`}
                        style={{ background: card.color }}
                      >
                        <Card.Title className="fs-5 ms-2 mt-2 text-light">
                          {card.title}
                        </Card.Title>
                        <Card.Body className="d-flex flex-column justify-content-center">
                          <FontAwesomeIcon
                            icon={card.icon}
                            className="text-light display-3 opacity-50 z-1 mt-2 mb-5"
                          ></FontAwesomeIcon>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </Container>
          </section>
        </>
      ) : (
        <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
          <Modal.Header>
            <Modal.Title>Please Log In</Modal.Title>
          </Modal.Header>
          <Modal.Body>Please log in to access this page.</Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default Home;
