import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import Navbar from "@/components/Navbar/Navbar";
import { Editor } from "primereact/editor";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useStore } from "@/pages/store";
import moment from "moment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProposal, updateProposal } from "@/pages/api/proposal";
// import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark, faUpload } from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { nanoid } from "nanoid";
import styles from "@/styles/Home.module.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { proposalValidation } from "@/pages/schema";

function Proposal() {

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(proposalValidation),
  });

  const queryClient = useQueryClient(); // to get the latest data in database

  // FOR DYNAMIC INPUT FIELDS
  //DYNAMIC INPUT SPECIFIC OBJECTIVES
  const [fields, setFields] = useState([]);

  useEffect(() => {
    setValue(
      "specObjective",
      fields.map((item) => item.value)
    );
  }, [fields, setValue]);
  const {} = useFieldArray({
    control,
    name: "specObjective[]",
    defaultValues: fields,
  });
  // ADDING NEW SPEC OBJECTIVE EDITOR
  const addNewEditor = () => {
    const uniqueId = nanoid();
    setFields([...fields, { value: "", id: uniqueId }]);
  };
  // REMOVING SPECIFIC OBJECTIVE EDITOR
  const removeSpecificObjective = (id) => {
    setFields(fields.filter((item) => item.id !== id));
  };

  // FOR PROJECT STAFF
  const [projectStaffField, setProjectStaffField] = useState([]);

  const addNewProjectStaff = () => {
    setProjectStaffField([
      ...projectStaffField,
      {
        name: "",
        mail: "",
        phoneNumber: "",
      },
    ]);
  };

  const removeProjectStaff = (index) => {
    const updatedFields = [...projectStaffField];
    updatedFields.splice(index, 1);
    setProjectStaffField(updatedFields);
  };

  const updateProjectStaffName = (index, value) => {
    const updatedFields = [...projectStaffField];
    updatedFields[index].name = value;
    setProjectStaffField(updatedFields);
  };

  const updateProjectStaffMail = (index, value) => {
    const updatedFields = [...projectStaffField];
    updatedFields[index].mail = value;
    setProjectStaffField(updatedFields);
  };

  const updateProjectStaffNumber = (index, value) => {
    const updatedFields = [...projectStaffField];
    updatedFields[index].phoneNumber = value;
    setProjectStaffField(updatedFields);
  };

  // FOR PROJECT LEADER
  const [projectLeaderField, setProjectLeaderField] = useState([]);

  // FUNCTION TO UPDATE THE NAME OF THE PROJECT LEADER
  const updateProjectLeaderName = (value) => {
    setProjectLeaderField((prevProjectLeaderField) => ({
      ...prevProjectLeaderField,
      name: value,
    }));
  };

  // FUNCTION TO UPDATE THE MAIL OF THE PROJECT LEADER
  const updateProjectLeaderMail = (value) => {
    setProjectLeaderField((prevProjectLeaderField) => ({
      ...prevProjectLeaderField,
      mail: value,
    }));
  };

  // FUNCTION TO UPDATE THE PHONE NUMBER OF THE PROJECT LEADER
  const updateProjectLeaderNumber = (value) => {
    setProjectLeaderField((prevProjectLeaderField) => ({
      ...prevProjectLeaderField,
      phoneNumber: value,
    }));
  };

  const sdgLabels = [
    "No Poverty",
    "Zero Hunger",
    "Good Health and Well-being",
    "Quality Education",
    "Gender Equality",
    "Clean Water and Sanitation",
    "Affordable and Clean Energy",
    "Decent Work and Economic Growth",
    "Industry, Innovation, and Infrastructure",
    "Reduced Inequality",
    "Sustainable Cities and Communities",
    "Responsible Consumption and Production",
    "Climate Action",
    "Life Below Water",
    "Life on Land",
    "Peace, Justice, and Strong Institutions",
    "Partnerships for the Goals",
  ];

  const [checkedSDGs, setCheckedSDGs] = useState(Array(17).fill(false));

  const handleCheckboxChange = (index) => {
    const updatedCheckedSDGs = [...checkedSDGs];
    updatedCheckedSDGs[index] = !updatedCheckedSDGs[index];
    setCheckedSDGs(updatedCheckedSDGs);
    console.log("Checked SDGs:", updatedCheckedSDGs);
  };

  // FOR UPDATING THE DATABASE
  const { mutate } = useMutation({
    mutationFn: addProposal,
    mutationKey: "addedList",
    onSuccess: async () => {
      await queryClient.invalidateQueries(["proposal", idNum]);
    },
  });

  // SUBMIT BUTTON
  const onSave = async (data) => {
    try {
      const checkedIndices = checkedSDGs.reduce((acc, isChecked, index) => {
        if (isChecked) {
          acc.push(`SDG: ${index + 1}`);
        }
        return acc;
      }, []);
      const projectLeaderData = {
        name: projectLeaderField.name,
        mail: projectLeaderField.mail,
        phoneNumber: projectLeaderField.phoneNumber,
      };
      const projectStaffData = projectStaffField.map((item) => ({
        name: item.name,
        mail: item.mail,
        phoneNumber: item.phoneNumber,
      }));

      let ganttBase64 = "";
      if (data.gantt && data.gantt[0]) {
        const ganttFile = data.gantt[0];
        ganttBase64 = await fileToBase64(ganttFile);
      }

      let budgetBase64 = "";
      if (data.budget && data.budget[0]) {
        const budgetFile = data.budget[0];
        budgetBase64 = await fileToBase64(budgetFile);
      }

      const passData = {
        programTitle: data.programTitle,
        projectLeader: projectLeaderData,
        projectStaff: projectStaffData,
        selectedSDGs: checkedIndices,
        startDate: data.startDate,
        endDate: data.endDate,
        executiveSummary: data.summary,
        generalObjective: data.genObjective,
        specObjective: fields.map((item) => item.value),
        rationalSignificance: data.rational,
        reviewOfRelatedLiterature: data.reviewrelatedlit,
        methodology: data.methodology,
        references: data.reference,
        gantt: ganttBase64,
        budget: budgetBase64,
      };
      await mutate(passData);

      console.log("Successfully submitted the proposal:", data);
      toast.success("Successfully submitted the proposal. Visit the Under Evaluation page to see it.");
    } catch (error) {
      console.error("Error updating proposal:", error);
      toast.error("Error updating proposal. Please try again later.");
    }
  };

  // Function to convert file to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result.split(",")[1]);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <Navbar />
      <div>
        <FormProvider>
          <Form>
            <>
              <Container fluid className={styles.container_width}>
                <Row className="mb-3">
                  <Col sm="12">
                    <h4 className="fw-bold">Proposal Details</h4>
                  </Col>
                </Row>
                {/* PROGRAM TITLE*/}
                <Row className="mb-3">
                  <Form.Group as={Col} sm="12">
                    <Form.Label
                      className="fw-bold fs-5"
                      style={{ color: "#387ADF" }}
                    >
                      Program Title
                    </Form.Label>
                    <Form.Control
                      id="programTitle"
                      name="programTitle"
                      as="textarea"
                      style={{ height: "10rem" }}
                      {...register("programTitle")}
                    />
                    <p
                      className="error text-danger fw-bolder mt-2"
                      style={{ fontSize: "12px" }}
                    >
                      {errors.programTitle?.message}
                    </p>{" "}
                    {/*ERROR MESSAGE*/}
                  </Form.Group>
                </Row>

                {/* PROJECT LEADER */}
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label className="fw-bold">
                        Project Leader
                      </Form.Label>
                      <Form.Control
                        id={`projectLeaderName`}
                        name={`projectLeaderName`}
                        defaultValue={projectLeaderField.name}
                        className="form-control mb-4 me-2"
                        style={{ flex: 1 }}
                        onChange={(e) =>
                          updateProjectLeaderName(e.target.value)
                        }
                      />
                      <p
                        className="error text-danger fw-bolder mt-2"
                        style={{ fontSize: "12px" }}
                      >
                        {errors.projectLeaderName?.message}
                      </p>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label className="fw-bold">Email Address</Form.Label>
                      <Form.Control
                        id={`projectLeaderMail`}
                        name={`projectLeaderMail`}
                        defaultValue={projectLeaderField.mail}
                        className="form-control mb-4 me-2"
                        style={{ flex: 1 }}
                        onChange={(e) =>
                          updateProjectLeaderMail(e.target.value)
                        }
                      />
                      <p
                        className="error text-danger fw-bolder mt-2"
                        style={{ fontSize: "12px" }}
                      >
                        {errors.projectLeaderMail?.message}
                      </p>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label className="fw-bold">
                        Contact Number
                      </Form.Label>
                      <Form.Control
                        id={`projectLeaderNumber`}
                        name={`projectLeaderNumber`}
                        defaultValue={projectLeaderField.phoneNumber}
                        className="form-control mb-4"
                        style={{ flex: 1 }}
                        onChange={(e) =>
                          updateProjectLeaderNumber(e.target.value)
                        }
                      />
                      <p
                        className="error text-danger fw-bolder mt-2"
                        style={{ fontSize: "12px" }}
                      >
                        {errors.projectLeaderNumber?.message}
                      </p>
                    </Form.Group>
                  </Col>
                </Row>

                {/* PROJECT STAFFS */}
                <Row>
                  <Form.Label className="fw-bold">
                    Project Staff
                    <button
                      type="button"
                      className="btn border-0"
                      onClick={addNewProjectStaff}
                    >
                      <FontAwesomeIcon
                        className="text-primary"
                        icon={faSquarePlus}
                      />
                    </button>
                  </Form.Label>
                  {/* DYNAMIC INPUT */}
                  {projectStaffField.map((item, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-start mb-4 position-relative"
                    >
                      <div className="flex-grow-1">
                        {/* INPUT COMPONENT */}
                        <div className="d-flex">
                          <Form.Control
                            id={`staffName${index}`}
                            name={`staffName${index}`}
                            defaultValue={item.name}
                            className="form-control mb-4 me-2"
                            style={{ flex: 1 }}
                            onChange={(e) =>
                              updateProjectStaffName(index, e.target.value)
                            }
                          />
                          <Form.Control
                            id={`staffMail${index}`}
                            name={`staffMail${index}`}
                            defaultValue={item.mail}
                            className="form-control mb-4 me-2"
                            style={{ flex: 1 }}
                            onChange={(e) =>
                              updateProjectStaffMail(index, e.target.value)
                            }
                          />
                          <Form.Control
                            id={`staffNumber${index}`}
                            name={`staffNumber${index}`}
                            defaultValue={item.phoneNumber}
                            className="form-control mb-4"
                            style={{ flex: 1 }}
                            onChange={(e) =>
                              updateProjectStaffNumber(index, e.target.value)
                            }
                          />
                        </div>
                      </div>
                      {/* Container for the remove button */}
                      <div style={{ position: "relative" }}>
                        <button
                          type="button"
                          className="btn border-0"
                          onClick={() => removeProjectStaff(index)}
                        >
                          <FontAwesomeIcon
                            className="text-danger"
                            icon={faRectangleXmark}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </Row>

                {/* SDG */}
                <Row>
                  <Col sm="12">
                    <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                      Sustainable Development Goal{" "}
                      <span className="fw-lighter fs-6">
                        (Check all applicable SDG)
                      </span>
                    </h5>
                  </Col>
                  <Col>
                    {[...Array(9)].map((_, index) => (
                      <div className="form-check" key={index}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          onChange={() => handleCheckboxChange(index)}
                          id={`sdgArrayOne${index}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`sdgArrayOne${index}`}
                        >
                          SDG{index + 1}: {sdgLabels[index]}
                        </label>
                      </div>
                    ))}
                  </Col>
                  <Col>
                    {[...Array(8)].map((_, index) => (
                      <div className="form-check" key={index}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          onChange={() => handleCheckboxChange(index + 9)}
                          id={`sdgArrayTwo${index}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`sdgArrayTwo${index}`}
                        >
                          SDG{index + 10}: {sdgLabels[index + 9]}
                        </label>
                      </div>
                    ))}
                  </Col>
                </Row>

                {/* DURATION */}
                <Row className="mb-3">
                  <Col sm="12">
                    <h5 className="fw-bold mt-5" style={{ color: "#387ADF" }}>
                      Duration
                    </h5>
                  </Col>
                </Row>

                {/* START DATE & END DATE */}
                <Row className="mb-3">
                  <Col sm="6">
                    <Form.Group>
                      <Form.Label className="fw-bold">
                        Target Start Date
                      </Form.Label>
                      <Form.Control
                        id="startDate"
                        name="startDate"
                        type="date"
                        {...register("startDate")}
                      />
                      <p
                        className="error text-danger fw-bolder mt-2"
                        style={{ fontSize: "12px" }}
                      >
                        {errors.startDate?.message}
                      </p>{" "}
                      {/*ERROR MESSAGE*/}
                    </Form.Group>
                  </Col>
                  <Col sm="6">
                    <Form.Group>
                      <Form.Label className="fw-bold">
                        Target End Date
                      </Form.Label>
                      <Form.Control
                        id="endDate"
                        name="endDate"
                        type="date"
                        {...register("endDate")}
                      />
                      <p
                        className="error text-danger fw-bolder mt-2"
                        style={{ fontSize: "12px" }}
                      >
                        {errors.endDate?.message}
                      </p>{" "}
                      {/*ERROR MESSAGE*/}
                    </Form.Group>
                  </Col>
                </Row>

                {/* EXECUTIVE SUMMARY */}
                <Row className="mb-3">
                  <Form.Group as={Col} sm="12">
                    <Form.Label className="fw-bold">
                      Executive Summary
                    </Form.Label>
                    <Editor
                      id="summary"
                      name="summary"
                      formats={{ p: false }}
                      className="mb-4"
                      style={{ height: "300px", backgroundColor: "white" }}
                      {...register("summary")}
                      onTextChange={(e) => {
                        // Remove <p> tags from the HTML value
                        const strippedValue = e.htmlValue
                          ? e.htmlValue
                              .replace(/<p>/g, "")
                              .replace(/<\/p>/g, "")
                          : "";
                        // Update fields state with the stripped value
                        setValue("summary", strippedValue);
                      }}
                    />
                    <p
                      className="error text-danger fw-bolder"
                      style={{ fontSize: "12px" }}
                    >
                      {errors.summary?.message}
                    </p>{" "}
                    {/*ERROR MESSAGE*/}
                  </Form.Group>
                </Row>

                {/* GENERAL OBJECTIVE */}
                <Row className="mb-3">
                  <Form.Group as={Col} sm="12">
                    <Form.Label className="fw-bold">
                      General Objective
                    </Form.Label>
                    <Editor
                      id="genObjective"
                      name="genObjective"
                      className="mb-4"
                      style={{ height: "300px", background: "white" }}
                      onTextChange={(e) => {
                        // Remove <p> tags from the HTML value
                        const strippedValue = e.htmlValue
                          ? e.htmlValue
                              .replace(/<p>/g, "")
                              .replace(/<\/p>/g, "")
                          : "";
                        // Update fields state with the stripped value
                        setValue("genObjective", strippedValue);
                      }}
                    />
                    <p
                      className="error text-danger fw-bolder"
                      style={{ fontSize: "12px" }}
                    >
                      {errors.genObjective?.message}
                    </p>{" "}
                    {/*ERROR MESSAGE*/}
                    {/* SPECIFIC OBJECTIVE */}
                    <Row className="mb-3">
                      <Form.Group as={Col} sm="12">
                        <Form.Label className="fw-bold">
                          Specific Objective
                          {/* Button to add a new editor */}
                          <button
                            type="button"
                            className="btn align-items-center"
                            onClick={addNewEditor}
                          >
                            <FontAwesomeIcon
                              className="text-primary ms-2"
                              icon={faSquarePlus}
                            />
                          </button>
                        </Form.Label>
                        {/* Mapping over fields to render individual editors */}
                        {fields.map((item, index) => (
                          <div
                            key={item.id}
                            className="d-flex align-items-start mb-4 position-relative flex-grow-1"
                          >
                            {/* Editor component */}
                            <Editor
                              id={`specObjective${item.id}`}
                              name={`specObjective[${index}]`}
                              className="form-control mb-4 border-0"
                              style={{ height: "300px", width: "100%" }}
                              // Handler for text change in the editor
                              onTextChange={(e) => {
                                // Remove <p> tags from the HTML value
                                const strippedValue = e.htmlValue
                                  ? e.htmlValue
                                      .replace(/<p>/g, "")
                                      .replace(/<\/p>/g, "")
                                  : "";
                                // Update fields state with the stripped value
                                const updatedFields = [...fields];
                                const fieldIndex = fields.findIndex(
                                  (field) => field.id === item.id
                                );
                                updatedFields[fieldIndex].value = strippedValue;
                                setValue(
                                  `specObjective[${fieldIndex}]`,
                                  strippedValue
                                );
                              }}
                            />
                            {/* Render close button if index is greater than 0 */}
                            {index > 0 && (
                              <button
                                type="button"
                                className="btn border-0"
                                style={{
                                  position: "absolute",
                                  top: "10px",
                                  right: "10px",
                                }}
                                onClick={() => removeSpecificObjective(item.id)}
                              >
                                <FontAwesomeIcon
                                  className="text-danger"
                                  icon={faRectangleXmark}
                                />
                              </button>
                            )}
                          </div>
                        ))}
                        {/* Error message display */}
                        <p
                          className="error text-danger fw-bolder"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.specObjective?.message}
                        </p>
                      </Form.Group>
                    </Row>
                    {/* RATIONAL / SIGNIFICANCE */}
                    <Row className="mb-3">
                      <Form.Group as={Col} sm="12">
                        <Form.Label className="fw-bold">
                          Rational/ Significance
                        </Form.Label>
                        <Editor
                          id="rational"
                          name="rational"
                          className="mb-4"
                          style={{ height: "300px", background: "white" }}
                          onTextChange={(e) => {
                            // Remove <p> tags from the HTML value
                            const strippedValue = e.htmlValue
                              ? e.htmlValue
                                  .replace(/<p>/g, "")
                                  .replace(/<\/p>/g, "")
                              : "";
                            // Update fields state with the stripped value
                            setValue("rational", strippedValue);
                          }}
                        />
                        <p
                          className="error text-danger fw-bolder"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.rational?.message}
                        </p>{" "}
                        {/*ERROR MESSAGE*/}
                      </Form.Group>
                    </Row>
                    {/* REVIEW OF RELATED LITERATURE */}
                    <Row className="mb-3">
                      <Form.Group as={Col} sm="12">
                        <Form.Label className="fw-bold">
                          Review of Related Literature
                        </Form.Label>
                        <Editor
                          id="reviewrelatedlit"
                          name="reviewrelatedlit"
                          className="mb-4"
                          style={{ height: "300px", background: "white" }}
                          onTextChange={(e) => {
                            // Remove <p> tags from the HTML value
                            const strippedValue = e.htmlValue
                              ? e.htmlValue
                                  .replace(/<p>/g, "")
                                  .replace(/<\/p>/g, "")
                              : "";
                            // Update fields state with the stripped value
                            setValue("reviewrelatedlit", strippedValue);
                          }}
                        />
                        <p
                          className="error text-danger fw-bolder"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.reviewrelatedlit?.message}
                        </p>{" "}
                        {/*ERROR MESSAGE*/}
                      </Form.Group>
                    </Row>
                    {/* METHODOLOGY */}
                    <Row className="mb-3">
                      <Form.Group as={Col} sm="12">
                        <Form.Label className="fw-bold">Methodology</Form.Label>
                        <Editor
                          id="methodology"
                          name="methodology"
                          className="mb-4"
                          style={{ height: "300px", background: "white" }}
                          onTextChange={(e) => {
                            // Remove <p> tags from the HTML value
                            const strippedValue = e.htmlValue
                              ? e.htmlValue
                                  .replace(/<p>/g, "")
                                  .replace(/<\/p>/g, "")
                              : "";
                            // Update fields state with the stripped value
                            setValue("methodology", strippedValue);
                          }}
                        />
                        <p
                          className="error text-danger fw-bolder"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.methodology?.message}
                        </p>{" "}
                        {/*ERROR MESSAGE*/}
                      </Form.Group>
                    </Row>
                    {/* REFERENCES */}
                    <Row className="mb-3">
                      <Form.Group as={Col} sm="12">
                        <Form.Label className="fw-bold">References</Form.Label>
                        <Editor
                          id="reference"
                          name="reference"
                          className="mb-4"
                          style={{ height: "300px", background: "white" }}
                          onTextChange={(e) => {
                            // Remove <p> tags from the HTML value
                            const strippedValue = e.htmlValue
                              ? e.htmlValue
                                  .replace(/<p>/g, "")
                                  .replace(/<\/p>/g, "")
                              : "";
                            // Update fields state with the stripped value
                            setValue("reference", strippedValue);
                          }}
                        />
                        <p
                          className="error text-danger fw-bolder"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.reference?.message}
                        </p>{" "}
                        {/*ERROR MESSAGE*/}
                      </Form.Group>
                    </Row>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  {/* Gantt Chart */}
                  <Col sm="6">
                    <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                      Major Activities/Workplan (Gantt Chart)
                    </h5>
                    <label
                      htmlFor="gantt"
                      className={`${styles.custom_file_upload}`}
                    >
                      Upload Gantt Chart
                      <FontAwesomeIcon
                        icon={faUpload}
                        className="mt-2 fs-3"
                      ></FontAwesomeIcon>
                    </label>
                    <input
                      type="file"
                      name="gantt"
                      id="gantt"
                      className="ms-5"
                      hidden
                      multiple
                      {...register("gantt")}
                    />
                  </Col>

                  {/* Line Item Budget */}
                  <Col sm="6">
                    <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                      Line Item Budget
                    </h5>
                    <input
                      type="file"
                      name="budget"
                      id="budget"
                      className="ms-5"
                      multiple
                      {...register("budget")}
                    ></input>
                  </Col>
                </Row>
              </Container>
            </>

            <div className="d-flex justify-content-end me-4">
              <button
                disabled={isSubmitting}
                onClick={handleSubmit(onSave)}
                type="submit"
                className="btn btn-primary mb-4"
              >
                {isSubmitting ? (
                  <div
                    className="spinner-border text-light spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
            <ToastContainer position="top-center" />
          </Form>
        </FormProvider>
      </div>
    </>
  );
}

export default Proposal;
