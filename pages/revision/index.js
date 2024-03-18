import StatusCards from "@/components/StatusCards";
import React from "react";
import { getRevision } from "../api/proposal";

function Revision() {

  return (
    <StatusCards
      proposalStatus="revision"
      getStatus={getRevision}
      dataStatus="revision"
    />
  );
}

export default Revision;
