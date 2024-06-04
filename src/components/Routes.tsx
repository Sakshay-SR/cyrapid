import React from "react";
import HomePage from "./HomePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/mainLayout";
import LoginPage from "./LoginPage";
import PrivateRoutes from "./PrivateRoutes";
import CreateProject from "./CreateProject";
import AssessmentTable from "./ComplianceAssessment/AssessmentTable";
import HITLAssessmentTable from "./ComplianceAssessment/HitlAssessmentTable";
import { useAuth0 } from "@auth0/auth0-react";

export const Routes = () => {
  const { user, isLoading } = useAuth0();

  if (isLoading) {
    return <div></div>; // Add a loading indicator while the user information is being loaded
  }
  const userRole =
    user && user["https://sigmared.us.auth0.comroles"]?.includes("HumanAssessor")
      ? "admin"
      : "user";
  console.log(userRole)
  const router = createBrowserRouter([
    {
      element: <PrivateRoutes />,
      children: [
        {
          element: <MainLayout />,
          children: [
            {
              path: "/",
              element: <HomePage />,
            },
            {
              path: "/create-assessment",
              element: <CreateProject />,
            },
            {
              path: "/compliance-assessment/new",
              element:
                userRole === "admin" ? <HITLAssessmentTable /> : <AssessmentTable />,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
