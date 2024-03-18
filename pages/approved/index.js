import StatusCards from "@/components/StatusCards";
import React from "react";
import { getApproved } from "../api/proposal";

function Approved() {

  return (
    <StatusCards
      proposalStatus="approved"
      getStatus={getApproved}
      dataStatus="approved"
    />
  );
}

export default Approved;
