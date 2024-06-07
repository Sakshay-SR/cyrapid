import React, { useState } from "react";
import DotLoader from "react-spinners/DotLoader";
import { useNavigate } from "react-router-dom";
import { createAssessment } from "api/dashboard";
import { useAuth0 } from "@auth0/auth0-react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LogoutIcon from "@mui/icons-material/Logout";
import Background1 from "../../assets/background2.png";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { FormControl, Select, InputLabel, MenuItem, Box } from "@mui/material";

export default function CreateProject() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [policyFiles, setPolicyFiles] = useState<File[]>([]);
  const [responseFile, setResponseFile] = useState<File | undefined>();
  const [showTable, setShowTable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [projectName, setProjectName] = useState("");
  const [certification, setCertification] = React.useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth0();

  const handlePolicyFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPolicyFiles((prev) => [...prev, ...files]);
    setErrorMessage("");
  };

  const handleResponseFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResponseFile(e.target.files[0]);
    }
    setErrorMessage("");
  };

  const handleUpload = () => {
    if (projectName.trim() === "") {
      toast.error(`Project name is required.`);
      return;
    }

    // Check if files are uploaded
    if (policyFiles.length === 0 || !responseFile) {
      toast.error(`All files must be uploaded.`);
      return;
    }

    if (certification === "") {
      toast.error(`Please select the certification.`);
      return;
    }
    setShowTable(true); // Toggle table display on submit
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const formData = new FormData();
    policyFiles.forEach((file) => {
      formData.append("policy_documents", file, file.name);
    });

    // Append response document
    formData.append("response_document", responseFile, responseFile.name);

    try {
      const res = await createAssessment(
        formData,
        token,
        projectName,
        projectDescription,
        certification,
      );
      console.log(res);
      navigate("/"); // Navigate on successful submission
    } catch (error) {
      console.error("Failed to create assessment:", error);
      setErrorMessage("Failed to submit the assessment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFile = (index: number) => {
    // Implement a function to handle updating individual files
    // This could involve triggering a hidden file input or other UI behavior
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/pdf";
    fileInput.onchange = (e) => {
      const input = e.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const newFile = input.files[0];
        setPolicyFiles((prev) =>
          prev.map((f, i) => (i === index ? newFile : f)),
        );
      }
    };
    fileInput.click();
    setErrorMessage("");
  };

  const handleResponseUpdateFile = () => {
    // Implement a function to handle updating individual files
    // This could involve triggering a hidden file input or other UI behavior
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";
    fileInput.onchange = (e) => {
      const input = e.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const newFile = input.files[0];
        setResponseFile(newFile);
      }
    };
    fileInput.click();
    setErrorMessage("");
  };

  const handleRemoveFile = (index: number) => {
    if (policyFiles.length > 1) {
      setPolicyFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setErrorMessage("At least one file is required.");
    }
  };

  return (
    <div
      className="flex size-full items-center justify-center"
      style={{
        backgroundImage: `url(${Background1})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* HEADER */}
      <div className="mb-10 absolute top-0 flex w-full items-center  justify-center bg-white">
        <div className="flex w-[90%] items-center justify-between">
          <div className=" cursor-pointer rounded-2xl  py-6 text-xl font-semibold flex items-center gap-2">
            <div title="Back">
              <ArrowBackIosIcon
                onClick={() => {
                  navigate("/");
                }}
              />
            </div>
            Setup Assessment
          </div>
          <button
            title="logout"
            // className=" mt-6 flex items-center justify-center rounded-lg bg-blue-500 p-4 text-center font-bold text-white hover:bg-blue-700"
            onClick={() => {
              logout();
            }}
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
      <div className="w-full max-w-3xl mt-28 mb-10 shadow-2xl rounded-lg bg-white p-8 shadow-md">
        {!showTable ? (
          <div className="w-full">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-700">
                Assessment Name
              </h3>
              <input
                type="text"
                placeholder="Enter assessment name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full border-2 p-2 rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Assessment Description
              </h3>

              <textarea
                placeholder="Enter assessment description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full border-2 p-2 rounded-lg"
                rows={2}
              />
            </div>
            <div className="flex w-full flex-col items-start justify-center">
              <Box>
                <h3 className="text-lg font-semibold text-gray-700">
                  Control Framework
                </h3>
              </Box>
              <FormControl fullWidth>
                <InputLabel id="label1">Choose your Option</InputLabel>
                <Select
                  labelId="label1"
                  id="demo-simple-select-standard"
                  label={"Control Framework"}
                  value={certification}
                  onChange={(e) => setCertification(e.target.value)}
                >
                  <MenuItem value={"ISO 27001"}>ISO 27001</MenuItem>
                  <MenuItem value={"NIS2"} disabled>
                    NIS2
                  </MenuItem>
                  <MenuItem value={"CCPA"} disabled>
                    CCPA
                  </MenuItem>
                  <MenuItem value={"GDPR"} disabled>
                    GDPR
                  </MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="my-5 grid grid-cols-2 gap-8">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-700">
                  Policy and Process Documents
                </h3>
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={handlePolicyFileUpload}
                  className="mb-2 w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
                />
                {/* <div className="flex h-20 w-full items-center justify-center overflow-y-auto border-2 border-dashed border-gray-500 p-3">
                  {policyFiles.length > 0 ? (
                    <ul className="w-full">
                      {policyFiles.map((file, index) => (
                        <li key={index} className="truncate pr-2">
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No File Chosen</span>
                  )}
                </div> */}
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-700">
                  Assessment Workbook
                </h3>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleResponseFileUpload}
                  className="mb-2 w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
                />
                {/* <div className="flex h-20 w-full items-center justify-center border-2 border-dashed border-gray-300 text-gray-400">
                  {responseFile ? responseFile.name : 'No File Chosen'}
                </div> */}
              </div>
            </div>

            {/* <div className="mb-5 flex flex-col items-center justify-start  gap-2">
              <div className="w-full text-sm font-bold">
                Upload Policy/Process Document
              </div>

              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={handlePolicyFileUpload}
                // eslint-disable-next-line tailwindcss/no-custom-classname
                className="text-grey-500 w-full text-sm
            file:mr-5 file:rounded-full file:border-0
            file:bg-blue-50 file:px-6
            file:py-2 file:text-sm
            file:font-medium file:text-blue-700
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700"
              />
              <div>
                {policyFiles.length
                  ? `${policyFiles.length} files uploaded`
                  : null}
              </div>
            </div>
            <div className="mb-10 flex flex-col items-center  justify-start gap-2">
              <div className="w-full text-sm font-bold">
                Upload Response Document
              </div>

              <input
                type="file"
                accept=".csv"
                onChange={handleResponseFileUpload}
                // eslint-disable-next-line tailwindcss/no-custom-classname
                className="text-grey-500 w-full text-sm
            file:mr-5 file:rounded-full file:border-0
            file:bg-blue-50 file:px-6
            file:py-2 file:text-sm
            file:font-medium file:text-blue-700
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          "
              />
            </div> */}

            <button
              onClick={handleUpload}
              className="mx-auto mt-6 flex w-full items-center justify-center rounded-lg bg-blue-500 px-8 py-4 text-center font-bold text-white hover:bg-blue-700"
            >
              Upload Documents
            </button>
          </div>
        ) : (
          <div className="mt-5 w-full">
            <button
              onClick={() => setShowTable(false)}
              className="flex items-center justify-center rounded-lg bg-gray-500 p-2 text-center font-bold text-white hover:bg-gray-700"
            >
              Back
            </button>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="border-b-2 p-4 text-lg">
                    Policy Documents Name
                  </th>
                  <th className="border-b-2 p-4 text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {policyFiles.map((file, index) => (
                  <tr key={index}>
                    <td className="p-4">{file.name}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleUpdateFile(index)}
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="ml-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {errorMessage && (
                <div className="mt-1 text-center text-red-500">
                  {errorMessage}
                </div>
              )}
              <thead>
                <tr>
                  <th className="border-b-2 p-4 text-lg">
                    Assessment Workbook Name
                  </th>
                  <th className="border-b-2 p-4 text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4">{responseFile && responseFile.name}</td>
                  <td className="p-4">
                    <button
                      onClick={handleResponseUpdateFile}
                      className="mr-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="mx-auto mt-6 flex w-full items-center justify-center rounded-lg bg-blue-500 px-8 py-4 text-center font-bold text-white hover:bg-blue-700"
            >
              {isLoading ? <DotLoader color="#36d7b7" size={20} /> : "Submit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
