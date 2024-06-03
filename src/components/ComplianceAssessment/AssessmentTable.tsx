/* eslint-disable @typescript-eslint/no-explicit-any */
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
import Background1 from "../../assets/background2.png";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
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
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Pagination from "@mui/material/Pagination";
import {
  getPostAssesReport,
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
import autoTable from "jspdf-autotable";
// type GetPreAssesReportType = {
//   "Assessee Comments": any;
//   "Assessor Comment (by CYRAPID AI)": any;
//   "Compliance Category": any;
//   "Control Name": any;
//   "Control Number": any;
//   "Control Question": any;
//   Domain: any;
//   Findings: any;
//   "Findings Category": any;
//   "Justification For Assessor Comment (by CYRAPID AI)": any;
//   "Policy or Process Document Name (PDF)": any;
//   "Recommendations For Compliance": any;
//   Remarks: any;
//   Subdomain: any;
//   "Updated Comments (If Any) by human Assessor": any;
// };

type TableData = {
  [columnName: string]: { [rowIndex: number]: string };
};

type TableRowData = {
  [key: string]: string; // Column name to value mapping for each row
};

const TableColumnHeaders = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0c1d9e",
    color: "white",
    border: "none",
    textAlign: "left",
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
  const [tableData, setTableData] = React.useState<TableRowData[]>([]);
  const [columns, setColumns] = React.useState<string[]>([]);
  const token = localStorage.getItem("token");
  const [certification, setCertification] = React.useState("");
  const [domain, setDomain] = React.useState("Organizational Controls");
  const { logout } = useAuth0();
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [tableLoading, setTableLoading] = React.useState(false);
  const contentRef = React.useRef(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const assessment_name =
    localStorage.getItem("assessment_name") || "sample assesment";
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [completed, setCompleted] = React.useState(false);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  // Calculate the first and last row index for the current page
  const prepareDataForApi = (
    rows: TableRowData[],
    columns: string[],
  ): TableData => {
    const apiData: TableData = {};

    // Initialize each column in the result with an empty object
    columns.forEach((column) => {
      apiData[column] = {};
    });

    // Populate each column object with row data
    rows.forEach((row, index) => {
      columns.forEach((column) => {
        apiData[column][index] = row[column];
      });
    });

    return apiData;
  };

  const HandleSubmitComplete = async () => {
    if (token) {
      setLoading(true);
      const body = {
        client_id: "coforge",
        assessment_name: assessment_name,
        cyber_risk_table: prepareDataForApi(tableData, columns),
      };
      try {
        const saveContinueResponse = await getSaveContinue(body, token);
        console.log("SaveContinue responsse:", saveContinueResponse);
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
    if (token) {
      setLoading(true);
      const body = {
        client_id: "coforge",
        assessment_name: localStorage.getItem("assessment_name"),
        cyber_risk_table: prepareDataForApi(tableData, columns),
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
      } catch (error: any) {
        setLoading(false);
        console.error("Error during API calls:", error);
        toast.error(`Error: ${error.message}`);
      }
    } else {
      console.log("No token and data");
    }
  };

  const handlePrint = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    // Assuming `columns` is an array of strings with column names
    // and `tableData` is an array of objects where each object corresponds to a row
    const columnHeaders = columns.map((colName) => ({
      title: colName, // Use the column names as titles
      dataKey: colName,
    }));

    // Transform tableData to match the dataKey from columnHeaders
    const data = tableData.map((row) => {
      let rowData = {};
      columnHeaders.forEach((header) => {
        rowData[header.dataKey] = row[header.dataKey];
      });
      return rowData;
    });

    autoTable(doc, {
      columns: columnHeaders,
      body: data,
      styles: { fontSize: 8, cellPadding: 2, overflow: "linebreak" },
      columnStyles: columnHeaders.reduce(
        (acc, col) => ({
          ...acc,
          [col.dataKey]: { cellWidth: "auto" }, // Automatic width for each column
        }),
        {},
      ),
      didDrawCell: (data) => {
        console.log("Drawn", data.column.index);
      },
    });

    doc.save("assessment_table.pdf");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate("/");
  };

  const handleSaveForLater = async () => {
    await HandleSubmitLater();
    navigate("/");
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setCertification(event.target.value);
  };

  const HandleCyRapidButton = async () => {
    if (tableData && tableData.length) {
      setLoading(true);
      setTableLoading(true);
      try {
        const res = await getPostAssesReport(token);
        const cols = Object.keys(res[0]);
        const newCols = cols.filter((item) => {
          if (
            item !== "Domain" &&
            item !== "Subdomain" &&
            item !== "Policy or Process Document Name (PDF)"
          ) {
            return item;
          }
        });
        setColumns(newCols);
        setTableData(res);
        setTableLoading(false);
        setLoading(false);
        setChecked(true);
        console.log("Status is pending. Perform normal operations.");
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  const handleDataChange = (
    displayedRowIndex: number,
    column: string,
    newValue: string,
  ) => {
    const actualRowIndex = displayedRowIndex + (page - 1) * rowsPerPage; // Adjusted index based on pagination
    console.log(actualRowIndex, "index");
    const updatedRows = [...tableData]; // Clone the current state to a new array
    updatedRows[actualRowIndex] = {
      ...updatedRows[actualRowIndex],
      [column]: newValue,
    }; // Update the specific cell
    console.log(updatedRows, "rows");
    setTableData(updatedRows); // Set the new state
  };

  const transformApiResponse = (data: TableData) => {
    if (data) {
      const cols = Object.keys(data);
      const rowIndices = Object.keys(data[cols[0]]);
      const rowData = rowIndices.map((index) => {
        const row: { [key: string]: string } = {};
        cols.forEach((col) => {
          row[col] = data[col][index];
        });
        return row;
      });
      console.log(rowData);
      return rowData;
    }
  };

  const renderCell = (value: string, column: string, index: number) => {
    const actualRowIndex = index + (page - 1) * rowsPerPage;
    const val = tableData[actualRowIndex][column] ?? "";
    const compliance = {
      yes: "Compliant",
      no: "Non-compliant",
      partially: "Partially Compliant",
    };
    if (column.toLowerCase().includes("compliance category")) {
      return compliance[value];
      // } else if (column.toLowerCase().includes("findings category")) {
      //   return (
      //     <FormControl fullWidth>
      //       <Select
      //         value={val}
      //         onChange={(e) => handleDataChange(index, column, e.target.value)}
      //         displayEmpty
      //       >
      //         <MenuItem value="Critical">Critical</MenuItem>
      //         <MenuItem value="High">High</MenuItem>
      //         <MenuItem value="Medium">Medium</MenuItem>
      //         <MenuItem value="Low">Low</MenuItem>
      //       </Select>
      //     </FormControl>
      //   );
    } else if (column.toLowerCase().includes("(by cyrapid ai)")) {
      return (
        <StreamingTextInput
          placeholder="Click CYRAPID AI Button to get comments"
          speed={10}
          width="400px"
          targetText={checked && !loading ? (val !== null ? val : "") : ""}
        />
      );
    } else if (column === "Updated Comments (If Any) by human Assessor") {
      return (
        <TextField
          sx={{ width: "400px" }}
          fullWidth
          placeholder="comment"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          size="small"
          disabled={completed}
          value={val}
          onChange={(e) => handleDataChange(index, column, e.target.value)}
        />
      );
    }
    return val;
  };

  React.useEffect(() => {
    const initializeData = async () => {
      setTableLoading(true);
      try {
        const client_id = "coforge";
        const result = await fetchAssessmentStatus(
          client_id,
          assessment_name,
          token,
        );
        const status = result?.result[0].status;
        if (status === "completed") {
          const res = await getPostAssesReport(token);
          const cols = Object.keys(res[0]);
          const newCols = cols.filter((item) => {
            if (
              item !== "Domain" &&
              item !== "Subdomain" &&
              item !== "Policy or Process Document Name (PDF)"
            ) {
              return item;
            }
          });
          setColumns(newCols);
          setTableData(res);
          setTableLoading(false);
          setChecked(true);
          setCompleted(true);
          setCertification("ISO 27001");
        } else {
          const res = await getPreAssesReport(token);
          const cols = Object.keys(res[0]);
          const newCols = cols.filter((item) => {
            if (
              item !== "Domain" &&
              item !== "Subdomain" &&
              item !== "Policy or Process Document Name (PDF)"
            ) {
              return item;
            }
          });
          setColumns(newCols);
          setTableData(res);
          setTableLoading(false);
          console.log("Status is pending. Perform normal operations.");
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    initializeData();
  }, []);

  // React.useEffect(() => {
  //   const initializeData = async () => {
  //     setTableLoading(true);
  //     const client_id = "coforge";
  //     const result = await fetchAssessmentStatus(
  //       client_id,
  //       assessment_name,
  //       token,
  //     );
  //     const status = result?.result[0].status;
  //     console.log(status);
  //     if (status === "created") {
  //       const res = await getPostAssesReport(token);
  //       const cols = Object.keys(res[0]);
  //       const newCols = cols.filter((item) => {
  //         if (
  //           item !== "Domain" &&
  //           item !== "Subdomain" &&
  //           item !== "Policy or Process Document Name (PDF)"
  //         ) {
  //           return item;
  //         }
  //       });
  //       setColumns(newCols);
  //       setTableData(res);
  //       setTableLoading(false);
  //       console.log("Status is pending. Perform normal operations.");
  //     } else {
  //       const response = await fetchUpdatedTableData(
  //         client_id,
  //         assessment_name,
  //         token,
  //       );
  //       const finalTable: TableData = response?.result[0]["cyber_risk_table"];
  //       const cols = Object.keys(finalTable);
  //       const newCols = cols.filter((item) => {
  //         if (
  //           item !== "Domain" &&
  //           item !== "Subdomain" &&
  //           item !== "Policy or Process Document Name (PDF)"
  //         ) {
  //           return item;
  //         }
  //       });
  //       setColumns(newCols);
  //       setTableData(transformApiResponse(finalTable));
  //       setTableLoading(false);
  //       console.log("API Response finished");
  //     }
  //   };

  //   initializeData();
  // }, []);

  // React.useEffect(() => {
  //   if (checked) {
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 5000);
  //   }
  // }, [checked]);

  const navigate = useNavigate();

  return (
    <div
      className="flex  min-h-full w-full  flex-col items-center justify-start"
      style={{
        backgroundImage: `${tableLoading ? `url(${Background1})` : undefined}`,
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
      <div className="absolute top-0 mb-10 flex w-full items-center  justify-center bg-white">
        <div className="flex w-[90%] items-center justify-between">
          <div className=" flex cursor-pointer  items-center gap-2 rounded-2xl py-6 text-xl font-semibold">
            <div title="Back">
              <ArrowBackIosIcon
                onClick={() => {
                  if (certification === "ISO 27001" && !completed) {
                    handleOpenDialog();
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

      <div className="mt-28 flex w-[90%] flex-col items-start justify-center  rounded-xl bg-white px-4 py-6">
        <div className="flex w-full flex-col items-start justify-center gap-4">
          <Box>Control Framework :</Box>
          <FormControl fullWidth>
            <InputLabel id="label1">Choose your Option</InputLabel>
            <Select
              labelId="label1"
              id="demo-simple-select-standard"
              label={"Control Framework"}
              value={certification}
              onChange={handleChange}
              disabled={completed}
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
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Save Changes?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you want to save the changes you made before leaving?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Ignore</Button>
            <Button onClick={handleSaveForLater} autoFocus>
              Save for Later
            </Button>
          </DialogActions>
        </Dialog>
        {certification === "ISO 27001" && (
          <>
            <div className="flex w-full flex-col items-start justify-center gap-4 rounded-xl bg-white py-6">
              <Box>Domain :</Box>
              <FormControl fullWidth>
                <InputLabel id="label1">Choose your Domain</InputLabel>
                <Select
                  labelId="label1"
                  id="demo-simple-select-standard"
                  label="Organizational Controls"
                  defaultValue={"Organizational Controls"}
                  value={domain}
                  disabled={completed}
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
            <div className="mt-10 flex w-full items-center justify-end gap-4">
              <div></div>
              <div className="flex gap-4">
                <Button
                  sx={{ mb: 2, backgroundColor: "#004ab9" }}
                  onClick={HandleSubmitLater}
                  variant="contained"
                  disabled={loading || tableLoading || completed}
                >
                  Save For Later
                </Button>
                <Button
                  sx={{ mb: 2, backgroundColor: "#004ab9" }}
                  onClick={HandleSubmitComplete}
                  variant="contained"
                  disabled={loading || tableLoading || completed}
                >
                  Save & Complete
                </Button>
                <Button
                  sx={{ mb: 2, backgroundColor: "#004ab9" }}
                  onClick={handlePrint}
                  variant="contained"
                  disabled={(!checked || loading || tableLoading) && !completed}
                >
                  <DownloadIcon />
                  Save as Pdf
                </Button>
              </div>
            </div>
            <div className=" flex w-full items-center justify-between rounded-t-md bg-[#004ab9] p-4">
              <div className="  text-xl font-bold text-white">
                Cyber Risk Assessment Form
              </div>
              <Button
                sx={{
                  backgroundColor: "#fff",
                  py: 2,
                  color: "#004ab9",
                  fontWeight: "bold",
                  ":hover": {
                    backgroundColor: "white",
                  },
                }}
                onClick={HandleCyRapidButton}
                variant="contained"
                disabled={tableLoading || completed}
              >
                <AutoAwesomeIcon className="mr-2" /> Use CyRapid AI
              </Button>
            </div>
            {!tableLoading ? (
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer
                  component={Paper}
                  ref={contentRef}
                  sx={{ borderRadius: "0" }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow
                        sx={{
                          whiteSpace: "nowrap",
                          color: "#fff",
                          fontSize: "20px",
                          fontWeight: "600",
                          padding: "1.5rem",
                          borderRadius: "0",
                        }}
                      >
                        {columns.map((column) => (
                          <TableColumnHeaders key={column}>
                            {column}
                          </TableColumnHeaders>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData
                        .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                        .map((row, index) => (
                          <TableRow key={index}>
                            {columns.map((column) => (
                              <StyledTableCell key={`${index}-${column}`}>
                                {renderCell(row[column], column, index)}
                              </StyledTableCell>
                            ))}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Pagination
                  count={Math.ceil(tableData.length / rowsPerPage)}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                  sx={{
                    display: "flex",
                    justifyContent: "center", // Centers the pagination in its container
                    my: 2, // Adds margin top for spacing
                  }}
                />
              </Paper>
            ) : (
              <div className="mt-10 flex h-20 w-[90%] flex-col items-center justify-center">
                <PulseLoader color="#36d7b7" loading />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
