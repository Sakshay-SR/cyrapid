import React from 'react'
import HomePage from './HomePage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './LoginPage'
import PrivateRoutes from './PrivateRoutes'
import CreateProject from './CreateProject'
const router = createBrowserRouter([
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/create-project',
        element: <CreateProject />
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  }
])

const App = () => {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}

export default App
