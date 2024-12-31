"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PrimaryBtn from "../buttons/PrimaryBtn";

const GlobalDeleteDialog = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [certId, setCertId] = useState<string | null>(null);
  const [certTitle, setCertTitle] = useState<string>("");

  useEffect(() => {
    const action = searchParams.get("action");
    const id = searchParams.get("id");
    const title = searchParams.get("title");

    if (action === "delete" && id) {
      setCertId(id);
      setCertTitle(title || "this certificate");
      setIsDialogOpen(true);
    } else {
      setIsDialogOpen(false);
    }
  }, [searchParams]);

  const handleCancel = () => {
    const updatedParams = new URLSearchParams(searchParams.toString());
    updatedParams.delete("action");
    updatedParams.delete("id");
    updatedParams.delete("title");
    router.push(`?${updatedParams.toString()}`);
    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!certId) return;

    try {
      const response = await fetch(`/api/admin/certificates/${certId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log(`Project ${certId} deleted successfully.`);
        handleCancel();
      } else {
        console.error(`Failed to delete project: ${response.status}`);
      }
    } catch (error) {
      console.error("Error during project deletion:", error);
    }
  };

  if (!isDialogOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md text-black">
        <h2 className="text-xl font-semibold mb-4">Delete Project</h2>
        <p>
          Are you sure you want to delete the project{" "}
          <strong>{certTitle}</strong>?
        </p>
        <div className="flex justify-end mt-6 gap-4">
          <PrimaryBtn
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-600"
            autoFocus
          >
            Cancel
          </PrimaryBtn>
          <PrimaryBtn
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
};

export default GlobalDeleteDialog;
