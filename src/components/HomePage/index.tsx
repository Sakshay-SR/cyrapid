import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssessment } from 'api/dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import SigmaredLogo from "../../assets/company-logo.png";
import AddIcon from '@mui/icons-material/Add';
import Add from '@mui/icons-material/Add';
export default function HomePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { logout, user } = useAuth0();

  React.useEffect(() => {
    const fetchData = async () => {
      const client_id = localStorage.getItem('client_id');
      const res = await getAssessment(client_id, token);
      console.log(res, "worked");
    };
    fetchData();
  }, []);

  return (
    <div className="flex size-full items-center justify-center bg-[#F5F6FA]">
      {/* HEADER */}
      <div className='h-20 w-full flex items-center  justify-center absolute z-10 top-0 bg-white '>
        <div className="flex w-[90%] items-center justify-between">
          <div
            className=" cursor-pointer rounded-2xl  text-2xl font-semibold"
            onClick={() => {
              navigate("/");
            }}
            title="Home"
          >
            <img src={SigmaredLogo} width="150" alt="Logo" />
          </div>
          <div className="flex gap-4">
            <div className="flex w-full flex-col items-end justify-between">
              <div className="text-sm font-semibold">Hello,</div>
              <div className="text-sm font-semibold">
                {user?.name}
              </div>
            </div>
            <button
              title="logout"
              // className=" mt-6 flex items-center justify-center rounded-lg bg-blue-500 p-4 text-center font-bold text-white hover:bg-blue-700"
              onClick={() => {
                logout();
              }}
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </div>
      {/* INVENTORY  */}
      <div className="flex shadow-2xl h-auto w-1/4 flex-col items-center justify-between gap-4 rounded-lg bg-white p-10 font-bold">
        <div className="flex flex-col gap-4">
          <div className="text-2xl ">Assessment Inventory</div>

        </div>
        <div className="grid grid-cols-1  ">

          <button
            className=" mt-6 flex items-center justify-center rounded-lg bg-blue-500 px-8 py-4 text-center font-bold text-white hover:bg-blue-700"
            onClick={() => {
              navigate('/compliance-assessment/new');
            }}
          >
            Compliance Assessment
          </button>
        </div>
      </div>
      <div className='absolute bottom-20 right-10'>
      <button
            className=" mt-6 flex w-full items-center justify-center rounded-lg bg-blue-500 px-8 py-4 text-center font-bold text-white hover:bg-blue-700"
            onClick={() => {
              navigate('/create-project');
            }}
          >
            Setup Assessment &nbsp;<Add />
          </button>
      </div>
    </div>
  );
}
