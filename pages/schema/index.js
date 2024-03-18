import * as yup from "yup";

// PROPOSAL FORM VALIDATION
export const proposalValidation = yup
  .object({
    programTitle: yup.string().required("Program Title can't be empty."),
    // projectLeaderName: yup.string().required("Project Leader Name is required"),
    // projectLeaderMail: yup
    //   .string()
    //   .email("Invalid email format")
    //   .required("Email Address is required"),
    // projectLeaderNumber: yup.string().required("Contact Number is required"),
    startDate: yup.string().required("Start Date is required"),
    endDate: yup.string().required("End Date is required"),
    summary: yup
      .string()
      .required("Executive Summary can't be empty")
      .max(300, "Text cannot exceed 300 words"),
    genObjective: yup.string().required("General Objective can't be empty"),
    rational: yup.string().required("Rational/ Significance can't be empty"),
    reviewrelatedlit: yup
      .string()
      .required("Review of Related Literature can't be empty"),
    methodology: yup.string().required("Methodology can't be empty"),
    reference: yup.string().required("Reference can't be empty"),
    specObjective: yup
      .array()
      .of(yup.string())
      .test(
        "is-empty", // Custom test name
        "At least one Specific Objective is required", // Error message
        function (value) {
          // Check if the first editor is empty
          return value.length > 0 && value[0].trim().length > 0;
        }
      ),
  })
  .required();

// SIGN UP VALIDATION
export const signUpValidation = yup
  .object({
    fullNameField: yup.string().required("Full Name is required"),
    mailField: yup
      .string()
      .required("Email is required")
      .email("Invalid email"),
    passwordField: yup
      .string()
      .required("Password is required")
      .matches(new RegExp("^(?=.*\\d).*$"), "Must contain a number.")
      .min(8, "Password should be at least 8 characters long."),
    phoneNumberField: yup
      .string()
      .required("Phone number is required")
      .matches(
        new RegExp("^\\+(?:[0-9] ?){6,14}[0-9]$"),
        "Invalid phone number"
      ),
    gender: yup
      .string()
      .oneOf(["Male", "Female"])
      .required("Please select a gender from the dropdown menu"),
    affiliationField: yup.string().required("Affiliation cannot be empty."),
    designationField: yup.string().required("Designation cannot be empty."),
  })
  .required();


  // SIGN IN VALIDATION
export const signInValidation = yup
  .object({
    mail: yup.string().required("Email is required").email("Invalid email"),
    pass: yup
      .string()
      .required("Password is required")
      .matches(new RegExp("^(?=.*\\d).*$"), "Must contain a number.")
      .min(8, "Password should be at least 8 characters long."),
  })
  .required();