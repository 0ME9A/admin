"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PrimaryBtn from "../buttons/PrimaryBtn";

function GlobalDeleteDialog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [galleryId, setGalleryId] = useState<string | null>(null);
  const [galleryTitle, setGalleryTitle] = useState<string>("");

  useEffect(() => {
    const action = searchParams.get("action");
    const id = searchParams.get("id");
    const title = searchParams.get("title"); // Assume title is passed in the query

    if (action === "delete" && id) {
      setGalleryId(id);
      setGalleryTitle(title || "this gallery"); // Default to "this gallery" if title isn't provided
      setIsDialogOpen(true);
    } else {
      setIsDialogOpen(false);
    }
  }, [searchParams]);

  const handleCancel = () => {
    // Clear the query parameters without refreshing the page
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("action");
    newParams.delete("id");
    newParams.delete("title"); // Clear title as well
    router.push(`?${newParams.toString()}`);
    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    // Send DELETE request to backend
    try {
      await fetch(`/api/admin/gallery/${galleryId}`, { method: "DELETE" });
      console.log(`gallery ${galleryId} deleted successfully.`);
      handleCancel(); // Close the dialog after deleting
    } catch (error) {
      console.error("Failed to delete the gallery:", error);
    }
  };

  if (!isDialogOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md text-black">
        <h2 className="text-xl font-semibold mb-4">Delete Gallery</h2>
        <p>
          Are you sure you want to delete the gallery{" "}
          <strong>{galleryTitle}</strong>?
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
}

export default GlobalDeleteDialog;
