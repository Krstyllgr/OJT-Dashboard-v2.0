import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpenReader } from "@fortawesome/free-solid-svg-icons";
import { Form, Toast } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "/styles/Home.module.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signInValidation } from "@/schema";

function Login() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInValidation),
  });

  const router = useRouter();

  const onSubmit = async () => {
    try {
      const response = await fetch('http://localhost:4001/proponent/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: mail,
          password: password
        })
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
  
      if (data.token) {
        // Store tokens securely
        window.localStorage.setItem("token", data.token);
        window.localStorage.setItem("refreshToken", data.refreshToken);
        // Store user info
        window.localStorage.setItem("user", JSON.stringify(data.user));
        // Redirect user to home page
        router.push("/");
        // Set login status
        window.localStorage.setItem("isLoggedIn", true);
      } else {
        // Handle error when token is not returned
        toast.error("Invalid response from server", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data", { position: "top-center" });
    }
  };
  

  return (
    <div className={styles.backgroundsignup}>
      <Form
        className="d-flex justify-content-center flex-column align-items-center mt5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card
          className={`${styles.transparentCard} shadow-sm`}
          style={{ maxWidth: "100rem", width: "25rem" }}
        >
          <Card.Body>
            <div className="d-flex flex-row align-items-center justify-content-center gap-3">
              <div className={styles.logo}></div>
              <Card.Title className="display-6">Sign In</Card.Title>
            </div>

            {/* EMAIL */}
            <div className="form-floating mt-3">
              <input
                type="email"
                id="mail"
                className="form-control border-0 border-bottom"
                placeholder=""
                autoComplete="off"
                {...register("mail")}
                onChange={(e) => setMail(e.target.value)}
              />
              <p
                className="error text-danger fw-bolder"
                style={{ fontSize: "12px" }}
              >
                {errors.mail?.message}
              </p>
              <label htmlFor="mail">Email</label>
            </div>

            {/* PASSWORD */}
            <div className="form-floating mt-3">
              <input
                type="password"
                id="pass"
                className="form-control border-0 border-bottom mb-2"
                placeholder=""
                autoComplete="off"
                {...register("pass")}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p
                className="error text-danger fw-bolder"
                style={{ fontSize: "12px" }}
              >
                {errors.pass?.message}
              </p>
              <label htmlFor="pass">Password</label>
            </div>

            {/* REMEMBER ME */}
            <div
              className="d-flex flex-column ms-auto position-relative"
              style={{ flex: 1 }}
            >
              <div className="mb-2 mt-1 d-flex align-items-center">
                <input
                  type="checkbox"
                  className="custom-control custom-checkbox me-2 "
                  id="checkbox"
                />
                <label
                  htmlFor="check"
                  className="custom-input-label fw-lighter lh-1"
                  style={{ fontSize: "12px" }}
                >
                  Remember Me
                </label>
              </div>

              {/* SUBMIT/LOGIN BUTTON */}
              <div className="d-flex flex-column mt-4">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  {isSubmitting ? (
                    <div
                      className="spinner-border text-light spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {/* REGISTER */}
                <p
                  className="d-flex mt-2 text-dark "
                  style={{ flex: 1, fontSize: "13px" }}
                >
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className={`${styles.register} cursor-pointer text-decoration-none ms-1`}
                    style={{ fontSize: "12px" }}
                  >
                    Register
                  </Link>
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Form>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default Login;
