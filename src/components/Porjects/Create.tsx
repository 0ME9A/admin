"use client";

import React, { useState } from "react";
import CreateNewProject from "./CreateNewProject";

function Create() {
  const [projectForm, setProjectForm] = useState(false);

  return (
    <div
      className={
        "bg-navy-800 border-2 border-navy-700 rounded-xl w-full relative"
      }
    >
      {projectForm ? (
        <CreateNewProject setProjectForm={setProjectForm} />
      ) : (
        <>
          <label
            htmlFor="newData"
            className="w-full h-full block p-10 py-24 rounded-xl cursor-pointer"
          >
            Create New Data +
          </label>
          <button
            id="newData"
            className="hidden"
            onClick={() => setProjectForm(!projectForm)}
          >
            {projectForm ? "Close" : "Create New Data +"}
          </button>
        </>
      )}
    </div>
  );
}

export default Create;
