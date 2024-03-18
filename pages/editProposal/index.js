import Proposal from "@/components/forms/proposalForm";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

function Index() {

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

  return (
    <div>
      {loggedIn ? (
        <>
          <Proposal/>
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

export default Index;
