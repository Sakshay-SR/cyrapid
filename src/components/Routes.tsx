import HomePage from './HomePage';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layout/mainLayout';

import LoginPage from './LoginPage';
import PrivateRoutes from './PrivateRoutes';
import CreateProject from './CreateProject';
import SimpleTable from './Table';
import NewAssessmentComponent from './ComplianceAssessment/newAssessment';
import AssessmentTable from './ComplianceAssessment/AssessmentTable';

export const router = createBrowserRouter([
  {
    element: <PrivateRoutes />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: '/create-project',
            element: <CreateProject />,
          },
          {
            path: '/assessment-table',
            element: <SimpleTable />,
          },
        ],
      },
      {
        path: '/compliance-assessment/new',
        element: <AssessmentTable />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);
