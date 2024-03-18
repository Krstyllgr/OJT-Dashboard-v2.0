import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useStore } from "@/pages/store";
import { Row, Col, Modal } from "react-bootstrap";
import styles from "@/styles/Home.module.css";

const StatusCards = ({ proposalStatus, getStatus, dataStatus }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: statusData,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["draftsList"],
    queryFn: getStatus,
  });

    useEffect(() => {
      // Refetch data when props change
      refetch();
    }, [proposalStatus, getStatus, dataStatus, refetch]);

  useEffect(() => {
    const isLoggedIn = window.localStorage.getItem("isLoggedIn");
    setLoggedIn(isLoggedIn === "true");
    // Show modal if not logged in
    if (!isLoggedIn) {
      setShowModal(true);
    }
  }, []);

  const handleCloseModal = () => setShowModal(false);

  // TO SET STATE, FROM THE USESTORE
  const {
    setStatusId,
    setId,
    setProgramTitle,
    setProjectStaff,
    setProjectLeader,
    setSdg,
    setStartDate,
    setEndDate,
    setSummary,
    setGenObjective,
    setSpecObjective,
    setRational,
    setReview,
    setMethodology,
    setReference,
    setGantt,
    setLIB,
    setTravelingCost,
    setTrainingExpenses,
    setSuppliesMaterials,
    setPostageDeliveries,
    setCommunicationExpenses,
    setRentExpenses,
    setTransportationDelivery,
    setSubscriptionDelivery,
    setProfessionalServices,
    setRepairMaintenance,
    setTaxesDutiesPatentLicenses,
    setOtherMaintenance,
    setRepresentation,
    setOthers,
  } = useStore();

  // SET STATE FROM DRAFTS IN DATABASE
  const handleStore = (proposalStatus) => {
    setStatusId(dataStatus);
    setId(proposalStatus.id);
    setProgramTitle(proposalStatus.programTitle);
    setProjectLeader(proposalStatus.projectLeader);
    setProjectStaff(proposalStatus.projectStaff);
    setSdg(proposalStatus.selectedSDGs);
    setStartDate(proposalStatus.startDate);
    setEndDate(proposalStatus.endDate);
    setSummary(proposalStatus.executiveSummary);
    setGenObjective(proposalStatus.generalObjective);
    setSpecObjective(proposalStatus.specObjective);
    setRational(proposalStatus.rationalSignificance);
    setReview(proposalStatus.reviewOfRelatedLiterature);
    setMethodology(proposalStatus.methodology);
    setReference(proposalStatus.references);
    setGantt(proposalStatus.gantt);
    setLIB(proposalStatus.budget);
    setTravelingCost({
      local:
        proposalStatus.lib && proposalStatus.lib
          ? proposalStatus.lib.travelingCostLocal
          : "N/A",
      foreign:
        proposalStatus.lib && proposalStatus.lib
          ? proposalStatus.lib.travelingCostForeign
          : "N/A",
    });
    setTrainingExpenses(proposalStatus.lib?.trainingExpenses || "N/A");
    setSuppliesMaterials({
      officeSupplies:
        proposalStatus.lib && proposalStatus.lib
          ? proposalStatus.lib.officeMaterials
          : "N/A",
      accountableForms:
        proposalStatus.lib && proposalStatus.lib
          ? proposalStatus.lib.accountableForm
          : "N/A",
      drugsMedicine:
        proposalStatus.lib && proposalStatus.lib
          ? proposalStatus.lib.drugsAndMedicine
          : "N/A",
      laboratoryExpenses:
        proposalStatus.lib && proposalStatus.lib
          ? proposalStatus.lib.laboratoryExpenses
          : "N/A",
      textbookInstructional:
        proposalStatus.lib && proposalStatus.lib
          ? proposalStatus.lib.textbookAndInstructionalMaterials
          : "N/A",
    });
    setPostageDeliveries(proposalStatus.lib?.postageDeliveries || "N/A");
    setCommunicationExpenses({
      telephoneExpenses:
        proposalStatus.lib && proposalStatus.lib
          ? proposalStatus.lib.communicationExpensesTelephone
          : "N/A",
      internetExpenses:
        proposalStatus.lib && proposalStatus.lib
          ? proposalStatus.lib.communicationExpensesInternet
          : "N/A",
    });
    setRentExpenses(proposalStatus.lib?.rentExpenses || "N/A");
    setTransportationDelivery(
      proposalStatus.lib?.transportationAndDeliveryExpenses || "N/A"
    );
    setSubscriptionDelivery(proposalStatus.lib?.subscriptionExpenses || "N/A");
    setProfessionalServices({
      consultancyServices:
        proposalStatus.lib && proposalStatus.lib
          ? proposalStatus.lib.consultancyServices
          : "N/A",
      generalServices:
        proposalStatus.lib && proposalStatus.lib
          ? proposalStatus.lib.generalServices
          : "N/A",
    });
    setRepairMaintenance({
      itEquipment:
        proposalStatus.lib && proposalStatus.lib
          ? proposalStatus.lib.itEquipmentAndSoftware
          : "N/A",
      laboratoryEquipment:
        proposalStatus.lib && proposalStatus.lib
          ? proposalStatus.lib.laboratoryEquipment
          : "N/A",
      technicalScientificEquipment:
        proposalStatus.lib && proposalStatus.lib
          ? proposalStatus.lib.technicalAndScientificEquipment
          : "N/A",
      machineriesEquipment:
        proposalStatus.lib && proposalStatus.lib
          ? proposalStatus.lib.machineriesAndEquipment
          : "N/A",
    });
    setTaxesDutiesPatentLicenses(
      proposalStatus.lib?.taxesDutiesPatentAndLicenses || "N/A"
    );
    setOtherMaintenance({
      advertisingExpenses:
        proposalStatus.lib && proposalStatus.lib
          ? proposalStatus.lib.advertisingExpenses
          : "N/A",
      printingBindingExpenses:
        proposalStatus.lib && proposalStatus.lib
          ? proposalStatus.lib.printingAndBindingExpenses
          : "N/A",
    });
    setRepresentation(proposalStatus.lib?.representation || "N/A");
    setOthers(proposalStatus.lib?.others || "N/A");
  };

  // FUNCTION TO HANDLE PAGINATION: SETS THE CURRENT PAGE TO THE SELECTED PAGE NUMBER
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // CONDITIONAL RENDERING IF DATA IS STILL LOADING
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className={styles.loader}>
          <div className={`${styles.load_one} ${styles.load_inner}`}></div>
          <div className={`${styles.load_two} ${styles.load_inner}`}></div>
          <div className={`${styles.load_three} ${styles.load_inner}`}></div>
          <span className={styles.text}>Loading...</span>
        </div>
      </div>
    );
  }

  // CONDITIONAL RENDERING IF AN ERROR OCCURS WHILE FETCHING DATA
  if (isError) {
    return <div>Error!</div>;
  }
  // DEFINE THE NUMBER OF APPROVED TO DISPLAY PER PAGE
  const draftsPerPage = 10;
  // CALCULATE THE INDEX OF THE LAST proposalStatus TO BE DISPLAYED ON THE CURRENT PAGE
  const indexOfLastDrafts = currentPage * draftsPerPage;

  // CALCULATE THE INDEX OF THE FIRST proposalStatus TO BE DISPLAYED ON THE CURRENT PAGE
  const indexOfFirstDrafts = indexOfLastDrafts - draftsPerPage;

  // EXTRACT THE DRAFTS TO BE DISPLAYED ON THE CURRENT PAGE FROM THE 'DRAFTS' DATA,
  // SLICING THE ARRAY FROM THE INDEX OF THE FIRST proposalStatus TO THE INDEX OF THE LAST proposalStatus
  const currentDrafts = statusData?.data.slice(
    indexOfFirstDrafts,
    indexOfLastDrafts
  );

  return (
    <div>
      {loggedIn ? (
        <>
          <Navbar />
          <div className="container mt-5 ms-5">
            <div className="row justify-content-center">
              {currentDrafts.map((proposalStatus, index) => (
                <div key={index} className="col-md-8 mb-4">
                  <div className={`${styles.card_box} card border-2`}>
                    <div className="card-body">
                      <Row>
                        <Col>
                          <h5 className="card-title fw-bold">
                            {proposalStatus.programTitle}
                          </h5>
                          <h6 className="card-text">
                            Start Date: {proposalStatus.startDate}
                            <br />
                            End Date: {proposalStatus.endDate}
                          </h6>
                        </Col>
                        <Col className="border-start border-2">
                          <h6 className="card-text fw-bolder">
                            Summary: <br />
                            <span
                              className="fw-lighter"
                              style={{ fontSize: "12px" }}
                            >
                              {proposalStatus.executiveSummary}
                            </span>
                          </h6>
                        </Col>
                        <Col>
                          <div className="d-flex flex-column justify-content-end position-absolute bottom-0 end-0 me-2 mb-2">
                            <Link
                              href="/editProposal"
                              className="text-decoration-none"
                            >
                              <button
                                className={`${styles.button} btn border-0`}
                                onClick={() => handleStore(proposalStatus)}
                                size="sm"
                              >
                                <span className={styles.button_text}>Edit</span>
                                <span className={styles.svg}>
                                  <FontAwesomeIcon
                                    icon={faCircleChevronRight}
                                    className="ms-2"
                                  ></FontAwesomeIcon>
                                </span>
                              </button>
                            </Link>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="d-flex justify-content-center mt-3 mb-5">
            {statusData &&
              Math.ceil(statusData.data.length / draftsPerPage) > 1 &&
              // MAP THROUGH AN ARRAY OF LENGTH EQUAL TO THE NUMBER OF PAGES REQUIRED FOR PAGINATION
              Array.from({
                length: Math.ceil(statusData.data.length / draftsPerPage),
              }).map((item, index) => (
                // BUTTON FOR EACH PAGE, WITH CLICK EVENT TO PAGINATE AND APPLYING STYLING BASED ON CURRENT PAGE
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`btn btn-outline-primary mx-1 border-0 ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
          </div>
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
};

export default StatusCards;
