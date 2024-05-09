import React from 'react'

export default function CreateProject() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#F5F6FA]">
      <div className="flex h-screen flex-col items-center justify-center gap-6 rounded-lg bg-white p-20">
        <div className="mb-20 w-full text-2xl font-bold">Create Project</div>

        <div className="flex flex-col items-center justify-start  gap-2">
          <div className="w-full text-sm font-bold">
            Upload Compliance Document
          </div>

          <input
            type="file"
            className="text-grey-500 w-full text-sm
            file:mr-5 file:rounded-full file:border-0
            file:bg-blue-50 file:px-6
            file:py-2 file:text-sm
            file:font-medium file:text-blue-700
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          "
          />
        </div>
        <div className="flex flex-col items-center justify-start  gap-2">
          <div className="w-full text-sm font-bold">
            Upload Evidence Document
          </div>

          <input
            type="file"
            className="text-grey-500 w-full text-sm
            file:mr-5 file:rounded-full file:border-0
            file:bg-blue-50 file:px-6
            file:py-2 file:text-sm
            file:font-medium file:text-blue-700
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          "
          />
        </div>
        <div className="mb-10 flex flex-col items-center  justify-start gap-2">
          <div className="w-full text-sm font-bold">
            Upload Risk Rvaluation Document
          </div>

          <input
            type="file"
            className="text-grey-500 w-full text-sm
            file:mr-5 file:rounded-full file:border-0
            file:bg-blue-50 file:px-6
            file:py-2 file:text-sm
            file:font-medium file:text-blue-700
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          "
          />
        </div>

        <button className="flex w-full items-center justify-center rounded-lg bg-[#1a73e8] p-4 text-center font-bold text-white">
          Submit
        </button>
      </div>
    </div>
  )
}
