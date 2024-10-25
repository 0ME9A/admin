"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PrimaryBtn from "../buttons/PrimaryBtn";
import { ProjectFace } from "@/ts/components";
import ImageUpload from "./ImageUpload";

const emptyData: ProjectFace = {
  _id: "",
  projectType: "",
  title: "",
  desc: "",
  status: "",
  date: "",
  address: "",
  previewImages: [],
};

const GlobalEditDialog = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectFace>(emptyData);

  // Get the project ID and action type from URL parameters
  const projectId = searchParams.get("id");
  const action = searchParams.get("action");

  // Fetch the project data from the backend
  useEffect(() => {
    if (action === "edit" && projectId) {
      fetchProjectData(projectId).then(setProject);
    } else if (action === "create") {
      // For create, initialize an empty project object
      setProject(emptyData);
    }
  }, [projectId, action]);

  // Fetch project details by ID
  const fetchProjectData = async (id: string) => {
    const response = await fetch(`/api/admin/projects/${id}`);
    const data = await response.json();
    return data.project;
  };

  // Handle form submission to update the project
  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", project?.title || "");
    formData.append("description", project?.desc || "");
    formData.append("status", project?.status || "");
    formData.append("date", project?.date || "");
    formData.append("address", project?.address || "");

    if (projectId) {
      await updateProjectData(projectId, formData);
      handleCancel(); // Close the dialog after updating
    }
  };

  // Update the project in the backend
  const updateProjectData = async (id: string, formData: FormData) => {
    const response = await fetch(`/api/admin/projects/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to update project");
    }
  };

  // Handle cancel action to close the dialog
  const handleCancel = () => {
    router.push("/admin/projects");
  };

  if (!project || action !== "edit") return null;

  return (
    <div className="fixed overflow-auto inset-0 flex items-center pt-52 justify-center z-50 bg-black/50 text-black">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-lg">
        <h2 className="text-2xl mb-4">Edit Project</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              value={project.title}
              onChange={(e) =>
                setProject({ ...project, title: e.target.value })
              }
              className="w-full p-2 border"
              id="title"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="desc">
              Description
            </label>
            <textarea
              value={project.desc}
              onChange={(e) => setProject({ ...project, desc: e.target.value })}
              className="w-full p-2 border"
              id="desc"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              value={project.address}
              onChange={(e) =>
                setProject({ ...project, address: e.target.value })
              }
              className="w-full p-2 border"
              id="address"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="status">
              Status
            </label>
            <input
              type="text"
              value={project.status}
              onChange={(e) =>
                setProject({ ...project, status: e.target.value })
              }
              className="w-full p-2 border"
              id="status"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              value={new Date(project.date).toISOString().split("T")[0]}
              onChange={(e) => setProject({ ...project, date: e.target.value })}
              className="w-full p-2 border"
              id="date"
              required
            />
          </div>

          <ImageUpload
            img_id={project.previewImages[0]}
            src={project.previewImages[0]}
            // setImgUploadStatus={setImgUploadStatus}
          />

          <div className="flex justify-end gap-2 mt-5">
            <PrimaryBtn
              type="button"
              className="bg-gray-500 hover:bg-gray-600"
              onClick={handleCancel}
            >
              Cancel
            </PrimaryBtn>
            <PrimaryBtn type="submit">Update</PrimaryBtn>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GlobalEditDialog;
