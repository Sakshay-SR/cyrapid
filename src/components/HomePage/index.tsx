import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import SigmaredLogo from "../../assets/company-logo.png";
import Background1 from "../../assets/background2.png";
import UserInventoryTable from "./userInventoryTable";
import HitlInventoryTable from "./hitlInventoryTable";

export default function HomePage() {
  const navigate = useNavigate();
  const token = useState(localStorage.getItem("token"));
  const { logout, user } = useAuth0();
  const [role, setRole] = useState<string>();

  useEffect(() => {
    function settokenrole() {
      const userRole =
        user &&
        user["https://sigmared.us.auth0.comroles"]?.includes("HumanAssessor")
          ? "admin"
          : "user";
      setRole(userRole);
    }
    const handleTokenUpdate = () => {
      console.log("Token updated event triggered");
      settokenrole();
    };

    window.addEventListener("token-updated", handleTokenUpdate);

    // Optional: Fetch data on initial load if token exists already
    if (localStorage.getItem("token")) {
      settokenrole();
    }

    return () => {
      window.removeEventListener("token-updated", handleTokenUpdate);
    };
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${Background1})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="flex size-full items-center justify-center bg-[#f5f6fa]"
    >
      {/* HEADER */}
      <div className="absolute top-0 z-10 flex h-20 w-full items-center justify-center bg-white">
        <div className="flex w-[90%] items-center justify-between">
          <div
            className="cursor-pointer rounded-2xl text-2xl font-semibold"
            onClick={() => {
              navigate("/");
            }}
            title="Home"
          >
            <img src={SigmaredLogo} width="150" alt="Logo" />
          </div>
          <div className="flex gap-4">
            <div className="flex w-full flex-col items-end justify-between">
              <div className="font-semibold">{user?.nickname}</div>
            </div>
            <button
              title="logout"
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
      {/* ASSESSMENT DISPLAY */}
      {role && token ? (
        role === "user" ? (
          <UserInventoryTable token={token} />
        ) : (
          <HitlInventoryTable token={token} />
        )
      ) : null}
    </div>
  );
}
