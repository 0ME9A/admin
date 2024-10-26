"use client";

import { ProjectFace } from "@/ts/components";
import { IoMdClose } from "react-icons/io";
import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import PrimaryBtn from "../buttons/PrimaryBtn";
import Image from "next/image";

const emptyData = {
  title: "",
  address: "",
  desc: "",
  date: new Date().toISOString(),
  projectType: "",
  status: "",
  previewImages: [],
};

const CreateNewProject = ({
  setProjectForm,
}: {
  setProjectForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [project, setProject] = useState<Omit<ProjectFace, "_id">>(emptyData);
  const [loading, setLoading] = useState(false);

  // Compress and convert the image to Base64
  const handleImageUpload = async (file: File) => {
    try {
      const options = {
        maxSizeMB: 0.5, // Max size 500KB
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      // Compress image
      const compressedFile = await imageCompression(file, options);

      // Convert to Base64
      const reader = new FileReader();
      return new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64String = reader.result?.toString().split(",")[1];
          resolve(base64String || "");
        };
        reader.onerror = reject;
        reader.readAsDataURL(compressedFile);
      });
    } catch (error) {
      console.error("Image compression error:", error);
      return "";
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const base64Image = await handleImageUpload(file);
      if (base64Image) {
        setProject((prev) => ({
          ...prev,
          previewImages: [...prev.previewImages, base64Image],
        }));
      }
    }
  };

  // Function to remove an image from previewImages
  const removeImage = (indexToRemove: number) => {
    setProject((prevProject) => ({
      ...prevProject,
      previewImages: prevProject.previewImages.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        alert("Project uploaded successfully!");
        setProject(emptyData);
      } else {
        alert("Failed to upload project");
      }
    } catch (error) {
      console.error("Upload Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl mb-4 text-white">Upload Project</h2>
      <form onSubmit={handleSubmit} className="text-white">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={project.title}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
            className="w-full p-2 border text-black"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="desc" className="block mb-2">
            Description
          </label>
          <textarea
            id="desc"
            value={project.desc}
            onChange={(e) => setProject({ ...project, desc: e.target.value })}
            className="w-full p-2 border text-black"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={project.address}
            onChange={(e) =>
              setProject({ ...project, address: e.target.value })
            }
            className="w-full p-2 border text-black"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="block mb-2">
            Status
          </label>
          <select
            id="status"
            value={project.status}
            onChange={(e) => setProject({ ...project, status: e.target.value })}
            className="w-full p-2 border text-black"
            required
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={new Date(project.date).toISOString().split("T")[0]}
            onChange={(e) => setProject({ ...project, date: e.target.value })}
            className="w-full p-2 border text-black"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="projectType" className="block mb-2">
            Project Type
          </label>
          <input
            type="text"
            id="projectType"
            value={project.projectType}
            onChange={(e) =>
              setProject({ ...project, projectType: e.target.value })
            }
            className="w-full p-2 border text-black"
            required
          />
        </div>

        <div className="mb-4">
          <div>
            <label className="mb-2 flex justify-between gap-4">
              Upload Preview Images{" "}
              <strong className="">({project.previewImages.length})</strong>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2"
            />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-4">
            {project.previewImages.length > 0 &&
              project.previewImages.map((img, index) => (
                <div className="w-full aspect-video relative" key={index}>
                  <Image
                    width={500}
                    height={500}
                    src={`data:image/jpeg;base64,${img}`}
                    alt={`Preview ${index + 1}`}
                    className="object-cover rounded w-full"
                  />

                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-500 hover:bg-red-600"
                    id="remove-image"
                    onClick={() => removeImage(index)} // Remove image on button click
                  >
                    <IoMdClose />
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <PrimaryBtn
            type="button"
            className="bg-gray-500 hover:bg-gray-600"
            onClick={() => setProjectForm(false)}
          >
            Close
          </PrimaryBtn>
          <PrimaryBtn
            type="button"
            className="bg-gray-500 hover:bg-gray-600"
            onClick={() => setProject(emptyData)}
          >
            Reset
          </PrimaryBtn>
          <PrimaryBtn type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Project"}
          </PrimaryBtn>
        </div>
      </form>
    </div>
  );
};

export default CreateNewProject;
