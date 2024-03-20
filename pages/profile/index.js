import React, { useState, useEffect } from "react";
import Navigationbar from "@/components/Navbar/Navbar";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare, faSave } from "@fortawesome/free-regular-svg-icons";
import { useMutation } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import { getUserProfile, updateUserProfile } from "../api/proposal";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpValidation } from "@/pages/schema";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/styles/Home.module.css";


function Index() {
    const { formState: { errors } } = useForm({
      resolver: yupResolver(signUpValidation),
    });

  const [loggedIn, setLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState(""); // State to store email
  const [id, setId] = useState("");

  useEffect(() => {
    const isLoggedIn = window.localStorage.getItem("isLoggedIn");
    setLoggedIn(isLoggedIn === "true");
    // Show modal if not logged in
    if (!isLoggedIn) {
      setShowModal(true);
    }

    // Retrieve email from local storage
    const userEmail = window.localStorage.getItem("userEmail");
    if (userEmail) {
      // Set the email state
      setEmail(userEmail);
      // Use the email to fetch user profile
      getUserProfile(userEmail)
        .then((response) => {
          setUserProfile(response.data);
          setId(response.data[0].id);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, []);

  // FOR UPDATING THE DATABASE
  const { mutate } = useMutation({
    mutationFn: updateUserProfile,
    mutationKey: "userProfileList",
  });

  const handleCloseModal = () => setShowModal(false);
  const handleEdit = () => setEditMode(true);
  
  const handleSave = () => {
    setEditMode(false);
    setShowPassword(false);
    // Collect form data
    const userData = {
      id: id,
      fullName: document.getElementById("fullNameField").value,
      email: document.getElementById("mailField").value,
      password: document.getElementById("passwordField").value,
      phoneNumber: document.getElementById("phoneNumberField").value,
      gender: document.getElementById("genderField").value,
      affiliation: document.getElementById("affiliationField").value,
      designation: document.getElementById("designationField").value,
    };

    try {
      mutate(userData);
      console.log("Successfully updated the User Information:", userData);
      toast.success("Successfully updated the proposal.", {
        autoClose: 1200, 
      });
    } catch (error) {
      console.log(error);
      toast.error("Error updating the proposal.", {
        autoClose: 1200,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



  return (
    <div>
      {loggedIn && userProfile ? (
        <>
          <Navigationbar />
          <Container className="mt-5">
            <Row className="justify-content-center">
              <Col md={3} className="text-center">
                <div
                  className="rounded p-4"
                  style={{ background: "#CE5A67" }}
                  // #029999
                >
                  <FontAwesomeIcon
                    icon={faCircleUser}
                    className="display-1 text-light mb-3 mt-4"
                  />
                  <h5 className="text-light mb-5">{userProfile[0].fullName}</h5>
                  {editMode ? (
                    <Button
                      variant="outline-light border-0"
                      onClick={handleSave}
                      className={styles.edit_button}
                    >
                      Save{" "}
                      <FontAwesomeIcon
                        icon={faSave}
                        className={`${styles.svg_icon} ms-2`}
                      />
                    </Button>
                  ) : (
                    <Button
                      variant="outline-light border-0"
                      onClick={handleEdit}
                      className={styles.edit_button}
                    >
                      Edit{" "}
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className={`${styles.svg_icon} ms-2`}
                      />
                    </Button>
                  )}
                </div>
              </Col>
              <Col md={6} className="ms-5">
                <h4 style={{ color: "#CE5A67" }}>User Info</h4>
                <Form className="mt-2">
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3" controlId="fullNameField">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          disabled={!editMode}
                          name="fullNameField"
                          defaultValue={
                            userProfile ? userProfile[0].fullName : "N/A"
                          }
                        />
                        {errors.fullNameField && (
                          <p
                            className="error text-danger fw-bolder"
                            style={{ fontSize: "12px" }}
                          >
                            {errors.fullNameField.message}
                          </p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="mailField">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          disabled
                          name="mailField"
                          defaultValue={
                            userProfile ? userProfile[0].email : "N/A"
                          }
                        />
                        {errors.mailField && (
                          <p
                            className="error text-danger fw-bolder"
                            style={{ fontSize: "12px" }}
                          >
                            {errors.mailField.message}
                          </p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="passwordField">
                        <Form.Label>Password</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            disabled={!editMode}
                            name="passwordField"
                            defaultValue={
                              userProfile ? userProfile[0].password : "N/A"
                            }
                          />
                          {editMode && (
                            <div
                              className="position-absolute end-0 me-3 top-50 translate-middle-y text-danger"
                              onClick={togglePasswordVisibility}
                              style={{ cursor: "pointer", zIndex: 1 }}
                            >
                              {showPassword ? (
                                <AiFillEyeInvisible />
                              ) : (
                                <AiFillEye />
                              )}
                            </div>
                          )}
                        </div>
                        {errors.passwordField && (
                          <p
                            className="error text-danger fw-bolder"
                            style={{ fontSize: "12px" }}
                          >
                            {errors.passwordField.message}
                          </p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="phoneNumberField">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          disabled={!editMode}
                          name="phoneNumberField"
                          defaultValue={
                            userProfile ? userProfile[0].phoneNumber : "N/A"
                          }
                        />
                        {errors.phoneNumberField && (
                          <p
                            className="error text-danger fw-bolder"
                            style={{ fontSize: "12px" }}
                          >
                            {errors.phoneNumberField.message}
                          </p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="genderField">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                          disabled={!editMode}
                          name="genderField"
                          defaultValue={
                            userProfile ? userProfile[0].gender : "N/A"
                          }
                        >
                          <option value="">Select your gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </Form.Select>
                        {errors.genderField && (
                          <p
                            className="error text-danger fw-bolder"
                            style={{ fontSize: "12px" }}
                          >
                            {errors.genderField.message}
                          </p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3" controlId="affiliationField">
                        <Form.Label>Affiliation</Form.Label>
                        <Form.Control
                          type="text"
                          disabled={!editMode}
                          name="affiliationField"
                          defaultValue={
                            userProfile ? userProfile[0].affiliation : "N/A"
                          }
                        />
                        {errors.affiliationField && (
                          <p
                            className="error text-danger fw-bolder"
                            style={{ fontSize: "12px" }}
                          >
                            {errors.affiliationField.message}
                          </p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3" controlId="designationField">
                        <Form.Label>Designation</Form.Label>
                        <Form.Control
                          type="text"
                          disabled={!editMode}
                          name="designationField"
                          defaultValue={
                            userProfile ? userProfile[0].designation : "N/A"
                          }
                        />
                        {errors.designationField && (
                          <p
                            className="error text-danger fw-bolder"
                            style={{ fontSize: "12px" }}
                          >
                            {errors.designationField.message}
                          </p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>

                {editMode && (
                  <Button variant="outline-light border-0" onClick={handleSave}>
                    Save <FontAwesomeIcon icon={faSave} className="ms-2" />
                  </Button>
                )}
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
          <Modal.Header>
            <Modal.Title>Please Log In</Modal.Title>
          </Modal.Header>
          <Modal.Body>Please log in to access this page.</Modal.Body>
        </Modal>
      )}
      <ToastContainer position="top-center" />
    </div>
  );
}

export default Index;
