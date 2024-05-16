import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import StreamingTextInput from 'components/Common/StreamingTextInput';
import React from 'react';

const NewAssessmentComponent = () => {
  const [tableData, setTableData] = React.useState([
    {
      reference: 'A.5.1.1',
      controlName: 'Policies for Information Security',
      controlQuestion: 'Do Security Policies exist?',
      assessorComments: 'None',
      findings: 'None',
      criticality: 'None',
      controlCompliance: 'None',
      complianceStatus: 'NA',
    },
    {
      reference: 'A.5.1.1',
      controlName: 'Policies for Information Security',
      controlQuestion: 'Are all policies approved by management?',
      assessorComments: 'None',
      findings: 'None',
      criticality: 'None',
      controlCompliance: 'None',
      complianceStatus: 'NA',
    },
    {
      reference: 'A.5.1.1',
      controlName: 'Policies for Information Security',
      controlQuestion: 'Are policies properly communicated to employees?',
      assessorComments: 'None',
      findings: 'None',
      criticality: 'None',
      controlCompliance: 'None',
      complianceStatus: 'NA',
    },
    // Additional rows can be added following the same format
  ]);
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center   bg-[#f8f9fd]">
      <div className="rounded-2xl bg-white p-6 text-xl font-semibold">
        Compliance Assessment
      </div>
      <div className=" flex w-[3/4] items-center justify-center  ">
        <FormControl fullWidth>
          <InputLabel id="label1">Select Domain</InputLabel>
          <Select
            labelId="label1"
            id="demo-simple-select-standard"
            label="Information Security Policies"
            value={'Information Security Policies'}
          >
            <MenuItem value={'Information Security Policies'}>
              Information Security Policies
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="label2">Select Sub-domain</InputLabel>
          <Select
            labelId="label2"
            id="demo-simple-select-standard"
            label="Information Security Policies"
            value={'Information Security Policies'}
          >
            <MenuItem value={'Information Security Policies'}>
              Information Security Policies
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className=" w-[90%] overflow-x-auto ">
        <table className="w-full table-fixed bg-[#004ab9]  text-left text-sm text-gray-500 dark:text-gray-400">
          <thead>
            <tr>
              <th
                colSpan={8}
                className="w-full whitespace-nowrap bg-[#004ab9] p-6  text-lg font-bold text-white"
              >
                Compliance Assessment Form
              </th>
            </tr>
          </thead>
          <colgroup>
            <col className="w-52"></col>
            <col className="w-52"></col>
            <col className="w-52"></col>
            <col className="w-52"></col>
            <col className="w-[350px]"></col>
            <col className="w-52"></col>
            <col className="w-52"></col>
            <col className="w-52"></col>
          </colgroup>
          <thead className="whitespace-nowrap bg-[#0c1d9e] text-center text-lg  text-white ">
            <tr>
              <th scope="col" className="p-6">
                Reference
              </th>
              <th scope="col" className="p-6">
                Control
              </th>

              <th scope="col" className="p-6">
                Assessment Questions
              </th>
              <th scope="col" className="p-6">
                Control Compliance
              </th>
              <th scope="col" className=" p-6" colSpan={2}>
                Assessor Comments
              </th>

              <th scope="col" className="p-6">
                Findings
              </th>
              <th scope="col" className="p-6">
                Criticality
              </th>
              <th scope="col" className="p-6">
                Compliance Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#ebf2fc]">
            {tableData.map((row, indx) => (
              <tr
                key={indx}
                className="border-b-4 border-white  text-center text-gray-700"
              >
                {/* Ref  */}
                <td className="px-6 py-4">{row.reference}</td>
                {/* Control  */}
                <td className="px-6 py-4">{row.controlName}</td>
                {/* Ass Ques  */}
                <td className="px-6 py-4">{row.controlQuestion}</td>
                {/* Ctrl Compl  */}
                <td className="px-6 py-4 ">
                  <FormControl fullWidth>
                    <InputLabel id="label1">Select Option</InputLabel>
                    <Select
                      labelId="label1"
                      label="Compliance"
                      onChange={(e) => {
                        const newTableData = tableData.map((data) => {
                          if (data.controlQuestion === row.controlQuestion) {
                            return {
                              ...data,
                              controlCompliance: e.target.value,
                            };
                          } else return data;
                        });
                        setTableData(newTableData);
                      }}
                    >
                      <MenuItem value="100">Compliant</MenuItem>
                      <MenuItem value="50">Partially Compliant</MenuItem>
                      <MenuItem value="0">Non Compliant</MenuItem>
                    </Select>
                  </FormControl>
                </td>

                {/* Assessor Comments  */}
                <td className=" px-6 py-4" colSpan={2}>
                  <StreamingTextInput
                    speed={10}
                    targetText={
                      "Financial Effectiveness Posture (FEP) tracks changes in the organisation's monetary efficiency and effectiveness in Information Security expenses. This metric is defined per remediation project and considers actual risk reduction, planned vs. actual for coverage, expenses, and business impact."
                    }
                    width="100%"
                    label="Add Comments"
                    placeholder="Comment"
                    handleChange={(e) => {
                      const newTableData = tableData.map((data) => {
                        if (data.controlQuestion === row.controlQuestion) {
                          return {
                            ...data,
                            assessorComments: e.target.value,
                          };
                        } else return data;
                      });
                      setTableData(newTableData);
                    }}
                  />
                </td>

                {/* Findings  */}
                <td className="px-6 py-4">
                  <TextField
                    label="Findings"
                    placeholder="Findings"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => {
                      const newTableData = tableData.map((data) => {
                        if (data.controlQuestion === row.controlQuestion) {
                          return {
                            ...data,
                            findings: e.target.value,
                          };
                        } else return data;
                      });
                      setTableData(newTableData);
                    }}
                  />
                </td>
                {/* Criticality  */}
                <td className="min-w-52 px-6 py-4">
                  <FormControl fullWidth>
                    <InputLabel id="label1">Select Option</InputLabel>
                    <Select
                      labelId="label1"
                      label="criticality"
                      name="criticality"
                      onChange={(e) => {
                        const newTableData = tableData.map((data) => {
                          if (data.controlQuestion === row.controlQuestion) {
                            return {
                              ...data,
                              criticality: e.target.value,
                            };
                          } else return data;
                        });
                        setTableData(newTableData);
                      }}
                    >
                      <MenuItem value="100">High</MenuItem>
                      <MenuItem value="50">Medium</MenuItem>
                      <MenuItem value="0">Low</MenuItem>
                    </Select>
                  </FormControl>
                </td>
                {/* Comp Status  */}
                <td className="px-6 py-4 ">
                  {row.controlCompliance === 'None'
                    ? row.complianceStatus
                    : row.controlCompliance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewAssessmentComponent;
