import StatusCards from "@/components/StatusCards";
import React from "react";
import { getDrafts } from "../api/proposal";

function Drafts() {

  return <StatusCards proposalStatus="drafts" getStatus = {getDrafts} dataStatus="draft"/>;
}

export default Drafts;
