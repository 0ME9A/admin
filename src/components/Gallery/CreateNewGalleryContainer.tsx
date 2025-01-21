"use client";
import React, { useState } from "react";
import { FcPlus } from "react-icons/fc";
import CreateNewGallery from "./CreateNewGallery";

function CreateNewGalleryContainer() {
  const [galleryForm, setGalleryForm] = useState(false);

  return (
    <div
      className={
        "bg-navy-800 border-2 border-navy-700 rounded-xl w-full relative"
      }
    >
      {galleryForm ? (
        <CreateNewGallery setGalleryForm={setGalleryForm} />
      ) : (
        <>
          <label
            htmlFor="newData"
            className="w-full h-full p-10 py-24 rounded-xl cursor-pointer text-xl flex items-center gap-2"
          >
            Create New Data <FcPlus className="text-2xl" />
          </label>
          <button
            id="newData"
            className="hidden"
            onClick={() => setGalleryForm(!galleryForm)}
          >
            {galleryForm ? "Close" : "Create New Data +"}
          </button>
        </>
      )}
    </div>
  );
}

export default CreateNewGalleryContainer;
