import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Table, TableBody, TableRow, TableHead } from "@mui/material";
import { styled, TableCell as MuiTableCell } from "@mui/material";
import { getHITLAssessment } from "api/dashboard";
import { useNavigate } from "react-router-dom";
// Styled TableCell with content centered
const TableCell = styled(MuiTableCell)({
  textAlign: "center",
  verticalAlign: "middle",
});

type tableProps = {
  token: string;
};

function HitlInventoryTable({ token }: tableProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const client_id = "coforge";
      try {
        const res = await getHITLAssessment(client_id, token);
        console.log(res, "worked");
        if (res) {
          setAssessments(res); // Assume res is an array of assessments
        }
      } catch (error) {
        console.error("Failed to fetch assessments:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);
  return (
    <div>
      <div className="flex size-auto flex-col items-center justify-center gap-4 rounded-lg bg-white p-10 font-bold shadow-2xl">
        <div className="mb-4 text-2xl">
          Your Cyber Risk and Compliance Assessments
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SL. No.</TableCell>
              <TableCell>Name</TableCell>
              {/* <TableCell>Type of Assessment</TableCell> */}
              <TableCell>Status</TableCell>
              <TableCell>Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assessments && assessments.length > 0 ? (
              assessments.map((assessment: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {assessment.assessment_name.toUpperCase()}
                  </TableCell>
                  {/* <TableCell>{assessment.descriptions}</TableCell> */}
                  <TableCell>
                    <span
                      style={{
                        backgroundColor:
                          assessment.status === "created"
                            ? "#fbbf24"
                            : assessment.status === "pending"
                              ? "#f87171"
                              : "#34d399",
                        borderRadius: "8px",
                        color: "white",
                        padding: "4px 8px",
                        display: "inline-block",
                        maxWidth: "200px",
                      }}
                      className="text-xs"
                    >
                      {assessment.status === "completed"
                        ? "Completed by CYRAPID AI and Pending for Human Assessor"
                        : "Completed by CYRAPID AI and Human Assessor"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      className="flex w-full items-center justify-center rounded-lg px-8 py-4 text-center text-xs font-bold text-white hover:bg-blue-700"
                      style={{
                        backgroundColor:
                          assessment.status === "completed"
                            ? "#4285f4"
                            : "#808080",
                      }}
                      onClick={() => {
                        navigate(`/compliance-assessment/new`, {
                          state: {
                            assessmentName: assessment.assessment_name,
                            userId: assessment.user_id,
                          },
                        });
                      }}
                    >
                      Cyber Risk and Compliance Assessment
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : loading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No Assessments to show</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
export default HitlInventoryTable;
