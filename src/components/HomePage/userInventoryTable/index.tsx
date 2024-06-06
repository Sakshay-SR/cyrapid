import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Table, TableBody, TableRow, TableHead } from "@mui/material";
import { styled, TableCell as MuiTableCell } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAssessment } from "api/dashboard";
// Styled TableCell with content centered
const TableCell = styled(MuiTableCell)({
  textAlign: "center",
  verticalAlign: "middle",
});

type tableProps = {
  token: string;
};

function UserInventoryTable({ token }: tableProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const client_id = "coforge";
      try {
        const res = await getAssessment(client_id, token);
        console.log(res, "worked");
        if (res?.result) {
          setAssessments(res.result); // Assume res is an array of assessments
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
          {assessments && assessments.length > 0 && (
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>
                  <span>
                    Status <br /> (CYRAPID AI)
                  </span>
                </TableCell>
                <TableCell>
                  <span>
                    Status <br /> (Human Assessor)
                  </span>
                </TableCell>
                <TableCell>Reference Control Framework</TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {assessments && assessments.length > 0 ? (
              assessments.map((assessment: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    {assessment.assessment_name.toUpperCase()}
                  </TableCell>
                  <TableCell style={{maxWidth: '400px' ,whiteSpace: 'pre-wrap' }}>{assessment.descriptions}</TableCell>
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
                        maxWidth: "150px",
                      }}
                    >
                      {assessment.status === "completed"
                        ? "Completed"
                        : assessment.status === "finished"
                          ? "Completed"
                          : assessment.status.charAt(0).toUpperCase() +
                            assessment.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        backgroundColor:
                          assessment.status !== "finished"
                            ? "#f87171"
                            : "#34d399",
                        borderRadius: "8px",
                        color: "white",
                        padding: "4px 8px",
                        display: "inline-block",
                        maxWidth: "150px",
                      }}
                    >
                      {assessment.status === "finished"
                        ? "Completed"
                        : "Pending"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      className="flex w-full items-center justify-center rounded-lg px-8 py-4 text-center text-xs font-bold text-white hover:bg-blue-700"
                      style={{
                        backgroundColor:
                          assessment.status !== "completed" &&
                          assessment.status !== "finished"
                            ? "#4285f4"
                            : "#808080",
                      }}
                      onClick={() => {
                        localStorage.setItem(
                          "assessment_name",
                          assessment.assessment_name,
                        );
                        navigate(`/compliance-assessment/new`);
                      }}
                    >
                      ISO 27001
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
      <div className="absolute bottom-20 right-10">
        <button
          className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-8 py-4 text-center font-bold text-white hover:bg-blue-700"
          onClick={() => {
            navigate("/create-assessment");
          }}
        >
          Setup Assessment &nbsp;
          <AddIcon />
        </button>
      </div>
    </div>
  );
}
export default UserInventoryTable;
