import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Routes from './Routes'; // Import the routes component

const App = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <div></div>; // Add a loading indicator while the user information is being loaded
  }

  return <Routes />;
};

export default App;
