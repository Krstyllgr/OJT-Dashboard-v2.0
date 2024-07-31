import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useRef } from "react";
import { Container, Form, Row, Col, Card } from "react-bootstrap";
import Navbar from "@/components/Navbar/Navbar";
import { Editor } from "primereact/editor";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useStore } from "@/store/store";
import moment from "moment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProposal } from "@/pages/api/proposal";
// import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRectangleXmark,
  faAnglesRight,
  faUpload
} from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { nanoid } from "nanoid";
import styles from "@/styles/Home.module.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { proposalValidation } from "@/schema";

function Proposal( ) {
  // STATE SLICES
  const updateId = useStore((state) => state.statusId);
  const idNum = useStore((state) => state.id);
  const title = useStore((state) => state.projectTitle);
  const goal = useStore((state) => state.sdgoal);
  const start = useStore((state) => state.startDate);
  const end = useStore((state) => state.endDate);
  const sum = useStore((state) => state.summary);
  const gen = useStore((state) => state.genObjective);
  const rat = useStore((state) => state.rational);
  const rev = useStore((state) => state.review);
  const meth = useStore((state) => state.methodology);
  const refer = useStore((state) => state.reference);
  const travelCost = useStore((state) => state.travelingCost);
  const trainExpenses = useStore((state) => state.trainingExpenses);
  const supplies = useStore((state) => state.suppliesMaterials);
  const postDeliveries = useStore((state) => state.postageDeliveries);
  const com = useStore((state) => state.communicationExpenses);
  const rent = useStore((state) => state.rentExpenses);
  const transpo = useStore((state) => state.transportationDelivery);
  const subs = useStore((state) => state.subscriptionDelivery);
  const prof = useStore((state) => state.professionalServices);
  const repair = useStore((state) => state.repairsMaintenance);
  const taxesDuties = useStore((state) => state.taxesDutiesPatentLicenses);
  const othersM = useStore((state) => state.otherMaintenance);
  const rep = useStore((state) => state.representation);
  const chart = useStore((state) => state.workPlan);
  const vitae = useStore((state) => state.resume);



  // Function to convert Base64 to file Blob
  const base64ToFileBlob = (base64) => {
    try {
      // Check if Base64 string is provided
      if (!base64) {
        throw new Error("Base64 string is empty or undefined.");
      }

      // Decode the Base64 string into binary data
      const binaryString = atob(base64);

      // Create a Uint8Array from the binary string
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create a Blob from the Uint8Array
      return new Blob([bytes], { type: "application/pdf" });
    } catch (error) {
      console.error("Error converting Base64 to Blob:", error.message);
      return null; // Return null or handle the error appropriately
    }
  };

  // Function to create URL from Blob
  const blobToURL = (blob) => {
    // Check if Blob is valid
    if (!blob) {
      console.error("Invalid Blob provided.");
      return null; // Return null or handle the error appropriately
    }

    // Create a URL from the Blob
    return URL.createObjectURL(blob);
  };

if (chart) {
  const ganttblob = base64ToFileBlob(chart);
  const ganttURL = blobToURL(ganttblob);
}

if (vitae) {
  const resumeblob = base64ToFileBlob(vitae);
  const resumeURL = blobToURL(resumeblob);
}


  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(proposalValidation),
    // DEFAULT VALUES FOR INPUT FIELDS
    defaultValues: {
      projectTitle: title,
      startDate: moment(start, "YYYY/MM/DD").isValid()
        ? moment(start, "YYYY/MM/DD").format("YYYY-MM-DD")
        : "",
      endDate: moment(end, "YYYY/MM/DD").isValid()
        ? moment(end, "YYYY/MM/DD").format("YYYY-MM-DD")
        : "",
      summary: sum,
      genObjective: gen,
      rational: rat,
      reviewrelatedlit: rev,
      methodology: meth,
      reference: refer,
      localTravelCost: travelCost.local,
      foreignTravelCost: travelCost.foreign,
      trainingExpense: trainExpenses,
      officeSupplies: supplies.officeSupplies,
      drugsMedicine: supplies.drugsMedicine,
      instructionalMaterials: supplies.textbookInstructional,
      accountableForms: supplies.accountableForms,
      laboratoryExpenses: supplies.laboratoryExpenses,
      postageDel: postDeliveries,
      telephone: com.telephoneExpenses,
      internetExpenses: com.internetExpenses,
      rentEx: rent,
      transportation: transpo,
      subsExpense: subs,
      consultancy: prof.consultancyServices,
      general: prof.generalServices,
      itEquipmentSoftware: repair.itEquipment,
      technicalScientific: repair.technicalScientificEquipment,
      laboratoryEquipment: repair.laboratoryEquipment,
      machineries: repair.machineriesEquipment,
      taxDuties: taxesDuties,
      advertising: othersM.advertisingExpenses,
      printing: othersM.printingBindingExpenses,
      represent: rep,
    },
  });

  const queryClient = useQueryClient(); // to get the latest data in database

  const [ganttFiles, setGanttFiles] = useState(null);
  const [resumeFiles, setResumeFiles] = useState(null);

  // FUNCTION FOR PROPOSAL DETAILS, RESUME AND SUBMISSION BUTTONS
  const [showProposalDetails, setShowProposalDetails] = useState(true);
  const [showLineItemBudget, setShowLineItemBudget] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const submitRef = useRef(null);

  const toggleProposalDetails = () => {
    setShowProposalDetails(true);
    setShowLineItemBudget(false);
    setShowSubmitButton(false);
    setShowFileUpload(false);
  };

  const lineItemBudgetButton = () => {
    setShowLineItemBudget(true);
    setShowProposalDetails(false);
    setShowSubmitButton(false);
    setShowFileUpload(false);
  };

  const renderFileUpload = () => {
    setShowFileUpload(true);
    setShowSubmitButton(false);
    setShowProposalDetails(false);
    setShowLineItemBudget(false);
  };

  const renderSubmitButton = () => {
    setShowSubmitButton(true);
    setShowProposalDetails(false);
    setShowLineItemBudget(false);
    setShowFileUpload(false);
  };

  // FOR DYNAMIC INPUT FIELDS
  //DYNAMIC INPUT SPECIFIC OBJECTIVES
  // const [fields, setFields] = useState(
  //   useStore((state) => state.specObjective).map((item) => ({
  //     value: item,
  //     id: nanoid(),
  //   }))
  // );

  // useEffect(() => {
  //   setValue(
  //     "specObjective",
  //     fields.map((item) => item.value)
  //   );
  // }, [fields, setValue]);
  // const {} = useFieldArray({
  //   control,
  //   name: "specObjective[]",
  //   defaultValues: fields,
  // });
  // // ADDING NEW SPEC OBJECTIVE EDITOR
  // const addNewEditor = () => {
  //   const uniqueId = nanoid();
  //   setFields([...fields, { value: "", id: uniqueId }]);
  // };
  // // REMOVING SPECIFIC OBJECTIVE EDITOR
  // const removeSpecificObjective = (id) => {
  //   setFields(fields.filter((item) => item.id !== id));
  // };

  // // FOR SEMI-EXPENDABLE
  const [semiExpandableField, setSemiExpandableField] = useState(
    useStore((state) => state.others)?.filter(
      (item) => item.category === "Semi-Expendable"
    ) || []
  );

  // ADDING NEW SEMI EXPENDABLE FIELDS
  const addNewSemiExpandable = () => {
    setSemiExpandableField([
      ...semiExpandableField,
      { category: "Semi-Expendable", name: "", cost: "" },
    ]);
  };
  // REMOVING SEMI EXPENDABLE FIELDS
  const removeSemiExpandable = (index) => {
    const updatedFields = [...semiExpandableField];
    updatedFields.splice(index, 1);
    setSemiExpandableField(updatedFields);
  };
  // FUNCTION TO UPDATE THE NAME OF THE FIRST INPUT FIELD IN SEMI EXPENDABLE
  const updateSemiExpandableValue = (index, value) => {
    const updatedFields = [...semiExpandableField];
    updatedFields[index].name = value;
    setSemiExpandableField(updatedFields);
  };
  // FUNCTION TO UPDATE THE COST OF THE SECOND INPUT FIELD IN SEMI EXPENDABLE
  const updateSemiExpandableCost = (index, cost) => {
    const updatedFields = [...semiExpandableField];
    updatedFields[index].cost = cost;
    setSemiExpandableField(updatedFields);
  };



  // FOR SEMI ICT EQUIPMENT
  const [semiIctField, setSemiIctField] = useState(
    useStore((state) => state.others)?.filter(
      (item) => item.category === "Semi ICT Equipment"
    ) || []
  );

  // ADDING NEW SEMI ICT FIELDS
  const addNewSemiIct = () => {
    setSemiIctField([
      ...semiIctField,
      { category: "Semi ICT Equipment", name: "", cost: "" },
    ]);
  };
  // REMOVING SEMI ICT FIELDS
  const removeSemiIct = (index) => {
    const updatedFields = [...semiIctField];
    updatedFields.splice(index, 1);
    setSemiIctField(updatedFields);
  };
  // FUNCTION TO UPDATE THE NAME OF THE FIRST INPUT FIELD IN SEMI ICT
  const updateSemiIctValue = (index, value) => {
    const updatedFields = [...semiIctField];
    updatedFields[index].name = value;
    setSemiIctField(updatedFields);
  };
  // FUNCTION TO UPDATE THE COST OF THE SECOND INPUT FIELD IN SEMI ICT
  const updateSemiIctCost = (index, cost) => {
    const updatedFields = [...semiIctField];
    updatedFields[index].cost = cost;
    setSemiIctField(updatedFields);
  };

  // FOR CAPITAL OUTLAY AND EQUIPMENT
  const [capitalField, setCapitalField] = useState(
    useStore((state) => state.others)?.filter(
      (item) => item.category === "Capital Outlay Equipment"
    ) || []
  );
  // ADDING NEW COE FIELDS
  const addNewCapital = () => {
    setCapitalField([
      ...capitalField,
      { category: "Capital Outlay and Equipment", name: "", cost: "" },
    ]);
  };
  // REMOVING COE  FIELDS
  const removeCapital = (index) => {
    const updatedFields = [...capitalField];
    updatedFields.splice(index, 1);
    setCapitalField(updatedFields);
  };
  // FUNCTION TO UPDATE THE NAME OF THE FIRST INPUT FIELD IN COE
  const updateCapitalValue = (index, value) => {
    const updatedFields = [...capitalField];
    updatedFields[index].name = value;
    setCapitalField(updatedFields);
  };
  // FUNCTION TO UPDATE THE COST OF THE SECOND INPUT FIELD IN COE
  const updateCapitalCost = (index, cost) => {
    const updatedFields = [...capitalField];
    updatedFields[index].cost = cost;
    setCapitalField(updatedFields);
  };

  // FOR OTHER SUPPLIES
  const [othersSuppliesField, setOthersSuppliesField] = useState(
    useStore((state) => state.others)?.filter(
      (item) => item.category === "Supplies and Materials"
    ) || []
  );
  // ADDING NEW OTHER SUPPLIES FIELDS
  const addNewOthersSupplies = () => {
    setOthersSuppliesField([
      ...othersSuppliesField,
      { category: "Supplies and Materials", name: "", cost: "" },
    ]);
  };
  // REMOVING OTHER SUPPLIES FIELDS
  const removeOthersSupplies = (index) => {
    const updatedFields = [...othersSuppliesField];
    updatedFields.splice(index, 1);
    setOthersSuppliesField(updatedFields);
  };
  // FUNCTION TO UPDATE THE NAME OF THE FIRST INPUT FIELD IN OTHER SUPPLIES
  const updateOthersSuppliesName = (index, value) => {
    const updatedFields = [...othersSuppliesField];
    updatedFields[index].name = value;
    setOthersSuppliesField(updatedFields);
  };
  // FUNCTION TO UPDATE THE COST OF THE SECOND INPUT FIELD IN OTHER SUPPLIES
  const updateOthersSuppliesCost = (index, cost) => {
    const updatedFields = [...othersSuppliesField];
    updatedFields[index].cost = cost;
    setOthersSuppliesField(updatedFields);
  };

  // FOR OTHERS COMMUNICATION
  const [othersCommunicationField, setOtherCommunicationField] = useState(
    useStore((state) => state.others)?.filter(
      (item) => item.category === "Communication Materials"
    ) || []
  );
  // ADDING NEW OTHER COMMUNICATION FIELDS
  const addNewOthersCommunication = () => {
    setOtherCommunicationField([
      ...othersCommunicationField,
      { category: "Communication Expenses", name: "", cost: "" },
    ]);
  };
  // REMOVING OTHER COMMUNICATION FIELDS
  const removeOthersCommunication = (index) => {
    const updatedFields = [...othersCommunicationField];
    updatedFields.splice(index, 1);
    setOtherCommunicationField(updatedFields);
  };
  // FUNCTION TO UPDATE THE NAME OF THE FIRST INPUT FIELD IN OTHER COMMUNICATION
  const updateOthersCommunicationName = (index, value) => {
    const updatedFields = [...othersCommunicationField];
    updatedFields[index].name = value;
    setOtherCommunicationField(updatedFields);
  };
  // FUNCTION TO UPDATE THE COST OF THE SECOND INPUT FIELD IN OTHER COMMUNICATION
  const updateOthersCommunicationCost = (index, cost) => {
    const updatedFields = [...othersCommunicationField];
    updatedFields[index].cost = cost;
    setOtherCommunicationField(updatedFields);
  };

  // FOR OTHERS PROFESSIONAL
  const [othersProfessionalField, setOtherProfessionalField] = useState(
    useStore((state) => state.others)?.filter(
      (item) => item.category === "Professional Services"
    ) || []
  );
  // ADDING NEW OTHER PROFESSIONAL FIELDS
  const addNewOthersProfessional = () => {
    setOtherProfessionalField([
      ...othersProfessionalField,
      { category: "Professional Services", name: "", cost: "" },
    ]);
  };
  // REMOVING OTHER PROFESSIONAL FIELDS
  const removeOthersProfessional = (index) => {
    const updatedFields = [...othersProfessionalField];
    updatedFields.splice(index, 1);
    setOtherProfessionalField(updatedFields);
  };
  // FUNCTION TO UPDATE THE NAME OF THE FIRST INPUT FIELD IN OTHER PROFESSIONAL
  const updateOthersProfessionalName = (index, value) => {
    const updatedFields = [...othersProfessionalField];
    updatedFields[index].name = value;
    setOtherProfessionalField(updatedFields);
  };
  // FUNCTION TO UPDATE THE COST OF THE SECOND INPUT FIELD IN OTHER PROFESSIONAL
  const updateOthersProfessionalCost = (index, cost) => {
    const updatedFields = [...othersProfessionalField];
    updatedFields[index].cost = cost;
    setOtherProfessionalField(updatedFields);
  };

  // FOR OTHERS REPAIRS
  const [othersRepairsField, setOtherRepairsField] = useState(
    useStore((state) => state.others)?.filter(
      (item) => item.category === "Repairs and Maintenance Facilities"
    ) || []
  );
  // ADDING NEW OTHER REPAIR FIELDS
  const addNewOthersRepairs = () => {
    setOtherRepairsField([
      ...othersRepairsField,
      {
        category: "Repairs and Maintenance of Facilities",
        name: "",
        cost: "",
      },
    ]);
  };
  // REMOVING OTHER REPAIR FIELDS
  const removeOthersRepairs = (index) => {
    const updatedFields = [...othersRepairsField];
    updatedFields.splice(index, 1);
    setOtherRepairsField(updatedFields);
  };
  // FUNCTION TO UPDATE THE NAME OF THE FIRST INPUT FIELD IN OTHER REPAIR
  const updateOthersRepairsName = (index, value) => {
    const updatedFields = [...othersRepairsField];
    updatedFields[index].name = value;
    setOtherRepairsField(updatedFields);
  };
  // FUNCTION TO UPDATE THE COST OF THE SECOND INPUT FIELD IN OTHER REPAIR
  const updateOthersRepairsCost = (index, cost) => {
    const updatedFields = [...othersRepairsField];
    updatedFields[index].cost = cost;
    setOtherRepairsField(updatedFields);
  };

  // FOR PROJECT STAFF
  const [projectStaffField, setProjectStaffField] = useState(
    useStore((state) => state.projectStaff || [])
  );
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
  const [projectLeaderField, setProjectLeaderField] = useState(
    useStore((state) => state.projectLeader || [])
  );

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

  // DRAG AND DROP FOR GANTT CHART
  const handleFiles = (files) => {
    setGanttFiles(files);
    const label = document.querySelector(".file-label-gantt");
    label.textContent = "";
    if (files && files.length >= 2) {
      const fileCountSpan = document.createElement("span");
      fileCountSpan.textContent = files.length + " files";
      label.appendChild(fileCountSpan);
    } else if (files && files.length === 1) {
      const fileNameSpan = document.createElement("span");
      fileNameSpan.textContent = files[0].name;
      label.appendChild(fileNameSpan);
    }
  };

  // DRAG AND DROP FOR RESUME
  const handleResumeFiles = (files) => {
    setResumeFiles(files);
    const resumeLabel = document.querySelector(".file-label-resume");
    resumeLabel.textContent = "";
    if (files && files.length >= 2) {
      const fileCountSpan = document.createElement("span");
      fileCountSpan.textContent = files.length + " files";
      resumeLabel.appendChild(fileCountSpan);
    } else if (files && files.length === 1) {
      const fileNameSpan = document.createElement("span");
      fileNameSpan.textContent = files[0].name;
      resumeLabel.appendChild(fileNameSpan);
    }
  };

  // Array containing the labels for the Sustainable Development Goals (SDGs)
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

  // State hook to manage the checked state of SDGs
  const [checkedSDGs, setCheckedSDGs] = useState(Array(17).fill(false));

  // Function to handle checkbox change
  const handleCheckboxChange = (index) => {
    const updatedCheckedSDGs = [...checkedSDGs];
    updatedCheckedSDGs[index] = !updatedCheckedSDGs[index];
    setCheckedSDGs(updatedCheckedSDGs);
  };

  // SDG INITIAL VALUE
  const isSDGSelected = (index) => {
    if (!goal || !Array.isArray(goal)) return false; // Check if goal is undefined, null, or not an array

    const sdgString = `sdg${index + 1}`;
    return goal.includes(sdgString);
  };

  // FOR UPDATING THE DATABASE
  const { mutate } = useMutation({
    mutationFn: updateProposal,
    mutationKey: "updateList",
    onSuccess: async () => {
      await queryClient.invalidateQueries(["proposal", idNum]);
    },
  });

  // SUBMIT BUTTON
  const onSave = async (formData) => {
    const otherData = {
      others: [
        ...othersSuppliesField.map((item) => ({
          category: "Supplies and Materials",
          name: item.name,
          cost: item.cost,
        })),
        ...othersCommunicationField.map((item) => ({
          category: "Communication Expenses",
          name: item.name,
          cost: item.cost,
        })),
        ...othersProfessionalField.map((item) => ({
          category: "Professional Services",
          name: item.name,
          cost: item.cost,
        })),
        ...othersRepairsField.map((item) => ({
          category: "Repairs and Maintenance of Facilities",
          name: item.name,
          cost: item.cost,
        })),
        ...semiExpandableField.map((item) => ({
          category: "Semi-Expendable",
          name: item.name,
          cost: item.cost,
        })),
        ...semiIctField.map((item) => ({
          category: "Semi ICT Equipment",
          name: item.name,
          cost: item.cost,
        })),
        ...capitalField.map((item) => ({
          category: "Capital Outlay and Equipment",
          name: item.name,
          cost: item.cost,
        })),
      ],
    };
    // const passData = {
    //   status: updateId,
    //   id: idNum,
    //   projectTitle: data.projectTitle,
    //   projectLeader: projectLeaderData,
    //   projectStaff: projectStaffData,
    //   sdg: checkedIndices,
    //   startDate: data.startDate,
    //   endDate: data.endDate,
    //   executiveSummary: data.summary,
    //   generalObjective: data.genObjective,
    //   specObjective: fields.map((item) => item.value),
    //   rationalSignificance: data.rational,
    //   reviewOfRelatedLiterature: data.reviewrelatedlit,
    //   methodology: data.methodology,
    //   references: data.reference,
    //   travelingCostLocal: data.localTravelCost,
    //   travelingCostForeign: data.foreignTravelCost,
    //   trainingExpenses: data.trainingExpense,
    //   officeMaterials: data.officeSupplies,
    //   accountableForm: data.accountableForms,
    //   drugsAndMedicine: data.drugsMedicine,
    //   laboratoryExpenses: data.laboratoryExpenses,
    //   textbookAndInstructionalMaterials: data.instructionalMaterials,
    //   postageDeliveries: data.postageDel,
    //   communicationExpensesTelephone: data.telephone,
    //   communicationExpensesInternet: data.internetExpenses,
    //   rentExpenses: data.rentEx,
    //   transportationAndDeliveryExpenses: data.transportation,
    //   subscriptionExpenses: data.subsExpense,
    //   consultancyServices: data.consultancy,
    //   generalServices: data.general,
    //   itEquipmentAndSoftware: data.itEquipmentSoftware,
    //   technicalAndScientificEquipment: data.technicalScientific,
    //   laboratoryEquipment: data.laboratoryEquipment,
    //   machineriesAndEquipment: data.machineries,
    //   taxesDutiesPatentAndLicenses: data.taxDuties,
    //   advertisingExpenses: data.advertising,
    //   printingAndBindingExpenses: data.printing,
    //   representation: data.represent,
    //   others: otherData.others,
    // };
    try {
      const checkedIndices = checkedSDGs.reduce((acc, isChecked, index) => {
        if (isChecked || isSDGSelected(index)) {
          acc.push(`sdg${index + 1}`);
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
      if (ganttFiles && ganttFiles.length > 0) {
        const ganttFile = ganttFiles[0];
        ganttBase64 = await fileToBase64(ganttFile);
      }

      let resumeBase64 = "";
      if (resumeFiles && resumeFiles.length > 0) {
        const resumeFile = resumeFiles[0];
        resumeBase64 = await fileToBase64(resumeFile);
      }

      const passData = {
        status: updateId,
        id: idNum,
        projectTitle: formData.projectTitle,
        projectLeader: projectLeaderData,
        projectStaff: projectStaffData,
        sdg: checkedIndices,
        startDate: formData.startDate,
        endDate: formData.endDate,
        executiveSummary: formData.summary,
        generalObjective: formData.genObjective,
        specObjective: fields.map((item) => item.value),
        rationalSignificance: formData.rational,
        reviewOfRelatedLiterature: formData.reviewrelatedlit,
        methodology: formData.methodology,
        references: formData.reference,
        travelingCostLocal: formData.localTravelCost,
        travelingCostForeign: formData.foreignTravelCost,
        trainingExpenses: formData.trainingExpense,
        officeMaterials: formData.officeSupplies,
        accountableForm: formData.accountableForms,
        drugsAndMedicine: formData.drugsMedicine,
        laboratoryExpenses: formData.laboratoryExpenses,
        textbookAndInstructionalMaterials: formData.instructionalMaterials,
        postageDeliveries: formData.postageDel,
        communicationExpensesTelephone: formData.telephone,
        communicationExpensesInternet: formData.internetExpenses,
        rentExpenses: formData.rentEx,
        transportationAndDeliveryExpenses: formData.transportation,
        subscriptionExpenses: formData.subsExpense,
        consultancyServices: formData.consultancy,
        generalServices: formData.general,
        itEquipmentAndSoftware: formData.itEquipmentSoftware,
        technicalAndScientificEquipment: formData.technicalScientific,
        laboratoryEquipment: formData.laboratoryEquipment,
        machineriesAndEquipment: formData.machineries,
        taxesDutiesPatentAndLicenses: formData.taxDuties,
        advertisingExpenses: formData.advertising,
        printingAndBindingExpenses: formData.printing,
        representation: formData.represent,
        others: otherData.others,
      };

      // Include both gantt and resume properties in passData
      passData.workPlan = ganttBase64 || passData.workPlan || chart || "";
      passData.resume = resumeBase64 || passData.resume || vitae || "";

      await mutate(passData);
      console.log(
        "Successfully updated the proposal:",
        passData,
        ganttFiles,
        resumeFiles
      ); // LOG THE DATA BEING PASSED TO DB
      toast.success("Successfully updated the proposal.", {
        autoClose: 1200,
      });
    } catch (error) {
      console.error("Error updating proposal:", error);
      toast.error("Error updating proposal. Please try again later.", {
        autoClose: 1200,
      });
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
          {/* BUTTONS */}
          <div className="d-flex flex-row justify-content-end align-items-center mt-5 me-5">
            <Row className="">
              <Col sm="12">
                {/* Proposal Details button */}
                <button
                  className={`btn ${
                    showProposalDetails ? "btn-primary" : "btn-outline-primary"
                  } border-0`}
                  onClick={toggleProposalDetails}
                >
                  Project Details
                </button>
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="text-primary ms-4 me-3"
                ></FontAwesomeIcon>

                {/* Line Item Budget button */}
                <button
                  className={`btn ${
                    showLineItemBudget ? "btn-primary" : "btn-outline-primary"
                  } ms-2 border-0`}
                  onClick={lineItemBudgetButton}
                >
                  Line Item Budget
                </button>
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="text-primary ms-4 me-3"
                ></FontAwesomeIcon>

                {/* Resume/ WorkPlan */}
                <button
                  className={`btn ${
                    showFileUpload ? "btn-primary" : "btn-outline-primary"
                  } ms-2 border-0`}
                  onClick={renderFileUpload}
                >
                  File Upload
                </button>
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="text-primary ms-4 me-3"
                ></FontAwesomeIcon>

                {/* Submission button */}
                <button
                  className={`btn ${
                    showSubmitButton ? "btn-primary" : "btn-outline-primary"
                  } ms-2 border-0`}
                  onClick={renderSubmitButton}
                >
                  Submit
                </button>
              </Col>
            </Row>
          </div>

          <Form>
            {/* PROPOSAL DETAILS */}
            {showProposalDetails && (
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
                        id="projectTitle"
                        name="projectTitle"
                        as="textarea"
                        style={{ height: "10rem" }}
                        {...register("projectTitle")}
                      />
                      <p
                        className="error text-danger fw-bolder mt-2"
                        style={{ fontSize: "12px" }}
                      >
                        {errors.projectTitle?.message}
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
                        <Form.Label className="fw-bold">
                          Email Address
                        </Form.Label>
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
                            defaultChecked={isSDGSelected(index)}
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
                            defaultChecked={isSDGSelected(index + 9)}
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
                        value={sum}
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
                        value={gen}
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
                     
                      {/* RATIONAL / SIGNIFICANCE */}
                      <Row className="mb-3">
                        <Form.Group as={Col} sm="12">
                          <Form.Label className="fw-bold">
                            Rational/ Significance
                          </Form.Label>
                          <Editor
                            id="rational"
                            name="rational"
                            value={rat}
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
                            value={rev}
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
                          <Form.Label className="fw-bold">
                            Methodology
                          </Form.Label>
                          <Editor
                            id="methodology"
                            name="methodology"
                            value={meth}
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
                          <Form.Label className="fw-bold">
                            References
                          </Form.Label>
                          <Editor
                            id="reference"
                            name="reference"
                            value={refer}
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
                </Container>
              </>
            )}
            {/* LINE ITEM BUDGET */}
            {showLineItemBudget && (
              <div ref={submitRef}>
                <Container fluid className={styles.container_width}>
                  <Row className="mb-3">
                    <Col sm="12">
                      <h4 className="fw-bold">
                        Maintenance and Other Operating Expenses
                      </h4>
                    </Col>
                  </Row>

                  {/* TRAVEL COST*/}
                  <Row className="mb-3">
                    <Col sm="12">
                      <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                        Traveling Cost
                      </h5>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Label className="fw-bold">a. Local</Form.Label>
                        <Form.Control
                          id="localTravelCost"
                          name="localTravelCost"
                          type="text"
                          className="form-control"
                          {...register("localTravelCost")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.localTravelCost?.message}
                        </p>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="fw-bold">b. Foreign</Form.Label>
                        <Form.Control
                          id="foreignTravelCost"
                          name="foreignTravelCost"
                          type="text"
                          className="form-control"
                          {...register("foreignTravelCost")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.foreignTravelCost?.message}
                        </p>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* TRAINING EXPENSES */}
                  <Row className="mb-3">
                    <Col sm="12">
                      <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                        Training Expenses
                      </h5>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Control
                          id="trainingExpense"
                          name="trainingExpense"
                          type="text"
                          className="form-control"
                          {...register("trainingExpense")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.trainingExpense?.message}
                        </p>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* SUPPLIES AND MATERIALS */}
                  <Row className="mb-3 flex-row">
                    <Col sm="12">
                      <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                        Supplies and Materials
                      </h5>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          a. Office Supplies
                        </Form.Label>
                        <Form.Control
                          id="officeSupplies"
                          name="officeSupplies"
                          type="text"
                          className="form-control"
                          {...register("officeSupplies")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.officeSupplies?.message}
                        </p>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          c. Drugs and Medicine
                        </Form.Label>
                        <Form.Control
                          id="drugsMedicine"
                          name="drugsMedicine"
                          type="text"
                          className="form-control"
                          {...register("drugsMedicine")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.drugsMedicine?.message}
                        </p>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          e. Textbook and Instructional Materials
                        </Form.Label>
                        <Form.Control
                          id="instructionalMaterials"
                          name="instructionalMaterials"
                          type="text"
                          className="form-control"
                          {...register("instructionalMaterials")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.instructionalMaterials?.message}
                        </p>
                      </Form.Group>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          b. Accountable Forms
                        </Form.Label>
                        <Form.Control
                          id="accountableForms"
                          name="accountableForms"
                          type="text"
                          className="form-control"
                          {...register("accountableForms")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.accountableForms?.message}
                        </p>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          d. Laboratory Expenses
                        </Form.Label>
                        <Form.Control
                          id="laboratoryExpenses"
                          name="laboratoryExpenses"
                          type="text"
                          className="form-control"
                          {...register("laboratoryExpenses")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.laboratoryExpenses?.message}
                        </p>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3 flex-row">
                    <Col sm="6">
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          f. Others
                          <button
                            type="button"
                            className="btn border-0"
                            onClick={addNewOthersSupplies}
                          >
                            <FontAwesomeIcon
                              className="text-primary"
                              icon={faSquarePlus}
                            />
                          </button>
                        </Form.Label>
                        {/* DYNAMIC INPUT */}
                        {othersSuppliesField.map((item, index) => (
                          <div
                            key={item.id || index}
                            className="d-flex align-items-start mb-4 position-relative"
                          >
                            <div className="flex-grow-1">
                              {/* INPUT COMPONENT */}
                              <div className="d-flex">
                                <Form.Control
                                  id={`othersSupplies${item}`}
                                  name={`othersSupplies${index}`}
                                  defaultValue={
                                    item.name !== undefined
                                      ? item.name
                                      : item[0]
                                  } // Set the defaultValue to the first item in the array
                                  className="form-control mb-4 me-2"
                                  style={{ flex: 1 }}
                                  onChange={(e) =>
                                    updateOthersSuppliesName(
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                                <Form.Control
                                  id={`othersSuppliesCost${item}`}
                                  name={`othersSuppliesCost${index}`}
                                  defaultValue={
                                    item.cost !== undefined
                                      ? item.cost
                                      : item[1]
                                  } // Set the defaultValue to the second item in the array
                                  placeholder="Cost (e.g., 1000)"
                                  className="form-control mb-4"
                                  style={{ flex: 1 }}
                                  onChange={(e) =>
                                    updateOthersSuppliesCost(
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            {/* Container for the remove button */}
                            <div style={{ position: "relative" }}>
                              <button
                                type="button"
                                className="btn border-0"
                                onClick={() => removeOthersSupplies(index)}
                              >
                                <FontAwesomeIcon
                                  className="text-danger"
                                  icon={faRectangleXmark}
                                />
                              </button>
                            </div>
                          </div>
                        ))}
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* POSTAGE AND DELIVERIES */}
                  <Row className="mb-3">
                    <Col sm="12">
                      <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                        Postage and Deliveries
                      </h5>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Control
                          id="postageDel"
                          name="postageDel"
                          type="text"
                          className="form-control"
                          {...register("postageDel")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.postageDel?.message}
                        </p>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* COMMUNICATION EXPENSES */}
                  <Row className="mb-3 flex-row">
                    <Col sm="12">
                      <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                        Communication Expenses
                      </h5>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          a. Telephone Expenses - Mobile
                        </Form.Label>
                        <Form.Control
                          id="telephone"
                          name="telephone"
                          type="text"
                          className="form-control"
                          {...register("telephone")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.telephone?.message}
                        </p>
                      </Form.Group>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          b. Internet Expenses
                        </Form.Label>
                        <Form.Control
                          id="internetExpenses"
                          name="internetExpenses"
                          type="text"
                          className="form-control"
                          {...register("internetExpenses")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.internetExpenses?.message}
                        </p>
                      </Form.Group>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          c. Others
                          <button
                            type="button"
                            className="btn border-0"
                            onClick={addNewOthersCommunication}
                          >
                            <FontAwesomeIcon
                              className="text-primary"
                              icon={faSquarePlus}
                            />
                          </button>
                        </Form.Label>
                        {/* DYNAMIC INPUT */}
                        {othersCommunicationField.map((item, index) => (
                          <div
                            key={item.id || index}
                            className="d-flex align-items-start mb-4 position-relative"
                          >
                            <div className="flex-grow-1">
                              {/* INPUT COMPONENT */}
                              <div className="d-flex">
                                <Form.Control
                                  id={`othersCommunication${item}`}
                                  name={`othersCommunication${index}`}
                                  defaultValue={
                                    item.name !== undefined
                                      ? item.name
                                      : item[0]
                                  } // Set the defaultValue to the first item in the array
                                  className="form-control mb-4 me-2"
                                  style={{ flex: 1 }}
                                  onChange={(e) =>
                                    updateOthersCommunicationName(
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                                <Form.Control
                                  id={`othersCommunicationCost${item}`}
                                  name={`othersCommunicationsCost${index}`}
                                  defaultValue={
                                    item.cost !== undefined
                                      ? item.cost
                                      : item[1]
                                  } // Set the defaultValue to the second item in the array
                                  placeholder="Cost (e.g., 1000)"
                                  className="form-control mb-4"
                                  style={{ flex: 1 }}
                                  onChange={(e) =>
                                    updateOthersCommunicationCost(
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            {/* Container for the remove button */}
                            <div style={{ position: "relative" }}>
                              <button
                                type="button"
                                className="btn border-0"
                                onClick={() => removeOthersCommunication(index)}
                              >
                                <FontAwesomeIcon
                                  className="text-danger"
                                  icon={faRectangleXmark}
                                />
                              </button>
                            </div>
                          </div>
                        ))}
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* RENT EXPENSES*/}
                  <Row className="mb-3">
                    <Col sm="12">
                      <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                        Rent Expenses
                      </h5>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Control
                          id="rentEx"
                          name="rentEx"
                          type="text"
                          className="form-control"
                          {...register("rentEx")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.rentEx?.message}
                        </p>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* TRANSPORTATION AND DELIVERY EXPENSES*/}
                  <Row className="mb-3">
                    <Col sm="12">
                      <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                        Transportation and Delivery Expenses
                      </h5>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Control
                          id="transportation"
                          name="transportation"
                          type="text"
                          className="form-control"
                          {...register("transportation")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.transportation?.message}
                        </p>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* SUBSCRIPTION EXPENSES*/}
                  <Row className="mb-3">
                    <Col sm="12">
                      <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                        Subscription Expenses
                      </h5>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Control
                          id="subsExpense"
                          name="subsExpense"
                          type="text"
                          className="form-control"
                          {...register("subsExpense")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.subsExpense?.message}
                        </p>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* PROFESSIONAL SERVICES */}
                  <Row className="mb-3 flex-row">
                    <Col sm="12">
                      <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                        Professional Services
                      </h5>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          a. Consultancy Services
                        </Form.Label>
                        <Form.Control
                          id="consultancy"
                          name="consultancy"
                          type="text"
                          className="form-control"
                          {...register("consultancy")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.consultancy?.message}
                        </p>
                      </Form.Group>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          b. General Services
                        </Form.Label>
                        <Form.Control
                          id="general"
                          name="general"
                          type="text"
                          className="form-control"
                          {...register("general")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.general?.message}
                        </p>
                      </Form.Group>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          c. Others
                          <button
                            type="button"
                            className="btn border-0"
                            onClick={addNewOthersProfessional}
                          >
                            <FontAwesomeIcon
                              className="text-primary"
                              icon={faSquarePlus}
                            />
                          </button>
                        </Form.Label>
                        {/* DYNAMIC INPUT */}
                        {othersProfessionalField.map((item, index) => (
                          <div
                            key={item.id || index}
                            className="d-flex align-items-start mb-4 position-relative"
                          >
                            <div className="flex-grow-1">
                              {/* INPUT COMPONENT */}
                              <div className="d-flex">
                                <Form.Control
                                  id={`othersProfessional${item}`}
                                  name={`othersProfessional${index}`}
                                  defaultValue={
                                    item.name !== undefined
                                      ? item.name
                                      : item[0]
                                  } // Set the defaultValue to the first item in the array
                                  className="form-control mb-4 me-2"
                                  style={{ flex: 1 }}
                                  onChange={(e) =>
                                    updateOthersProfessionalName(
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                                <Form.Control
                                  id={`othersProfessionalCost${item}`}
                                  name={`othersProfessionalCost${index}`}
                                  defaultValue={
                                    item.cost !== undefined
                                      ? item.cost
                                      : item[1]
                                  } // Set the defaultValue to the second item in the array
                                  placeholder="Cost (e.g., 1000)"
                                  className="form-control mb-4"
                                  style={{ flex: 1 }}
                                  onChange={(e) =>
                                    updateOthersProfessionalCost(
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            {/* Container for the remove button */}
                            <div style={{ position: "relative" }}>
                              {/* Render close button if index is greater than 0 */}
                              <button
                                type="button"
                                className="btn border-0"
                                onClick={() => removeOthersProfessional(index)}
                              >
                                <FontAwesomeIcon
                                  className="text-danger"
                                  icon={faRectangleXmark}
                                />
                              </button>
                            </div>
                          </div>
                        ))}
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* REPAIRS AND MAINTENANCE OF FACILITIES */}
                  <Row className="mb-3 flex-row">
                    <Col sm="12">
                      <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                        Repairs and Maintenance of Facilities
                      </h5>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          a. IT Equipment and Software
                        </Form.Label>
                        <Form.Control
                          id="itEquipmentSoftware"
                          name="itEquipmentSoftware"
                          type="text"
                          className="form-control"
                          {...register("itEquipmentSoftware")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.itEquipmentSoftware?.message}
                        </p>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          c. Technical and Scientific Equipment
                        </Form.Label>
                        <Form.Control
                          id="technicalScientific"
                          name="technicalScientific"
                          type="text"
                          className="form-control"
                          {...register("technicalScientific")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.technicalScientific?.message}
                        </p>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          e. Others
                          <button
                            type="button"
                            className="btn border-0"
                            onClick={addNewOthersRepairs}
                          >
                            <FontAwesomeIcon
                              className="text-primary"
                              icon={faSquarePlus}
                            />
                          </button>
                        </Form.Label>
                        {/* DYNAMIC INPUT */}
                        {othersRepairsField.map((item, index) => (
                          <div
                            key={item.id || index}
                            className="d-flex align-items-start mb-4 position-relative"
                          >
                            <div className="flex-grow-1">
                              {/* INPUT COMPONENT */}
                              <div className="d-flex">
                                <Form.Control
                                  id={`othersRepairs${item}`}
                                  name={`othersRepairs${index}`}
                                  defaultValue={
                                    item.name !== undefined
                                      ? item.name
                                      : item[0]
                                  } // Set the defaultValue to the first item in the array
                                  className="form-control mb-4 me-2"
                                  style={{ flex: 1 }}
                                  onChange={(e) =>
                                    updateOthersRepairsName(
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                                <Form.Control
                                  id={`othersRepairsCost${item}`}
                                  name={`othersRepairsCost${index}`}
                                  defaultValue={
                                    item.cost !== undefined
                                      ? item.cost
                                      : item[1]
                                  } // Set the defaultValue to the second item in the array
                                  placeholder="Cost (e.g., 1000)"
                                  className="form-control mb-4"
                                  style={{ flex: 1 }}
                                  onChange={(e) =>
                                    updateOthersRepairsCost(
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            {/* Container for the remove button */}
                            <div style={{ position: "relative" }}>
                              <button
                                type="button"
                                className="btn border-0"
                                onClick={() => removeOthersRepairs(index)}
                              >
                                <FontAwesomeIcon
                                  className="text-danger"
                                  icon={faRectangleXmark}
                                />
                              </button>
                            </div>
                          </div>
                        ))}
                      </Form.Group>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          b. Laboratory Equipment
                        </Form.Label>
                        <Form.Control
                          id="laboratoryEquipment"
                          name="laboratoryEquipment"
                          type="text"
                          className="form-control"
                          {...register("laboratoryEquipment")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.laboratoryEquipment?.message}
                        </p>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          d. Machineries and Equipment
                        </Form.Label>
                        <Form.Control
                          id="machineries"
                          name="machineries"
                          type="text"
                          className="form-control"
                          {...register("machineries")}
                        ></Form.Control>
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.machineries?.message}
                        </p>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* TAXES, DUTIES, PATENT AND LICENSES */}
                  <Row className="mb-3">
                    <Col sm="12">
                      <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                        Taxes, Duties, Patent, and Licenses
                      </h5>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Control
                          id="taxDuties"
                          name="taxDuties"
                          type="text"
                          className="form-control"
                          {...register("taxDuties")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.taxDuties?.message}
                        </p>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* OTHER MAINTENANCE AND OPERATING EXPENSES */}
                  <Row className="mb-3 flex-row">
                    <Col sm="12">
                      <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                        Other Maintenance and Operating Expenses
                      </h5>
                    </Col>

                    {/* ADVERTISING EXPENSES */}
                    <Col sm="6">
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          a. Advertising Expenses
                        </Form.Label>
                        <Form.Control
                          id="advertising"
                          name="advertising"
                          type="text"
                          className="form-control"
                          {...register("advertising")}
                        ></Form.Control>
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.advertising?.message}
                        </p>
                      </Form.Group>

                      {/* PRINTING AND BINDING EXPENSES */}
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          b. Printing and Binding Expenses
                        </Form.Label>
                        <Form.Control
                          id="printing"
                          name="printing"
                          type="text"
                          className="form-control"
                          {...register("printing")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.printing?.message}
                        </p>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* SEMI-EXPENDABLE */}
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      c. Semi-Expendable
                      <button
                        type="button"
                        className="btn border-0"
                        onClick={addNewSemiExpandable}
                      >
                        <FontAwesomeIcon
                          className="text-primary"
                          icon={faSquarePlus}
                        />
                      </button>
                    </Form.Label>
                    {/* DYNAMIC INPUT */}
                    {semiExpandableField.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="d-flex align-items-start mb-4 position-relative"
                      >
                        <div className="flex-grow-1">
                          {/* INPUT COMPONENT */}
                          <div className="d-flex">
                            <Form.Control
                              id={`semiExpandable${item}`}
                              name={`semiExpandable${index}`}
                              defaultValue={
                                item.name !== undefined ? item.name : item[0]
                              } // Set the defaultValue to the first item in the array
                              className="form-control mb-4 me-2"
                              style={{ flex: 1 }}
                              onChange={(e) =>
                                updateSemiExpandableValue(index, e.target.value)
                              }
                            />
                            <Form.Control
                              id={`semiExpandableCost${item}`}
                              name={`semiExpandableCost${index}`}
                              defaultValue={
                                item.cost !== undefined ? item.cost : item[1]
                              } // Set the defaultValue to the second item in the array
                              placeholder="Cost (e.g., 1000)"
                              className="form-control mb-4"
                              style={{ flex: 1 }}
                              onChange={(e) =>
                                updateSemiExpandableCost(index, e.target.value)
                              }
                            />
                          </div>
                        </div>
                        {/* Container for the remove button */}
                        <div style={{ position: "relative" }}>
                          {/* Render close button if index is greater than 0 */}
                          <button
                            type="button"
                            className="btn border-0"
                            onClick={() => removeSemiExpandable(index)}
                          >
                            <FontAwesomeIcon
                              className="text-danger"
                              icon={faRectangleXmark}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </Form.Group>

                  {/* SEMI ICT EQUIPMENT */}
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      d. Semi ICT Equipment
                      <button
                        type="button"
                        className="btn border-0"
                        onClick={addNewSemiIct}
                      >
                        <FontAwesomeIcon
                          className="text-primary"
                          icon={faSquarePlus}
                        />
                      </button>
                    </Form.Label>
                    {/* DYNAMIC INPUT */}
                    {semiIctField.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="d-flex align-items-start mb-4 position-relative"
                      >
                        <div className="flex-grow-1">
                          {/* INPUT COMPONENT */}
                          <div className="d-flex">
                            <Form.Control
                              id={`semiIctEqui${item}`}
                              name={`semiIctEqui${index}`}
                              defaultValue={
                                item.name !== undefined ? item.name : item[0]
                              } // Set the defaultValue to the first item in the array
                              className="form-control mb-4 me-2"
                              style={{ flex: 1 }}
                              onChange={(e) =>
                                updateSemiIctValue(index, e.target.value)
                              }
                            />
                            <Form.Control
                              id={`semiIctCost${item}`}
                              name={`semiIctCost${index}`}
                              defaultValue={
                                item.cost !== undefined ? item.cost : item[1]
                              } // Set the defaultValue to the second item in the array
                              placeholder="Cost (e.g., 1000)"
                              className="form-control mb-4"
                              style={{ flex: 1 }}
                              onChange={(e) =>
                                updateSemiIctCost(index, e.target.value)
                              }
                            />
                          </div>
                        </div>
                        {/* Container for the remove button */}
                        <div style={{ position: "relative" }}>
                          <button
                            type="button"
                            className="btn border-0"
                            onClick={() => removeSemiIct(index)}
                          >
                            <FontAwesomeIcon
                              className="text-danger"
                              icon={faRectangleXmark}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                    <p
                      className="error text-danger fw-bolder mt-2"
                      style={{ fontSize: "12px" }}
                    >
                      {errors.semiIctEqui?.message}
                    </p>
                  </Form.Group>

                  {/* REPRESENTATION */}
                  <Row className="mb-3">
                    <Col sm="12">
                      <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                        Representation
                      </h5>
                    </Col>
                    <Col sm="6">
                      <Form.Group>
                        <Form.Control
                          id="represent"
                          name="represent"
                          type="text"
                          className="form-control"
                          {...register("represent")}
                        />
                        <p
                          className="error text-danger fw-bolder mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.represent?.message}
                        </p>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* CAPITAL OUTLAY AND EQUIPMENT */}
                  <Form.Group>
                    <Form.Label
                      className="fw-bold"
                      style={{ color: "#387ADF" }}
                    >
                      Capital Outlay and Equipment
                      <button
                        type="button"
                        className="btn border-0"
                        onClick={addNewCapital}
                      >
                        <FontAwesomeIcon
                          className="text-primary"
                          icon={faSquarePlus}
                        />
                      </button>
                    </Form.Label>
                    {/* DYNAMIC INPUT */}
                    {capitalField.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="d-flex align-items-start mb-4 position-relative"
                      >
                        <div className="flex-grow-1">
                          {/* INPUT COMPONENT */}
                          <div className="d-flex">
                            <Form.Control
                              id={`coeArray${item}`}
                              name={`coeArray${index}`}
                              defaultValue={
                                item.name !== undefined ? item.name : item[0]
                              } // Set the defaultValue to the first item in the array
                              className="form-control mb-4 me-2"
                              style={{ flex: 1 }}
                              onChange={(e) =>
                                updateCapitalValue(index, e.target.value)
                              }
                            />
                            <Form.Control
                              id={`coeArrayCost${item}`}
                              name={`coeArrayCost${index}`}
                              defaultValue={
                                item.cost !== undefined ? item.cost : item[1]
                              } // Set the defaultValue to the second item in the array
                              placeholder="Cost (e.g., 1000)"
                              className="form-control mb-4"
                              style={{ flex: 1 }}
                              onChange={(e) =>
                                updateCapitalCost(index, e.target.value)
                              }
                            />
                          </div>
                        </div>
                        {/* Container for the remove button */}
                        <div style={{ position: "relative" }}>
                          <button
                            type="button"
                            className="btn border-0"
                            onClick={() => removeCapital(index)}
                          >
                            <FontAwesomeIcon
                              className="text-danger"
                              icon={faRectangleXmark}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                    <p
                      className="error text-danger fw-bolder mt-2"
                      style={{ fontSize: "12px" }}
                    >
                      {errors.capitalOutlayEquipment?.message}
                    </p>
                  </Form.Group>
                </Container>
              </div>
            )}
            {/* Resume/ Work Plan */}
            {showFileUpload && (
              <Container
                className="justify-content-center align-items-center d-flex gap-5"
                style={{ marginTop: "5rem" }}
              >
                <Row className="mb-3">
                  {/* Gantt Chart */}
                  <Col sm="6">
                    <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                      Major Activities/Workplan
                    </h5>
                    <div
                      className={`${styles.custom_file_upload} ${styles.drag_drop_area}`}
                      onClick={() => {
                        document.getElementById("workPlan").click();
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        // Add styles to indicate drag over
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        // Remove styles when drag leaves
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const files = e.dataTransfer.files;
                        handleFiles(files);
                      }}
                    >
                      <label htmlFor="workPlan">
                        Upload File
                        <span className="ms- me-2"></span>
                        <FontAwesomeIcon
                          icon={faUpload}
                          className="mt-3 fs-2s"
                        ></FontAwesomeIcon>
                      </label>
                      <input
                        type="file"
                        name="workPlan"
                        id="workPlan"
                        accept="application/pdf"
                        hidden
                        {...register("workPlan")}
                        onChange={(e) => {
                          handleFiles(e.target.files);
                        }}
                      />
                      <div className={`${styles.file_label_container} mt-3`}>
                        <span className="file-label-gantt fs-6 text-primary"></span>
                      </div>
                    </div>

                    <h6 className="mt-3">
                      Uploaded File:
                      <span className="ms-2"></span>
                      <span>
                        {/* <a href={ganttURL} target="_blank">
                          Work Plan
                        </a> */}
                      </span>
                    </h6>
                  </Col>

                  {/* Line Item Budget */}
                  <Col sm="6">
                    <h5 className="fw-bold" style={{ color: "#387ADF" }}>
                      Resume
                    </h5>
                    <div
                      className={`${styles.custom_file_upload} ${styles.drag_drop_area}`}
                      onClick={() => {
                        document.getElementById("resume").click();
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        // Add styles to indicate drag over
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        // Remove styles when drag leaves
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const resumeFiles = e.dataTransfer.files;
                        handleResumeFiles(resumeFiles);
                      }}
                    >
                      <label htmlFor="resume">
                        Upload File
                        <FontAwesomeIcon
                          icon={faUpload}
                          className="ms-2 fs-4"
                        />
                      </label>
                      <input
                        type="file"
                        name="resume"
                        id="resume"
                        accept="application/pdf"
                        hidden
                        {...register("resume")}
                        onChange={(e) => {
                          handleResumeFiles(e.target.files);
                        }}
                      />
                      <div className={`${styles.file_label_container} mt-3`}>
                        <span className="file-label-resume fs-6 text-primary"></span>
                      </div>
                    </div>

                    <h6 className="mt-3">
                      Uploaded File:
                      <span className="ms-2"></span>
                      <span>
                        {/* <a href={resumeURL} target="_blank">
                          Resume
                        </a> */}
                      </span>
                    </h6>
                  </Col>
                </Row>
              </Container>
            )}
            {/* Submit Button */}
            {showSubmitButton && (
              <div className="d-flex justify-content-center mt-5">
                <div style={{ width: "40%" }}>
                  <Card>
                    <Card.Title>
                      <h4 className="ms-4 mt-4">Submit</h4>
                    </Card.Title>
                    <Card.Body>
                      <p className="ms-4">
                        Please make sure to complete your changes by submitting
                        them using the button below.
                      </p>
                    </Card.Body>
                    <div className="d-flex justify-content-end me-4">
                      <button
                        disabled={isSubmitting}
                        onClick={handleSubmit(onSave)}
                        type="submit"
                        className="btn btn-primary mb-4 ms-2 w-25"
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
                    <Card.Footer>
                      <div>
                        <p style={{ fontSize: "12px", width: "68%" }}>
                          <span className="text-danger fw-bold">Note:</span> If
                          the submission of the Proposal is{" "}
                          <span className="text-success fw-bold">
                            successful
                          </span>
                          , a notification will be displayed. Otherwise, please
                          review all input fields for any{" "}
                          <span className="text-danger fw-bold">errors</span>.
                        </p>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
              </div>
            )}
            <ToastContainer position="top-center" />
          </Form>
        </FormProvider>
      </div>
    </>
  );
}

export default Proposal;
