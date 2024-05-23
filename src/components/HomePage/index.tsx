import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
export default function HomePage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth0();
  return (
    <div className="flex size-full items-center justify-center bg-[#F5F6FA]">
      <div className="flex h-3/4 w-1/4 flex-col items-center justify-between gap-4 rounded-lg bg-white p-10 font-bold">
        <div className="flex flex-col gap-4">
          <div className="text-2xl ">Assessment Inventory</div>
          <div className="flex w-full gap-4 ">
            <div className="flex w-full flex-col items-start justify-between">
              <div className="text-sm font-normal text-slate-700">Hello,</div>
              <div className="text-sm font-normal text-slate-700">
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

        {/* <div className="mb-20 grid grid-cols-2 gap-4 text-white">
          <div className="rounded-lg bg-[#D946EF] p-20 ">01</div>
          <div className="rounded-lg bg-[#D946EF] p-20 ">02</div>
          <div className="rounded-lg bg-[#D946EF] p-20 ">03</div>
          <div className="rounded-lg bg-[#D946EF] p-20 ">04</div>
        </div> */}
        <div className="grid grid-cols-1  ">
          <button
            className=" mt-6 flex w-full items-center justify-center rounded-lg bg-blue-500 px-8 py-4 text-center font-bold text-white hover:bg-blue-700"
            onClick={() => {
              navigate('/create-project');
            }}
          >
            Setup Assessment
          </button>
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
    </div>
  );
}
