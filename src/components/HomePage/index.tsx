import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#F5F6FA]">
      <div className="flex h-screen flex-col items-center justify-center rounded-lg bg-white p-10 font-bold">
        <div className="mb-20 text-2xl ">Your Assessments</div>
        <div className="mb-20 grid grid-cols-2 gap-4 text-white">
          <div className="rounded-lg bg-[#D946EF] p-20 ">01</div>
          <div className="rounded-lg bg-[#D946EF] p-20 ">02</div>
          <div className="rounded-lg bg-[#D946EF] p-20 ">03</div>
          <div className="rounded-lg bg-[#D946EF] p-20 ">04</div>
        </div>
        <button
          className="flex w-full items-center justify-center rounded-lg bg-[#1a73e8] p-4 text-center text-white"
          onClick={() => {
            navigate('/create-project')
          }}
        >
          Create Project
        </button>
      </div>
    </div>
  )
}
