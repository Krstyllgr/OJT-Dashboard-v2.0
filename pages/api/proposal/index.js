import axiosClient from "@/configs/axios";

// GET DATA

export const getDrafts = () => {
  const response = axiosClient.get("/draft");
  return response;
};

export const getEvaluation = () => {
  const response = axiosClient.get("/proposal/find");
  return response;
};

export const getProposalsByProponentAndStatus = (proponentId) => {
  const url = `/proposal/find/${proponentId}`;
  const response = axiosClient.get(url);
  return response;
};

export const getRevision = () => {
  const response = axiosClient.get("/revision");
  return response;
};

export const getApproved = () => {
  const response = axiosClient.get("/approved");
  return response;
};

export const getDisapproved = () => {
  const response = axiosClient.get("/disapproved");
  return response;
};

// UPDATE DATA
export const updateProposal = ({
  status,
  id,
  projectTitle,
  projectLeader,
  projectMembers,
  sdg,
  startDate,
  endDate,
  executiveSummary,
  generalObjective,
  specObjective,
  rationalSignificance,
  reviewOfRelatedLiterature,
  methodology,
  references,
  travelingCostLocal,
  travelingCostForeign,
  trainingExpenses,
  officeMaterials,
  accountableForm,
  drugsAndMedicine,
  laboratoryExpenses,
  textbookAndInstructionalMaterials,
  postageDeliveries,
  communicationExpensesTelephone,
  communicationExpensesInternet,
  rentExpenses,
  transportationAndDeliveryExpenses,
  subscriptionExpenses,
  consultancyServices,
  generalServices,
  itEquipmentAndSoftware,
  laboratoryEquipment,
  technicalAndScientificEquipment,
  machineriesAndEquipment,
  taxesDutiesPatentAndLicenses,
  advertisingExpenses,
  printingAndBindingExpenses,
  representation,
  others,
  workPlan,
  resume
}) => {
  const response = axiosClient.put(`${status}/${id}`, {
    projectTitle,
    projectLeader,
    projectMembers,
    sdg,
    startDate,
    endDate,
    executiveSummary,
    generalObjective,
    specObjective,
    rationalSignificance,
    reviewOfRelatedLiterature,
    methodology,
    references,
    lib: {
      travelingCostLocal,
      travelingCostForeign,
      trainingExpenses,
      officeMaterials,
      accountableForm,
      drugsAndMedicine,
      laboratoryExpenses,
      textbookAndInstructionalMaterials,
      postageDeliveries,
      communicationExpensesTelephone,
      communicationExpensesInternet,
      rentExpenses,
      transportationAndDeliveryExpenses,
      subscriptionExpenses,
      consultancyServices,
      generalServices,
      itEquipmentAndSoftware,
      laboratoryEquipment,
      technicalAndScientificEquipment,
      machineriesAndEquipment,
      taxesDutiesPatentAndLicenses,
      advertisingExpenses,
      printingAndBindingExpenses,
      representation,
      others,
    },
    workPlan,
    resume,
  });
  return response;
};

// ADDING NEW DATA IN THE DATABASE
export const addProposal = async ({
  projectTitle,
  projectLeader,
  projectMembers,
  sdg,
  startDate,
  endDate,
  executiveSummary,
  generalObjective,
  specObjective,
  rationalSignificance,
  reviewOfRelatedLiterature,
  methodology,
  references,
  travelingCostLocal,
  travelingCostForeign,
  trainingExpenses,
  officeMaterials,
  accountableForm,
  drugsAndMedicine,
  laboratoryExpenses,
  textbookAndInstructionalMaterials,
  postageDeliveries,
  communicationExpensesTelephone,
  communicationExpensesInternet,
  rentExpenses,
  transportationAndDeliveryExpenses,
  subscriptionExpenses,
  consultancyServices,
  generalServices,
  itEquipmentAndSoftware,
  laboratoryEquipment,
  technicalAndScientificEquipment,
  machineriesAndEquipment,
  taxesDutiesPatentAndLicenses,
  advertisingExpenses,
  printingAndBindingExpenses,
  representation,
  others,
  workPlan,
  resume,
  proponent_id,
}) => {
  try {
    // if (!lib.others) {
    //   throw new Error("'lib' object or 'others' property is undefined");
    // }
    // // FETCH THE LATEST ID IN EVALUATION
    // const latestIdResponse = await axiosClient.get("http://localhost:4001/proposal/create");
    // // FIND THE MAXIMUM ID FROM THE RESPONSE DATA
    // const latestId = latestIdResponse.data.reduce(
    //   (maxId, proposal) => Math.max(maxId, proposal.id),
    //   0
    // );
    // // INCREMENT THE LATEST ID TO GENERATE THE NEW ID
    // const newId = latestId + 1;

    // POST THE NEW PROPOSAL IN EVALUATION WITH THE NEW GENERATED ID
    const response = await axiosClient.post("http://localhost:4001/proposal/create", {
      // id: newId,
      projectTitle,
      projectLeader: projectLeader,
      projectMembers: projectMembers, // Make sure projectMembers is an array of objects
      sdg: sdg,
      startDate,
      endDate,
      executiveSummary,
      generalObjective,
      specObjective,
      rationalSignificance,
      rrl: reviewOfRelatedLiterature,
      methodology,
      reference: references,
      lib: {
        travelingCostLocal,
        travelingCostForeign,
        trainingExpenses,
        officeMaterials,
        accountableForm,
        drugsAndMedicine,
        laboratoryExpenses,
        textbookAndInstructionalMaterials,
        postageDeliveries,
        communicationExpensesTelephone,
        communicationExpensesInternet,
        rentExpenses,
        transportationAndDeliveryExpenses,
        subscriptionExpenses,
        consultancyServices,
        generalServices,
        itEquipmentAndSoftware,
        laboratoryEquipment,
        technicalAndScientificEquipment,
        machineriesAndEquipment,
        taxesDutiesPatentAndLicenses,
        advertisingExpenses,
        printingAndBindingExpenses,
        representation,
        others,
      },
      workPlan,
      resume,
      proponent_id,
    });
    return response;
  } catch (error) {
    console.error("Error adding proposal:", error);
    throw error;
  }
};

// ADDING NEW USER
export const addNewUser = async ({
  fullName,
  username,
  email,
  password,
  phoneNumber,
  gender,
  affiliation,
  designation,
}) => {
  try {
    // FETCH THE LATEST ID FROM THE USER
    const latestIdResponse = await axiosClient.get("/user");
    // FIND THE MAXIMUM ID FROM THE RESPONSE DATA
    const latestId = latestIdResponse.data.reduce(
      (maxId, proposal) => Math.max(maxId, proposal.id),
      0
    );
    // INCREMENT THE LATEST ID TO GENERATE THE NEW ID
    const newId = latestId + 1;

    // POST THE NEW USER IN USER WITH THE NEW GENERATED ID
    const response = await axiosClient.post("/user", {
      id: newId,
      fullName,
      username,
      email,
      password,
      phoneNumber,
      gender,
      affiliation,
      designation,
    });
    return response;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const getUserProfile = (email) => {
  try {
    const response = axiosClient.get(`user?email=${email}`);
    return response; // Assuming user data is returned as response.data.user
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error; // Throw error to handle it in the calling code
  }
};

export const updateUserProfile = ({
  id,
  fullName,
  email,
  password,
  phoneNumber,
  gender,
  affiliation,
  designation,
}) => {
  try {
    const response = axiosClient.put(`user/${id}`, {
      fullName,
      email,
      password,
      phoneNumber,
      gender,
      affiliation,
      designation,
    });
    return response;
  } catch (error) {
    console.error("Error updating user profile:", error);
  }
};
