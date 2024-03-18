import StatusCards from "@/components/StatusCards";
import React from "react";
import { getDisapproved } from "../api/proposal";

function Disapproved() {

  return (
    <StatusCards
      proposalStatus="disapproved"
      getStatus={getDisapproved}
      dataStatus="disapproved"
    />
  );
}

export default Disapproved;
