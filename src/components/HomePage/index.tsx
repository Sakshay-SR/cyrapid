import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAssessment } from "api/dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import SigmaredLogo from "../../assets/company-logo.png";
import AddIcon from "@mui/icons-material/Add";

export default function HomePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { logout, user } = useAuth0();
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const client_id = localStorage.getItem("client_id");
      const res = await getAssessment(client_id, token);
      console.log(res, "worked");
      setAssessments(res?.result); // Assume res is an array of assessments
    };
    fetchData();
  }, []);

  return (
    <div className="flex size-full items-center justify-center bg-[#F5F6FA]">
      {/* HEADER */}
      <div className="h-20 w-full flex items-center justify-center absolute z-10 top-0 bg-white">
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
      <div className="flex shadow-2xl h-auto w-3/4 flex-col items-center justify-center gap-4 rounded-lg bg-white p-10 font-bold">
        <div className="text-2xl mb-4">Your Assessments</div>
        <div className="grid grid-cols-3 gap-4 w-full">
          {assessments.length > 0 ? (
            assessments.map((assessment, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center justify-center rounded-lg bg-gray-100 p-4"
              >
                <div className="absolute right-0 top-2 rounded-full bg-green-500 px-3 py-1 text-xs text-white">
                  {assessment.status}
                </div>
                <div className="text-lg font-semibold">
                  {assessment.assessment_name.toUpperCase()}
                </div>
                <div className="text-sm">{assessment.descriptions}</div>
                <button
                  className="mt-4 rounded-lg bg-blue-500 px-8 py-2 text-white hover:bg-blue-700 text-s"
                  onClick={() => navigate(`/compliance-assessment/new`)}
                >
                  CyberRisk & Compliance Assessment
                </button>
              </div>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
      {/* SETUP ASSESSMENT */}
      <div className="absolute bottom-20 right-10">
        <button
          className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-8 py-4 text-center font-bold text-white hover:bg-blue-700"
          onClick={() => {
            navigate("/create-project");
          }}
        >
          Setup Assessment &nbsp;
          <AddIcon />
        </button>
      </div>
    </div>
  );
}
