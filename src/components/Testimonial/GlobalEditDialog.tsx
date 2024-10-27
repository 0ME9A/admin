"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { FaFaceMeh, FaFaceSmile } from "react-icons/fa6";
import { TestimonialFace } from "@/ts/components";
import { ImSad2, ImHappy2 } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { FaAngry } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import PrimaryBtn from "../buttons/PrimaryBtn";
import Image from "next/image";

const emptyData = {
  name: "",
  profession: "",
  message: "",
  rate: 5,
  profile: "",
  email: "",
};

const GlobalEditDialog = () => {
  const [testimonial, setTestimonial] =
    useState<Omit<TestimonialFace, "_id" | "date">>(emptyData);
  const [loading, setLoading] = useState(false);
  const [testimonialLoading, setTestimonialLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const testimonialId = searchParams.get("id");
  const action = searchParams.get("action");

  // Compress and convert the image to Base64
  const handleImageUpload = async (file: File) => {
    try {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 512,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
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
        setTestimonial((prev) => ({
          ...prev,
          profile: base64Image,
        }));
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/testimonial/${testimonialId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonial),
      });

      if (response.ok) {
        alert("Testimonial updated successfully!");
        router.push("/admin/testimonial");
      } else {
        alert("Failed to update testimonial");
      }
    } catch (error) {
      console.error("Upload Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch project data from the server
  const fetchTestimonial = async (id: string) => {
    setTestimonialLoading(true);
    try {
      const response = await fetch(`/api/admin/testimonial/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTestimonial(data);
        setTestimonialLoading(false);
      } else {
        setTestimonialLoading(false);
        console.error("Failed to fetch project");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleRatingChange = (rating: number) => {
    setTestimonial((prev) => ({
      ...prev,
      rate: rating,
    }));
  };

  useEffect(() => {
    if (testimonialId && action === "edit") {
      fetchTestimonial(testimonialId);
    }
  }, [searchParams]);

  if (!testimonialId || action !== "edit") return null;

  return (
    <section className="fixed top-0 left-0 w-full bg-black/50 z-50 overflow-auto py-10 h-dvh backdrop-blur-sm">
      <div className="p-6 text-black max-w-xl w-full mx-auto bg-navy-800 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl mb-4 text-white">Update Testimonial</h2>
          {testimonialLoading ? (
            <div className="size-5 border-2 rounded-full border-t-transparent border-white animate-spin"></div>
          ) : (
            ""
          )}
        </div>
        <form onSubmit={handleSubmit} className="text-white">
          <div>
            <label className="mb-2 flex justify-between gap-4">
              Upload Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2"
            />

            <div className="mt-2 w-32 h-32 relative">
              {testimonial.profile ? (
                <div className="relative">
                  <Image
                    width={500}
                    height={500}
                    src={`data:image/jpeg;base64,${testimonial.profile}`}
                    alt="Profile Preview"
                    className="object-cover rounded-full w-32 h-32 border"
                  />

                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-500 hover:bg-red-600"
                    onClick={() =>
                      setTestimonial((prev) => ({ ...prev, profile: "" }))
                    }
                  >
                    <IoMdClose />
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">No profile photo selected</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={testimonial.name}
              onChange={(e) =>
                setTestimonial({ ...testimonial, name: e.target.value })
              }
              className="w-full p-2 border text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <p className="w-full p-2 border text-black bg-white">
              {testimonial.email}
            </p>
          </div>
          <div className="mb-4">
            <label htmlFor="profession" className="block mb-2">
              Profession
            </label>
            <input
              type="text"
              id="profession"
              value={testimonial.profession}
              onChange={(e) =>
                setTestimonial({ ...testimonial, profession: e.target.value })
              }
              className="w-full p-2 border text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={testimonial.message}
              onChange={(e) =>
                setTestimonial({ ...testimonial, message: e.target.value })
              }
              className="w-full p-2 border text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="rating" className="block mb-2 text-white">
              Rating
            </label>
            <div className="flex justify-evenly items-center gap-4 p-4 bg-navy-900/50 rounded-xl">
              {[1, 2, 3, 4, 5].map((rating) => {
                const icons = {
                  1: <FaAngry />,
                  2: <ImSad2 />,
                  3: <FaFaceMeh />,
                  4: <FaFaceSmile />,
                  5: <ImHappy2 />,
                };
                return (
                  <label key={rating} className="relative">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={testimonial.rate === rating}
                      onChange={() => handleRatingChange(rating)}
                      className="absolute opacity-0"
                    />
                    <div
                      className={`p-3 text-3xl rounded-lg transition-colors cursor-pointer ${
                        testimonial.rate === rating
                          ? "bg-navy-800 text-accent-500"
                          : "text-gray-400"
                      }`}
                    >
                      {icons[rating as 1 | 2 | 3 | 4 | 5]}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <PrimaryBtn
              type="button"
              className="bg-gray-500 hover:bg-gray-600"
              onClick={() => router.push("/admin/testimonial")}
            >
              Close
            </PrimaryBtn>
            <PrimaryBtn type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Testimonial"}
            </PrimaryBtn>
          </div>
        </form>
      </div>
    </section>
  );
};

export default GlobalEditDialog;
