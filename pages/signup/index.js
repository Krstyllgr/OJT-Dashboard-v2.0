  import "bootstrap/dist/css/bootstrap.min.css";
  import React, { useState } from "react";
  import Card from "react-bootstrap/Card";
  import { Form } from "react-bootstrap";
  import { useForm } from "react-hook-form";
  import { yupResolver } from "@hookform/resolvers/yup";
  import { useRouter } from "next/router";
  import { addNewUser } from "../api/proposal";
  import { useMutation } from "@tanstack/react-query";
  import styles from "@/styles/Home.module.css"
  import { signUpValidation } from "@/schema";


function Signup() {
  const [gender, setGender] = useState(""); // Change state variable name

  function handleSelect(event) {
    const selectedGender = event.target.value;
    setGender(selectedGender);
  }


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signUpValidation),
  });

  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: addNewUser,
    mutationKey: "addUserList",
  });

  const addUser = async (data) => {
    let registerObject = {
      fullName: data.fullNameField,
      email: data.mailField,
      password: data.passwordField,
      phoneNumber: data.phoneNumberField,
      gender: data.gender, 
      affiliation: data.affiliationField,
      designation: data.designationField,
    };
    try {
      const response = await mutate(registerObject);
      console.log("Successfully created User", response);
      router.push("/login");
    } catch (error) {
      console.error("Error adding new user:", error);
    }
  };
  return (
    <div className={styles.backgroundsignup}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <Form className="mt-5 mb-5" onSubmit={handleSubmit(addUser)}>
              <Card className={styles.transparentCard}>
                <Card.Body>
                  <div className="d-flex flex-row align-items-center justify-content-center gap-3">
                    <div className={`${styles.logo} me-3 `}></div>
                    <Card.Title className="display-6">Sign Up</Card.Title>
                  </div>

                  {/* NAME */}
                  <div className="form-floating mt-3">
                    <input
                      type="text"
                      id="fullNameField"
                      name="fullNameField"
                      className="form-control"
                      placeholder=""
                      {...register("fullNameField")}
                    />
                    <label htmlFor="fullNameField">Full Name</label>
                    {errors.fullNameField && (
                      <p
                        className="error text-danger fw-bolder"
                        style={{ fontSize: "12px" }}
                      >
                        {errors.fullNameField.message}
                      </p>
                    )}
                  </div>

                  {/* EMAIL & PASSWORD */}
                  <div className="row g-3 mt-3">
                    <div className="col">
                      <div className="form-floating">
                        <input
                          type="email"
                          id="mailField"
                          name="mailField"
                          className="form-control"
                          placeholder=""
                          {...register("mailField")}
                        />
                        <label htmlFor="mailField">Email</label>
                        {errors.mailField && (
                          <p
                            className="error text-danger fw-bolder"
                            style={{ fontSize: "12px" }}
                          >
                            {errors.mailField.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-floating">
                        <input
                          type="password"
                          id="passwordField"
                          name="passwordField"
                          className="form-control"
                          placeholder=""
                          {...register("passwordField")}
                        />
                        <label htmlFor="passwordField">Password</label>
                        {errors.passwordField && (
                          <p
                            className="error text-danger fw-bolder"
                            style={{ fontSize: "12px" }}
                          >
                            {errors.passwordField.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* PHONE NUMBER & GENDER */}
                  <div className="row g-3 mt-3">
                    <div className="col">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="phoneNumberField"
                          name="phoneNumberField"
                          className="form-control"
                          placeholder=""
                          {...register("phoneNumberField")}
                        />
                        <label htmlFor="phoneNumberField">Phone Number</label>
                        {errors.phoneNumberField && (
                          <p
                            className="error text-danger fw-bolder"
                            style={{ fontSize: "12px" }}
                          >
                            {errors.phoneNumberField.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col">
                      <div className="input mb-3">
                        {" "}
                        {/* Correct class name */}
                        <label htmlFor="gender">Gender</label>{" "}
                        {/* Updated for attribute */}
                        <select
                          className="form-select"
                          id="genderDropdown"
                          name="gender"
                          onChange={handleSelect}
                          {...register("gender")}
                        >
                          <option value="">Select your gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        {errors.gender && (
                          <p
                            className="error text-danger fw-bolder"
                            style={{ fontSize: "12px" }}
                          >
                            {errors.gender.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AFFILIATION & DESIGNATION */}
                  <div className="row g-3 mt-3">
                    <div className="col">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="affiliationField"
                          name="affiliationField"
                          className="form-control"
                          placeholder=""
                          {...register("affiliationField")}
                        />
                        <label htmlFor="affiliationField">Affiliation</label>
                        {errors.affiliationField && (
                          <p
                            className="error text-danger fw-bolder"
                            style={{ fontSize: "12px" }}
                          >
                            {errors.affiliationField.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="designationField"
                          name="designationField"
                          className="form-control"
                          placeholder=""
                          {...register("designationField")}
                        />
                        <label htmlFor="designationField">Designation</label>
                        {errors.designationField && (
                          <p
                            className="error text-danger fw-bolder"
                            style={{ fontSize: "12px" }}
                          >
                            {errors.designationField.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="text-center mt-4">
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="btn btn-primary w-50"
                    >
                      {isSubmitting ? (
                        <div
                          className="spinner-border text-light spinner-border-sm"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        "Sign up"
                      )}
                    </button>
                  </div>
                </Card.Body>
              </Card>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

  export default Signup;
