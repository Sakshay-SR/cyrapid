import React from 'react';

// Define the type for our table data
type RowData = {
  sno: string;
  controlNumber: string;
  controlName: string;
  controlQuestions: string;
  assesseeComments: string;
  policyProcessUrl: string;
  adequacyOfComments: string;
  assessorComment: string;
  complianceCategory: string;
  findings: string;
  findingCategory: string;
  recommendations: string;
  remarks: string;
};

// Sample data for the table
const tableData: RowData[] = [
  {
    sno: '1',
    controlNumber: '5.1',
    controlName: 'Policies for Information Security',
    controlQuestions:
      'Is there an Information Security Policy approved by management?',
    assesseeComments: 'Reviewed and updated annually',
    policyProcessUrl: 'URL to policy',
    adequacyOfComments: 'Yes',
    assessorComment: 'Sufficient detail',
    complianceCategory: 'Compliant',
    findings: 'None',
    findingCategory: 'Low',
    recommendations:
      'Ensure the Information Security Policy is reviewed and updated regularly.',
    remarks: 'No additional remarks',
  },
  {
    sno: '2',
    controlNumber: '5.2',
    controlName: 'Information Security Roles and Responsibilities',
    controlQuestions:
      'Are security roles and responsibilities clearly defined within the organization?',
    assesseeComments: 'Roles are well-defined',
    policyProcessUrl: 'URL to roles description',
    adequacyOfComments: 'Yes',
    assessorComment: 'Clearly articulated',
    complianceCategory: 'Partially Compliant',
    findings: 'Minor gaps in role definitions',
    findingCategory: 'Medium',
    recommendations:
      'Regularly review and update security roles and responsibilities.',
    remarks: 'Update pending in Q3',
  },
  // Additional rows can be added following the same format
];

const SimpleTable: React.FC = () => {
  return (
    <div className="flex h-full w-screen justify-center bg-[#F5F6FA]">
      <div className="relative  overflow-x-auto p-5">
        <table className=" text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-200 text-xs uppercase text-gray-900">
            <tr>
              <th scope="col" className="px-6 py-3">
                Sno.
              </th>
              <th scope="col" className="px-6 py-3">
                Control Number
              </th>
              <th scope="col" className="px-6 py-3">
                Control Name
              </th>
              <th scope="col" className="px-6 py-3">
                Control Questions
              </th>
              <th scope="col" className="px-6 py-3">
                Assessee Comments
              </th>
              <th scope="col" className="px-6 py-3">
                Policy/Process URL
              </th>
              <th scope="col" className="px-6 py-3">
                Adequacy of Comments
              </th>
              <th scope="col" className="px-6 py-3">
                Assessor Comment
              </th>
              <th scope="col" className="px-6 py-3">
                Compliance Category
              </th>
              <th scope="col" className="px-6 py-3">
                Findings
              </th>
              <th scope="col" className="px-6 py-3">
                Finding Category
              </th>
              <th scope="col" className="px-6 py-3">
                Recommendations
              </th>
              <th scope="col" className="px-6 py-3">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.sno} className="border-b bg-white text-gray-700">
                <td className="px-6 py-4">{row.sno}</td>
                <td className="px-6 py-4">{row.controlNumber}</td>
                <td className="px-6 py-4">{row.controlName}</td>
                <td className="px-6 py-4">{row.controlQuestions}</td>
                <td className="px-6 py-4">{row.assesseeComments}</td>
                <td className="px-6 py-4">{row.policyProcessUrl}</td>
                <td className="px-6 py-4">{row.adequacyOfComments}</td>
                <td className="px-6 py-4">{row.assessorComment}</td>
                <td className="px-6 py-4">{row.complianceCategory}</td>
                <td className="px-6 py-4">{row.findings}</td>
                <td className="px-6 py-4">{row.findingCategory}</td>
                <td className="px-6 py-4">{row.recommendations}</td>
                <td className="px-6 py-4">{row.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="mx-auto mt-6 flex items-center justify-center rounded-lg bg-blue-500 px-8 py-4 text-center font-bold text-white hover:bg-blue-700">
          Connect Human Assistant
        </button>
      </div>
    </div>
  );
};

export default SimpleTable;
