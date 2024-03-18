import StatusCards from "@/components/StatusCards";
import React from "react";
import { getEvaluation } from "../api/proposal";

function Evaluation() {

  return (
    <StatusCards
      proposalStatus="evaluation"
      getStatus={getEvaluation}
      dataStatus="evaluation"
    />
  );
}

export default Evaluation;
