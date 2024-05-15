import React from "react";

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
    sno: "1",
    controlNumber: "5.1",
    controlName: "Policies for Information Security",
    controlQuestions:
      "Is there an Information Security Policy approved by management?",
    assesseeComments: "Reviewed and updated annually",
    policyProcessUrl: "URL to policy",
    adequacyOfComments: "Yes",
    assessorComment: "Sufficient detail",
    complianceCategory: "Compliant",
    findings: "None",
    findingCategory: "Low",
    recommendations:
      "Ensure the Information Security Policy is reviewed and updated regularly.",
    remarks: "No additional remarks",
  },
  {
    sno: "2",
    controlNumber: "5.2",
    controlName: "Information Security Roles and Responsibilities",
    controlQuestions:
      "Are security roles and responsibilities clearly defined within the organization?",
    assesseeComments: "Roles are well-defined",
    policyProcessUrl: "URL to roles description",
    adequacyOfComments: "Yes",
    assessorComment: "Clearly articulated",
    complianceCategory: "Partially Compliant",
    findings: "Minor gaps in role definitions",
    findingCategory: "Medium",
    recommendations:
      "Regularly review and update security roles and responsibilities.",
    remarks: "Update pending in Q3",
  },
  // Additional rows can be added following the same format
];

const SimpleTable: React.FC = () => {
  return (
    <div className="flex h-full w-full justify-center bg-[#F5F6FA]">
      <div className="relative w-full overflow-x-auto p-5">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-200 text-xs uppercase text-gray-900">
            <tr>
              <th scope="col" className="py-3 px-6">
                Sno.
              </th>
              <th scope="col" className="py-3 px-6">
                Control Number
              </th>
              <th scope="col" className="py-3 px-6">
                Control Name
              </th>
              <th scope="col" className="py-3 px-6">
                Control Questions
              </th>
              <th scope="col" className="py-3 px-6">
                Assessee Comments
              </th>
              <th scope="col" className="py-3 px-6">
                Policy/Process URL
              </th>
              <th scope="col" className="py-3 px-6">
                Adequacy of Comments
              </th>
              <th scope="col" className="py-3 px-6">
                Assessor Comment
              </th>
              <th scope="col" className="py-3 px-6">
                Compliance Category
              </th>
              <th scope="col" className="py-3 px-6">
                Findings
              </th>
              <th scope="col" className="py-3 px-6">
                Finding Category
              </th>
              <th scope="col" className="py-3 px-6">
                Recommendations
              </th>
              <th scope="col" className="py-3 px-6">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.sno} className="border-b bg-white text-gray-700">
                <td className="py-4 px-6">{row.sno}</td>
                <td className="py-4 px-6">{row.controlNumber}</td>
                <td className="py-4 px-6">{row.controlName}</td>
                <td className="py-4 px-6">{row.controlQuestions}</td>
                <td className="py-4 px-6">{row.assesseeComments}</td>
                <td className="py-4 px-6">{row.policyProcessUrl}</td>
                <td className="py-4 px-6">{row.adequacyOfComments}</td>
                <td className="py-4 px-6">{row.assessorComment}</td>
                <td className="py-4 px-6">{row.complianceCategory}</td>
                <td className="py-4 px-6">{row.findings}</td>
                <td className="py-4 px-6">{row.findingCategory}</td>
                <td className="py-4 px-6">{row.recommendations}</td>
                <td className="py-4 px-6">{row.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="mt-6 flex mx-auto items-center justify-center rounded-lg bg-blue-500 px-8 py-4 text-center text-white font-bold hover:bg-blue-700"
        >
          Connect Human Assistant
        </button>
      </div>
    </div>
  );
};

export default SimpleTable;
