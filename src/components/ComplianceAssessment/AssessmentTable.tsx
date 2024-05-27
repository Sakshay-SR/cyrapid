import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DownloadIcon from "@mui/icons-material/Download";
import Paper from "@mui/material/Paper";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  styled,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  getPreAssesReport,
  getSaveContinue,
  updateAssessment,
  fetchUpdatedTableData,
  fetchAssessmentStatus,
} from "api/dashboard";
import { BarLoader, PropagateLoader, PulseLoader } from "react-spinners";
import StreamingTextInput from "components/Common/StreamingTextInput";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

type GetPreAssesReportType = {
  "Assessee Comments": any;
  "Assessor Comments": any;
  "Compliance Category": any;
  "Control Name": any;
  "Control Number": any;
  "Control Question": any;
  Findings: any;
  "Findings Category": any;
  Recommendations: any;
  Remarks: any;
};

const TableColumnHeaders = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0c1d9e",
    color: "white",
    border: "none",
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    padding: "1.5rem",
    fontSize: "20px",
  },
}));
const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#ebf2fc",
    textAlign: "center",
    minWidth: "200px",
  },
  [`&.${tableCellClasses.body}`]: {
    minWidth: "200px",
  },
}));

export default function AssessmentTable() {
  const [tableData, setTableData] =
    React.useState<GetPreAssesReportType | null>(null);
  type ItemType = {
    id: string;
    [key: string]: string;
  };
  // const [newState, setNewState] = React.useState<ItemType[]>([]);
  const token = localStorage.getItem("token");
  const [certification, setCertification] = React.useState("");
  const [domain, setDomain] = React.useState("");
  const { logout } = useAuth0();
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [tableLoading, setTableLoading] = React.useState(false);
  const contentRef = React.useRef(null);
  const assessment_name =
    localStorage.getItem("assessment_name") || "sample assesment";
  // function obj) {
  //   const array = [];
  //   for (let key in obj) {
  //     if (obj.hasOwnProperty(key)) {
  //       array.push(obj[key]);
  //     }
  //   }
  //   return array;
  // }

  const prepareDataForApi = () => {
    return {
      client_id: localStorage.getItem("client_id"),
      assessment_name: "sample assessment",
      cyber_risk_table: {
        control_number: tableData["Control Number"],
        control_name: tableData["Control Name"],
        control_question: tableData["Control Question"],
        assessee_comments: tableData["Assessee Comments"],
        assessor_comments: tableData["Assessor Comments"],
        compliance_category: tableData["Compliance Category"],
        findings: tableData["Findings"],
        findings_category: tableData["Findings Category"],
        recommendations: tableData["Recommendations"],
        remarks: tableData["Remarks"],
      },
    };
  };

  const handleDataChange = (index: number, field: string, value: string) => {
    setTableData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        [index]: value,
      },
    }));
  };

  const HandleSubmitComplete = async () => {
    const body = prepareDataForApi();
    if (token && body) {
      setLoading(true);
      const body = {
        client_id: "coforge",
        assessment_name: assessment_name,
        cyber_risk_table: {
          control_number: tableData?.["Control Number"],
          control_name: tableData?.["Control Name"],
          control_question: tableData?.["Control Question"],
          assessee_comments: tableData?.["Assessee Comments"],
          assessor_comments: tableData?.["Assessor Comments"],
          compliance_category: tableData?.["Compliance Category"],
          findings: tableData?.["Findings"],
          findings_category: tableData?.["Findings Category"],
          recommendations: tableData?.["Recommendations"],
          remarks: tableData?.["Remarks"],
        },
      };
      try {
        const saveContinueResponse = await getSaveContinue(body, token);
        console.log("SaveContinue response:", saveContinueResponse);
        toast.success("Data saved successfully!");

        const updateAssessmentBody = {
          status: "completed",
          assessment_name: assessment_name,
          client_id: "coforge",
        };

        const updateAssessmentResponse = await updateAssessment(
          updateAssessmentBody,
          token,
        );
        console.log("UpdateAssessment response:", updateAssessmentResponse);
        toast.success("Assessment status updated to completed.");

        // Fetch updated table data
        navigate("/");
      } catch (error) {
        setLoading(false);
        console.error("Error during API calls:", error);
        toast.error(`Error: ${error.message}`);
      }
    } else {
      console.log("No token and data");
    }
  };

  const HandleSubmitLater = async () => {
    const body = prepareDataForApi();
    if (token && body) {
      setLoading(true);
      const body = {
        client_id: localStorage.getItem("client_id"),
        assessment_name: "sample assesment",
        cyber_risk_table: {
          control_number: tableData?.["Control Number"],
          control_name: tableData?.["Control Name"],
          control_question: tableData?.["Control Question"],
          assessee_comments: tableData?.["Assessee Comments"],
          assessor_comments: tableData?.["Assessor Comments"],
          compliance_category: tableData?.["Compliance Category"],
          findings: tableData?.["Findings"],
          findings_category: tableData?.["Findings Category"],
          recommendations: tableData?.["Recommendations"],
          remarks: tableData?.["Remarks"],
        },
      };
      try {
        const saveContinueResponse = await getSaveContinue(body, token);
        console.log("SaveContinue response:", saveContinueResponse);
        toast.success("Data saved successfully!");

        const updateAssessmentBody = {
          status: "pending",
          assessment_name: assessment_name,
          client_id: "coforge",
        };

        const updateAssessmentResponse = await updateAssessment(
          updateAssessmentBody,
          token,
        );
        console.log("UpdateAssessment response:", updateAssessmentResponse);
        toast.success("Assessment status updated to Pending.");

        // Fetch updated table data
        navigate("/");
      } catch (error) {
        setLoading(false);
        console.error("Error during API calls:", error);
        toast.error(`Error: ${error.message}`);
      }
    } else {
      console.log("No token and data");
    }
  };

  const handlePrint = async () => {
    const inputData = contentRef.current;
    try {
      const canvas = await htmlToImage.toCanvas(inputData, {
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        width: inputData.scrollWidth,
        height: inputData.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let position = 0;
      while (position < imgHeight) {
        pdf.addImage(imgData, "PNG", 0, -position, pdfWidth, imgHeight);
        position += pdfHeight;
        if (position < imgHeight) {
          pdf.addPage();
        }
      }

      pdf.save("assessment_table.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setCertification(event.target.value);
  };

  function transformApiResponse(response) {
    // Map the response keys to the new keys as defined in GetPreAssesReportType
    return {
      "Assessee Comments": response.assessee_comments,
      "Assessor Comments": response.assessor_comments,
      "Compliance Category": response.compliance_category,
      "Control Name": response.control_name,
      "Control Number": response.control_number,
      "Control Question": response.control_question,
      Findings: response.findings,
      "Findings Category": response.findings_category,
      Recommendations: response.recommendations,
      Remarks: response.remarks,
    };
  }

  React.useEffect(() => {
    const initializeData = async () => {
      setTableLoading(true);
      const client_id = "coforge";
      const result = await fetchAssessmentStatus(
        client_id,
        assessment_name,
        token,
      );
      const status = result?.result[0].status;
      console.log(status);
      if (status === "created") {
        const res: GetPreAssesReportType = await getPreAssesReport(token);
        setTableData(res);
        setTableLoading(false);
        // Perform actions for pending status, possibly fetching preliminary data
        console.log("Status is pending. Perform normal operations.");
      } else {
        const response = await fetchUpdatedTableData(
          client_id,
          assessment_name,
          token,
        );
        const finalTable = transformApiResponse(
          response?.result[0]["cyber_risk_table"],
        );
        const res: GetPreAssesReportType = finalTable;
        setTableData(res);
        setTableLoading(false);
      }
    };

    initializeData();
  }, []);

  React.useEffect(() => {
    if (checked) {
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
  }, [checked]);
  const numbers = Array.from({ length: 30 }, (_, index) => index);
  const navigate = useNavigate();
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-start   bg-[#f8f9fd]">
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
      <div className="absolute top-0 mb-10 flex w-full items-center  justify-center bg-white">
        <div className="flex w-[90%] items-center justify-between">
          <div className=" flex cursor-pointer  items-center gap-2 rounded-2xl py-6 text-xl font-semibold">
            <div title="Back">
              <ArrowBackIosIcon
                onClick={() => {
                  if (certification === "ISO 27001") {
                    setCertification("");
                  } else {
                    navigate("/");
                  }
                }}
              />
            </div>
            Cyber Risk Assessment
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

      {certification === "ISO 27001" ? (
        <>
          <div className="mt-28 flex w-[90%] items-start justify-center gap-20">
            <FormControl fullWidth>
              <InputLabel id="label1">Select Domain</InputLabel>
              <Select
                labelId="label1"
                id="demo-simple-select-standard"
                label="Organizational Controls"
                defaultValue={"Organizational Controls"}
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                }}
              >
                <MenuItem value={"Organizational Controls"}>
                  Organizational Controls
                </MenuItem>
                <MenuItem value={"People Controls"}>People Controls</MenuItem>
                <MenuItem value={"Physical Controls"}>
                  Physical Controls
                </MenuItem>
                <MenuItem value={"Technological controls"}>
                  Technological controls
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* CyRapid Buttons  */}
          <div className="mt-10 flex w-[90%] items-center justify-between gap-4">
            <div className="flex gap-4">
              <Button
                sx={{ mb: 2, backgroundColor: "#004ab9" }}
                onClick={() => {
                  setChecked(!checked);
                  if (!checked) setLoading(true);
                }}
                variant="contained"
                disabled={loading}
              >
                Use CyRapid AI
              </Button>
              <Button
                sx={{ mb: 2, backgroundColor: "#004ab9" }}
                onClick={HandleSubmitLater}
                variant="contained"
                disabled={loading}
              >
                Save For Later
              </Button>
              <Button
                sx={{ mb: 2, backgroundColor: "#004ab9" }}
                onClick={HandleSubmitComplete}
                variant="contained"
                disabled={loading}
              >
                Save & Complete
              </Button>
            </div>
            <Button
              sx={{ mb: 2, backgroundColor: "#004ab9" }}
              onClick={handlePrint}
              variant="contained"
              disabled={loading}
            >
              <DownloadIcon />
              Save as Pdf
            </Button>
          </div>
          <div></div>

          <TableContainer
            component={Paper}
            sx={{ width: "90%" }}
            ref={contentRef}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ backgroundColor: "#004ab9" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontSize: "20px",
                      fontWeight: "600",
                      padding: "1.5rem",
                      width: "100%",
                    }}
                    colSpan={10}
                  >
                    Cyber Risk Assessment Form
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableHead>
                <TableRow
                  sx={{
                    whiteSpace: "nowrap",
                    color: "#fff",
                    fontSize: "20px",
                    fontWeight: "600",
                    padding: "1.5rem",
                  }}
                >
                  <TableColumnHeaders>Control Number</TableColumnHeaders>
                  <TableColumnHeaders>Control Name</TableColumnHeaders>
                  <TableColumnHeaders>Control Question</TableColumnHeaders>
                  <TableColumnHeaders>Assessee Comments </TableColumnHeaders>
                  <TableColumnHeaders>Assessor Comments</TableColumnHeaders>
                  <TableColumnHeaders>Compliance Category</TableColumnHeaders>

                  <TableColumnHeaders>Findings</TableColumnHeaders>
                  <TableColumnHeaders>Findings Category</TableColumnHeaders>
                  <TableColumnHeaders>Recommendations</TableColumnHeaders>
                  <TableColumnHeaders>Remarks</TableColumnHeaders>
                </TableRow>
              </TableHead>
              {tableData && (
                <TableBody>
                  {numbers.map((number) => (
                    <TableRow
                      key={number}
                      // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <StyledTableCell>
                        {tableData?.["Control Number"][number.toString()]}
                      </StyledTableCell>
                      <StyledTableCell>
                        {tableData?.["Control Name"][number.toString()]}
                      </StyledTableCell>
                      <StyledTableCell>
                        {tableData?.["Control Question"][number.toString()]}
                      </StyledTableCell>

                      <StyledTableCell>
                        <TextField
                          sx={{ width: "400px" }}
                          type="text"
                          value={
                            tableData?.["Assessee Comments"][number.toString()]
                          }
                          placeholder="Comment"
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          multiline
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        {loading ? (
                          <div className="flex w-[400px] items-center justify-center px-6">
                            <PropagateLoader color="#36d7b7" />
                          </div>
                        ) : (
                          // <TextField
                          //   sx={{ width: '400px' }}
                          //   type="text"
                          //   value={
                          //     checked && !loading
                          //       ? tableData?.['Assessor Comments'][
                          //           number.toString()
                          //         ]
                          //       : ''
                          //   }
                          //   placeholder="Comment"
                          //   variant="standard"
                          //   InputLabelProps={{
                          //     shrink: true,
                          //   }}
                          //   multiline
                          // />
                          <StreamingTextInput
                            placeholder="Comment"
                            speed={10}
                            width="400px"
                            targetText={
                              checked && !loading
                                ? tableData?.["Assessor Comments"][
                                    number.toString()
                                  ]
                                : ""
                            }
                          />
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        <FormControl fullWidth>
                          <InputLabel id="label1">Select Option</InputLabel>
                          <Select labelId="label1" label="Compliance">
                            <MenuItem value="100">Compliant</MenuItem>
                            <MenuItem value="50">Partially Compliant</MenuItem>
                            <MenuItem value="0">Non Compliant</MenuItem>
                          </Select>
                        </FormControl>
                      </StyledTableCell>
                      <StyledTableCell>
                        <TextField
                          sx={{ width: "400px" }}
                          label="Findings"
                          placeholder="Findings"
                          variant="standard"
                          value={tableData?.["Findings"][number.toString()]}
                          disabled
                          InputLabelProps={{
                            shrink: true,
                          }}
                          multiline
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <FormControl fullWidth>
                          <InputLabel id="label1">Select Option</InputLabel>
                          <Select labelId="label1" label="Compliance">
                            <MenuItem value="100">Critical</MenuItem>
                            <MenuItem value="75">High</MenuItem>
                            <MenuItem value="50">Medium</MenuItem>
                            <MenuItem value="25">Low</MenuItem>
                          </Select>
                        </FormControl>
                      </StyledTableCell>
                      <StyledTableCell>
                        <TextField
                          label="Recommendations"
                          value={tableData.Recommendations[number.toString()]}
                          sx={{ width: "400px" }}
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          multiline
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <TextField
                          label="Remarks"
                          disabled
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
          {tableLoading && (
            <div className="mt-10 flex h-20 w-[90%] flex-col items-center justify-center">
              <PulseLoader color="#36d7b7" loading />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mt-28 flex w-[90%] items-start justify-center gap-20">
            <FormControl fullWidth>
              <InputLabel id="label1">Select Control Framework: </InputLabel>
              <Select
                labelId="label1"
                id="demo-simple-select-standard"
                label={"Control Framework"}
                value={certification}
                onChange={handleChange}
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
        </>
      )}
    </div>
  );
}
