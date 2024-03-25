import { create } from "zustand";

export const useStore = create((set) => ({
  statusId: "",
  setStatusId: (statusId) => set({ statusId }),
  id: "",
  setId: (id) => set({ id }),
  programTitle: "",
  setProgramTitle: (programTitle) => set({ programTitle }),
  projectLeader: {},
  setProjectLeader: (projectLeader) => set({ projectLeader }),
  projectStaff: [{}],
  setProjectStaff: (projectStaff) => set({ projectStaff }),
  sdgoal: {},
  setSdg: (sdgoal) => set({ sdgoal }),
  startDate: "",
  setStartDate: (startDate) => set({ startDate }),
  endDate: "",
  setEndDate: (endDate) => set({ endDate }),
  summary: "",
  setSummary: (summary) => set({ summary }),
  genObjective: "",
  setGenObjective: (genObjective) => set({ genObjective }),
  specObjective: [""],
  setSpecObjective: (specObjective) => set({ specObjective }),
  rational: "",
  setRational: (rational) => set({ rational }),
  review: "",
  setReview: (review) => set({ review }),
  methodology: "",
  setMethodology: (methodology) => set({ methodology }),
  reference: "",
  setReference: (reference) => set({ reference }),


  // LIB
  travelingCost: {
    local: "",
    foreign: "",
  },
  setTravelingCost: (travelingCost) => set({ travelingCost }),
  // Training Expenses
  trainingExpenses: "",
  setTrainingExpenses: (trainingExpenses) => set({ trainingExpenses }),
  // Supplies and Materials
  suppliesMaterials: {
    officeSupplies: "",
    accountableForms: "",
    drugsMedicine: "",
    laboratoryExpenses: "",
    textbookInstructional: "",
  },
  setSuppliesMaterials: (suppliesMaterials) => set({ suppliesMaterials }),
  // Postage and Deliveries
  postageDeliveries: "",
  setPostageDeliveries: (postageDeliveries) => set({ postageDeliveries }),
  // Communication Expenses
  communicationExpenses: {
    telephoneExpenses: "",
    internetExpenses: "",
  },
  setCommunicationExpenses: (communicationExpenses) =>
    set({ communicationExpenses }),
  // Rent Expenses
  rentExpenses: "",
  setRentExpenses: (rentExpenses) => set({ rentExpenses }),
  // Transportation and Delivery Expenses
  transportationDelivery: "",
  setTransportationDelivery: (transportationDelivery) =>
    set({ transportationDelivery }),
  // Subscription Expenses
  subscriptionDelivery: "",
  setSubscriptionDelivery: (subscriptionDelivery) =>
    set({ subscriptionDelivery }),
  // Professional Services
  professionalServices: {
    consultancyServices: "",
    generalServices: "",
  },
  setProfessionalServices: (professionalServices) =>
    set({ professionalServices }),
  // Repairs and Maintenance of Facilities
  repairsMaintenance: {
    itEquipment: "",
    laboratoryEquipment: "",
    technicalScientificEquipment: "",
    machineriesEquipment: "",
  },
  setRepairMaintenance: (repairsMaintenance) => set({ repairsMaintenance }),
  // Taxes, Duties, Patent and Licenses
  taxesDutiesPatentLicenses: "",
  setTaxesDutiesPatentLicenses: (taxesDutiesPatentLicenses) =>
    set({ taxesDutiesPatentLicenses }),
  // Other Maintenance and Operating Expenses
  otherMaintenance: {
    advertisingExpenses: "",
    printingBindingExpenses: "",
  },
  setOtherMaintenance: (otherMaintenance) => set({ otherMaintenance }),
  // Representation
  representation: "",
  setRepresentation: (representation) => set({ representation }),
  // Capital Outlay and Equipment
  capitalOutlayEquipment: [["", ""]],
  setCapitalOutlayEquipment: (capitalOutlayEquipment) =>
    set({ capitalOutlayEquipment }),
  others: [{}],
  setOthers: (others) => set({ others }),

  draftItems: "",
  setDraftItems: (draftItems) => set({ draftItems }),
  evaluationItems: "",
  setEvaluationItems: (evaluationItems) => set({ evaluationItems }),
  revisionItems: "",
  setRevisionItems: (revisionItems) => set({ revisionItems }),
  approvedItems: "",
  setApprovedItems: (approvedItems) => set({ approvedItems }),
  disapprovedItems: "",
  setDisapprovedItems: (disapprovedItems) => set({ disapprovedItems }),
}));