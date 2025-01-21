"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { GalleryFace } from "@/ts/components";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import imageCompression from "browser-image-compression";
import PrimaryBtn from "../buttons/PrimaryBtn";
import Image from "next/image";

const emptyData = {
  title: "",
  desc: "",
  previewImages: [],
};

const GlobalEditDialog = () => {
  const [gallery, setGallery] = useState<Omit<GalleryFace, "_id">>(emptyData);
  const [galleryFetchLoading, setGalleryFetchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const galleryId = searchParams.get("id");
  const action = searchParams.get("action");

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
        setGallery((prev) => ({
          ...prev,
          previewImages: [...prev.previewImages, base64Image],
        }));
      }
    }
  };

  // Function to remove an image from previewImages
  const removeImage = (indexToRemove: number) => {
    setGallery((prevGallery) => ({
      ...prevGallery,
      previewImages: prevGallery.previewImages.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (gallery) {
      try {
        const response = await fetch(`/api/admin/gallery/${galleryId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gallery),
        });

        if (response.ok) {
          alert("Gallery updated successfully!");
          router.push("/admin/gallery"); // Redirect to the gallery page or desired route
        } else {
          alert("Failed to update gallery");
        }
      } catch (error) {
        console.error("Update Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch gallery data from the server
  const fetchGallery = async (id: string) => {
    try {
      setGalleryFetchLoading(true);
      const response = await fetch(`/api/admin/gallery/${id}`);
      if (response.ok) {
        const data = await response.json();
        setGallery(data);
        setGalleryFetchLoading(false);
      } else {
        setGalleryFetchLoading(false);
        console.error("Failed to fetch gallery");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (galleryId && action === "edit") {
      fetchGallery(galleryId);
    }
  }, [action, galleryId]);

  if (!galleryId || action !== "edit") return null;

  return (
    <section className="fixed top-0 left-0 w-full bg-black/50 z-50 overflow-auto py-10 h-dvh backdrop-blur-sm">
      <div className="p-6 text-black max-w-xl w-full mx-auto bg-navy-800 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl mb-4 text-white">Upload Gallery</h2>
          {galleryFetchLoading ? (
            <div className="size-5 border-2 rounded-full border-t-transparent border-white animate-spin"></div>
          ) : (
            ""
          )}
        </div>
        <form onSubmit={handleSubmit} className="text-white">
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={gallery.title}
              onChange={(e) =>
                setGallery({ ...gallery, title: e.target.value })
              }
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
              value={gallery.desc}
              onChange={(e) => setGallery({ ...gallery, desc: e.target.value })}
              className="w-full p-2 border text-black"
              required
            />
          </div>

          <div className="mb-4">
            <div>
              <label className="mb-2 flex justify-between gap-4">
                Upload Preview Images{" "}
                <strong className="">({gallery.previewImages.length})</strong>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2"
              />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-4">
              {gallery.previewImages.length > 0 &&
                gallery.previewImages.map((img, index) => (
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
              onClick={() => router.push("/admin/gallery")}
            >
              Close
            </PrimaryBtn>
            <PrimaryBtn
              type="submit"
              disabled={loading}
              className="disabled:bg-accent-400"
            >
              {loading ? "Uploading..." : "Upload Gallery"}
            </PrimaryBtn>
          </div>
        </form>
      </div>
    </section>
  );
};

export default GlobalEditDialog;
