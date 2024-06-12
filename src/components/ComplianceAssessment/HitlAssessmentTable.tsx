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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
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
  getHITLSaveContinue,
  updateHITLStatus,
  getHITLTableData,
  fetchHITLAssessmentStatus,
} from "api/dashboard";
import { BarLoader, PropagateLoader, PulseLoader } from "react-spinners";
import StreamingTextInput from "components/Common/StreamingTextInput";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import EditableTextBox from "components/Common/EditableTextBox";
import autoTable from "jspdf-autotable";

type TableData = {
  [columnName: string]: { [rowIndex: number]: string };
};

type TableRowData = {
  [key: string]: string; // Column name to value mapping for each row
};

const TableColumnHeaders = styled(TableCell)(({ index }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0c1d9e",
    color: "white",
    border: "none",
    textAlign: "left",
    padding: "5px",
    textAlign: index === 0 ? "center" : "center", // Center align only the first column
    minWidth: index === 0 ? "50px" : "250px",
  },
  [`&.${tableCellClasses.body}`]: {
    padding: "5px",
    fontSize: "20px",
    textAlign: index === 0 ? "center" : "center", // Center align only the first column
    minWidth: index === 0 ? "50px" : "250px",
  },
}));
const StyledTableCell = styled(TableCell)(({ index }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#ebf2fc",
    textAlign: index === 0 ? "center" : "left", // Center align only the first column
    minWidth: index === 0 ? "50px" : "250px",
    padding: "5px",
  },
  [`&.${tableCellClasses.body}`]: {
    textAlign: index === 0 ? "center" : "left", // Center align only the first column
    minWidth: index === 0 ? "50px" : "250px",
    padding: "8px",
  },
}));

export default function HITLAssessmentTable() {
  const client = "cyberrapid";
  const [tableData, setTableData] = React.useState<TableRowData[]>([]);
  const [columns, setColumns] = React.useState<string[]>([]);
  const token = localStorage.getItem("token");
  const [domain, setDomain] = React.useState("Organizational Control");
  const { logout, user } = useAuth0();
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [tableLoading, setTableLoading] = React.useState(false);
  const contentRef = React.useRef(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [completed, setCompleted] = React.useState(false);
  const [pdfClicked, setPdfClicked] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const assessmentName = location.state?.assessmentName;
  const userId = location.state?.userId;

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    if (areCurrentPageTextFieldsFilled()) {
      setPage(newPage);
    } else {
      toast.error(
        "Please complete human comments for all comments on this page.",
      );
    }
  };

  const areCurrentPageTextFieldsFilled = () => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    for (let i = startIndex; i < endIndex; i++) {
      if (
        !tableData[i]?.["Updated Comments (If Any) by human Assessor"] ||
        !tableData[i]?.["Findings Category"]
      ) {
        return false;
      }
    }
    return true;
  };

  const areAllTextFieldsFilled = () => {
    for (let i = 0; i < tableData.length; i++) {
      if (
        !tableData[i]?.["Updated Comments (If Any) by human Assessor"] ||
        !tableData[i]?.["Findings Category"]
      ) {
        return false;
      }
    }
    return true;
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

  const HandleSubmitLater = async () => {
    setLoading(true);
    const body = {
      client_id: client,
      domain_name: domain,
      control_framework: "ISO 27001",
      assessment_name: assessmentName,
      user_id: userId,
      table: prepareDataForApi(tableData, columns),
    };
    try {
      const saveContinueResponse = await getHITLSaveContinue(body, token);
      console.log("SaveContinue responsse:", saveContinueResponse);
      toast.success("Data saved successfully!");
    } catch (error) {
      console.error("Error during API calls:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const HandleSubmitComplete = async () => {
    if (areAllTextFieldsFilled()) {
      setLoading(true);
      const body = {
        client_id: client,
        domain_name: domain,
        control_framework: "ISO 27001",
        assessment_name: assessmentName,
        user_id: userId,
        table: prepareDataForApi(tableData, columns),
      };
      try {
        const saveContinueResponse = await getHITLSaveContinue(body, token);
        console.log("SaveContinue responsse:", saveContinueResponse);
        toast.success("Data saved successfully!");

        const updateAssessmentBody = {
          status: "completed",
          client_id: client,
          domain_name: domain,
          control_framework: "ISO 27001",
          assessment_name: assessmentName,
          user_id: userId,
        };

        const updateAssessmentResponse = await updateHITLStatus(
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
      toast.error("Please complete human comments for all controls.");
      setOpenDialog(false);
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
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
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

  const handleCopyJustification = (index: number) => {
    const actualRowIndex = index + (page - 1) * rowsPerPage;
    console.log(actualRowIndex, "index");
    const updatedRows = [...tableData];
    const justification =
      updatedRows[actualRowIndex]?.["Assessor Comment (by CYRAPID AI)"] || "";
    updatedRows[actualRowIndex] = {
      ...updatedRows[actualRowIndex],
      "Updated Comments (If Any) by human Assessor": justification,
    };
    console.log(justification);
    setTableData(updatedRows);
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
    } else if (completed) {
      return val;
    } else if (
      column.toLowerCase() === "findings" ||
      column.toLowerCase().includes("recommendations for compliance")
    ) {
      return (
        <EditableTextBox
          value={val}
          disabled={completed}
          onChange={(e) => handleDataChange(index, column, e.target.value)}
        />
      );
    } else if (column.toLowerCase().includes("findings category")) {
      return (
        <FormControl fullWidth>
          <Select
            value={val}
            onChange={(e) => handleDataChange(index, column, e.target.value)}
            displayEmpty
            placeholder="Findings Category"
          >
            <MenuItem value="" disabled hidden>
              None
            </MenuItem>
            <MenuItem value="Critical">Critical</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>
      );
    } else if (column.toLowerCase().includes("(by cyrapid ai)")) {
      console.log(value);
      return (
        <TextField
          sx={{
            width: "400px",
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#000000",
              fontSize: "0.875rem",
            },
          }}
          fullWidth
          placeholder=""
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          size="small"
          disabled
          multiline
          value={val}
        />
      );
    } else if (column === "Updated Comments (If Any) by human Assessor") {
      return (
        <div style={{ height: "auto" }}>
          {!completed && (
            <Button
              sx={{
                float: "right",
                marginTop: "5px",
                padding: "2px",
                minWidth: "30px",
                fontSize: "10px",
              }}
              variant="contained"
              size="small"
              onClick={() => handleCopyJustification(index)}
              title="Copy CYRAPID AI comment here"
            >
              <ContentCopyIcon fontSize="small" />
            </Button>
          )}
          <TextField
            sx={{
              width: "400px",
              fontSize: "0.875rem",
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",
                fontSize: "0.875rem",
              },
            }}
            fullWidth
            placeholder="comment"
            variant="standard"
            inputProps={{ style: { fontSize: "0.875rem" } }}
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            multiline
            value={val}
            disabled={completed}
            onChange={(e) => handleDataChange(index, column, e.target.value)}
          />
        </div>
      );
    }
    return val;
  };

  // const HandleDomainChange = async (e) => {
  //   const dom = e.target.value;
  //   setTableLoading(true);
  //   setChecked(false);
  //   setCompleted(false);
  //   try {
  //     // const client_id = client;
  //     const body = {
  //       client_id: client,
  //       domain_name: domain,
  //       control_framework: "ISO 27001",
  //       assessment_name: assessment_name,
  //     };
  //     const result = await fetchAssessmentStatus(body, token);
  //     const stat = result?.result[0];
  //     const st = stat?.user_status[`${dom}`];
  //     await handleTableAPIs(st, dom);
  //     setDomain(dom);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   contentRef.current.scrollIntoView({ behavior: "smooth" });
  // };

  React.useEffect(() => {
    const initializeData = async () => {
      setTableLoading(true);
      setCompleted(false);
      const body = {
        client_id: client,
        domain_name: domain,
        control_framework: "ISO 27001",
        assessment_name: assessmentName,
        user_id: userId,
      };
      const result = await fetchHITLAssessmentStatus(body, token);
      const status = result?.result[0].hitl_status[`${domain}`];
      const response = await getHITLTableData(body, token);
      const finalTable: TableData = response?.result;
      const cols = Object.keys(finalTable);
      const newCols = cols.filter((item) => {
        if (
          item !== "Domain" &&
          item !== "Subdomain" &&
          item !== "Policy or Process Document Name (PDF)"
        ) {
          return item;
        }
      });
      setPage(1);
      setColumns(newCols);
      setTableData(transformApiResponse(finalTable));
      setTableLoading(false);
      setChecked(true);
      if (status === 2) setCompleted(true);
      console.log("API Response finished");
    };

    initializeData();
  }, [domain]);

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
                  if (!completed) {
                    handleOpenDialog();
                  } else {
                    navigate("/");
                  }
                }}
              />
            </div>
            Cyber Risk Assessment
          </div>
          <div className="flex gap-4">
            <div className="flex w-full flex-col items-end justify-between">
              <div className="font-semibold">{user?.nickname}</div>
            </div>
            <button
              title="logout"
              // className=" mt-6 flex items-center justify-center rounded-lg bg-blue-500 p-4 text-center font-bold text-white hover:bg-blue-700"
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

      <div className="mt-28 flex w-[90%] flex-col items-start justify-center  rounded-xl bg-white px-4 py-6">
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
              Save for later
            </Button>
          </DialogActions>
        </Dialog>
        <div className="flex w-full flex-col items-start justify-center gap-4 rounded-xl bg-white py-6">
          <Box>Domain :</Box>
          <FormControl fullWidth>
            <InputLabel id="label1">Choose your Domain</InputLabel>
            <Select
              labelId="label1"
              id="demo-simple-select-standard"
              label="Choose your Domain"
              defaultValue={"Organizational Control"}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            >
              <MenuItem value={"Organizational Control"}>
                Organizational Controls
              </MenuItem>
              <MenuItem value={"People Control"}>People Controls</MenuItem>
              <MenuItem value={"Physical Control"}>Physical Controls</MenuItem>
              <MenuItem value={"Technological Control"}>
                Technological Controls
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        {/* CyRapid Buttons  */}
        <div className="mt-10 flex w-full justify-end items-center gap-4">
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
              onClick={() => setPdfClicked(!pdfClicked)}
              variant="contained"
              disabled={(!checked || loading || tableLoading) && !completed}
            >
              <DownloadIcon />
              Save as Pdf
            </Button>
          </div>
        </div>
        {pdfClicked && (
          <div className="flex w-full justify-end items-center gap-4">
            <Button
              sx={{ mb: 2, backgroundColor: "#004ab9" }}
              onClick={handlePrint}
              variant="contained"
            >
              <DownloadIcon />
              Save Assessment Worksheet
            </Button>
            <Button
              sx={{ mb: 2, backgroundColor: "#004ab9" }}
              onClick={handlePrint}
              variant="contained"
              disabled
            >
              <DownloadIcon />
              Save Assessment Report
            </Button>
          </div>
        )}

        <div className=" flex w-full items-center justify-between rounded-t-md bg-[#004ab9] p-4">
          <div className="  text-xl font-bold text-white">
            Cyber Risk Assessment Form
          </div>
        </div>
        {!tableLoading ? (
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer
              component={Paper}
              ref={contentRef}
              sx={{
                borderRadius: "0",
                position: "relative",
                maxHeight: "calc(100vh - 100px)",
              }}
            >
              <Table>
                <TableHead
                  sx={{
                    backgroundColor: "#333",
                    color: "#fff",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <TableRow
                    sx={{
                      whiteSpace: "nowrap",
                      fontSize: "20px",
                      fontWeight: "600",
                      padding: "1.5rem",
                      borderRadius: "0",
                    }}
                  >
                    {columns.map((column, colIndex) => (
                      <TableColumnHeaders key={column} index={colIndex}>
                        {column}
                      </TableColumnHeaders>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ overflowY: "auto" }}>
                  {tableData
                    .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={index}>
                        {columns.map((column, colIndex) => (
                          <StyledTableCell
                            sx={{}}
                            key={`${index}-${column}`}
                            index={colIndex}
                          >
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
      </div>
    </div>
  );
}
