import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  styled,
} from '@mui/material';

import { getPreAssesReport } from 'api/dashboard';
import { PropagateLoader } from 'react-spinners';

type GetPreAssesReportType = {
  'Assessee Comments': any;
  'Assessor Comments': any;
  'Compliance Category': any;
  'Control Name': any;
  'Control Number': any;
  'Control Question': any;
  Findings: any;
  'Findings Category': any;
  Recommendations: any;
  Remarks: any;
};

const TableColumnHeaders = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#0c1d9e',
    color: 'white',
    border: 'none',
    textAlign: 'center',
  },
  [`&.${tableCellClasses.body}`]: {
    padding: '1.5rem',
    fontSize: '20px',
  },
}));
const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#ebf2fc',
    textAlign: 'center',
    minWidth: '200px',
  },
  [`&.${tableCellClasses.body}`]: {
    minWidth: '200px',
  },
}));

export default function AssessmentTable() {
  const [tableData, setTableData] =
    React.useState<GetPreAssesReportType | null>(null);
  type ItemType = {
    id: string;
    [key: string]: string;
  };
  const [newState, setNewState] = React.useState<ItemType[]>([]);
  const [checked, setChecked] = React.useState(false);
  React.useEffect(() => {
    async function fetchData() {
      const client_id = localStorage.getItem('client_id');
      const user_id = localStorage.getItem('user_id');
      const res: GetPreAssesReportType = await getPreAssesReport(
        client_id,
        user_id,
      );
      console.log(res);
      setTableData(res);
    }

    fetchData();
  }, []);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (checked) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [checked]);
  const numbers = Array.from({ length: 30 }, (_, index) => index);
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center   bg-[#f8f9fd]">
      <div className="mb-10 rounded-2xl bg-white p-6 text-xl font-semibold">
        Cyber Risk Assessment
      </div>
      <div className="flex w-[3/4] items-center justify-center gap-20">
        <FormControl fullWidth>
          <InputLabel id="label1">Select Domain</InputLabel>
          <Select
            labelId="label1"
            id="demo-simple-select-standard"
            label="Organizational Controls"
            defaultValue={'Organizational Controls'}
          >
            <MenuItem value={'Organizational Controls'}>
              Organizational Controls
            </MenuItem>
            <MenuItem value={'People Controls'}>People Controls</MenuItem>
            <MenuItem value={'Physical Controls'}>Physical Controls</MenuItem>
            <MenuItem value={'Technological controls'}>
              Technological controls
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="flex w-[90%] items-end justify-end ">
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => {
                  setChecked(e.target.checked);
                  if (e.target.checked) setLoading(true);
                }}
              />
            }
            label="Cyrapid Ai Agent"
            sx={{
              padding: '8px',
              borderRadius: '20px',
              backgroundColor: '#f0f3fb',
              color: '#6b77f0',
            }}
          />
        </FormGroup>
      </div>
      <TableContainer
        component={Paper}
        sx={{ width: '90%', overflowX: 'auto' }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: '#004ab9' }}>
            <TableRow>
              <TableCell
                sx={{
                  color: '#fff',
                  fontSize: '20px',
                  fontWeight: '600',
                  padding: '1.5rem',
                  width: '100%',
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
                whiteSpace: 'nowrap',
                color: '#fff',
                fontSize: '20px',
                fontWeight: '600',
                padding: '1.5rem',
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
                    {tableData?.['Control Number'][number.toString()]}
                  </StyledTableCell>
                  <StyledTableCell>
                    {tableData?.['Control Name'][number.toString()]}
                  </StyledTableCell>
                  <StyledTableCell>
                    {tableData?.['Control Question'][number.toString()]}
                  </StyledTableCell>

                  <StyledTableCell>
                    <TextField
                      sx={{ width: '400px' }}
                      type="text"
                      value={
                        tableData?.['Assessee Comments'][number.toString()]
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
                      <TextField
                        sx={{ width: '400px' }}
                        type="text"
                        value={
                          checked && !loading
                            ? tableData?.['Assessor Comments'][
                                number.toString()
                              ]
                            : ''
                        }
                        placeholder="Comment"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        multiline
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
                      sx={{ width: '400px' }}
                      label="Findings"
                      placeholder="Findings"
                      variant="standard"
                      value={tableData?.['Findings'][number.toString()]}
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
                      sx={{ width: '400px' }}
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
    </div>
  );
}
