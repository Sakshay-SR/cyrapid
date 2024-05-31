import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAssessment } from "api/dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import SigmaredLogo from "../../assets/company-logo.png";
import AddIcon from "@mui/icons-material/Add";
import Background1 from "../../assets/background2.png";
import { Table, TableBody, TableRow, TableHead } from "@mui/material";
import { styled, TableCell as MuiTableCell } from "@mui/material";

// Styled TableCell with content centered
const TableCell = styled(MuiTableCell)({
  textAlign: "center",
  verticalAlign: "middle",
});

export default function HomePage() {
  const navigate = useNavigate();
  const token = useState(localStorage.getItem("token"));
  const { logout, user } = useAuth0();
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Retrieve token here within fetchData
      console.log(token);
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
    };

    const handleTokenUpdate = () => {
      console.log("Token updated event triggered");
      fetchData();
    };

    window.addEventListener("token-updated", handleTokenUpdate);

    // Optional: Fetch data on initial load if token exists already
    if (localStorage.getItem("token")) {
      fetchData();
    }

    return () => {
      window.removeEventListener("token-updated", handleTokenUpdate);
    };
  }, []);
  return (
    <div
      style={{
        backgroundImage: `url(${Background1})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="flex size-full items-center justify-center bg-[#f5f6fa]"
    >
      {/* HEADER */}
      <div className="absolute top-0 z-10 flex h-20 w-full items-center justify-center bg-white">
        <div className="flex w-[90%] items-center justify-between">
          <div
            className="cursor-pointer rounded-2xl text-2xl font-semibold"
            onClick={() => {
              navigate("/");
            }}
            title="Home"
          >
            <img src={SigmaredLogo} width="150" alt="Logo" />
          </div>
          <div className="flex gap-4">
            <div className="flex w-full flex-col items-end justify-between">
              <div className="text-sm font-semibold">Hello,</div>
              <div className="text-sm font-semibold">{user?.name}</div>
            </div>
            <button
              title="logout"
              onClick={() => {
                localStorage.removeItem("token");
                logout();
              }}
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </div>
      {/* ASSESSMENT DISPLAY */}
      {/* ASSESSMENT DISPLAY */}
      <div className="flex size-auto flex-col items-center justify-center gap-4 rounded-lg bg-white p-10 font-bold shadow-2xl">
        <div className="mb-4 text-2xl">Your Assessments</div>
        <Table>
          {assessments && assessments.length > 0 && (
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
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
                  <TableCell>{assessment.descriptions}</TableCell>
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
                      }}
                    >
                      {assessment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-8 py-4 text-center text-xs font-bold text-white hover:bg-blue-700"
                      onClick={() => {
                        localStorage.setItem(
                          "assessment_name",
                          assessment.assessment_name,
                        );
                        navigate(`/compliance-assessment/new`);
                      }}
                    >
                      CyberRisk and Compliance Assessment
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
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
