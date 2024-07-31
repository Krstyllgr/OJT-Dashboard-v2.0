// import StatusCards from "@/components/StatusCards";
// import React from "react";
// import { getEvaluation } from "../api/proposal";

// function Evaluation() {

//   return (
//     <StatusCards
//       proposalStatus="evaluation"
//       getStatus={getEvaluation}
//       dataStatus="evaluation"
//     />
//   );
// }

// export default Evaluation;

import React, { useState, useEffect } from "react";
import StatusCards from "@/components/StatusCards";
import { getProposalsByProponentAndStatus } from "../api/proposal";

function Evaluation() {
  const [evaluationData, setEvaluationData] = useState(null);
  const [proponentId, setProponentId] = useState(null);



  useEffect(() => {
       // Fetch evaluation data when the component mounts
       const fetchData = async () => {
        try {
          // Check if window and window.localStorage are available
          if (typeof window !== "undefined" && window.localStorage) {
            const proponent_id = JSON.parse(window.localStorage.getItem("user")).id;
            setProponentId(proponent_id);
            const response = await getProposalsByProponentAndStatus(proponent_id);
            setEvaluationData(response.data);
          } else {
            console.error("Window or localStorage is not available.");
          }
        } catch (error) {
          console.error("Error fetching evaluation data:", error);
        }
      }
  
      fetchData(); // Call the fetchData function
  }, []); // Empty dependency array to fetch data only once when the component mounts

  // console.log(proponentId)

  return (

    <StatusCards
          proposalStatus="Pending"
          getStatus={(proponentId) => getProposalsByProponentAndStatus(proponentId)}
          dataStatus="Pending"
          proponentId={proponentId} // Pass proponentId as a prop to StatusCards
        />
  );
}

export default Evaluation;
