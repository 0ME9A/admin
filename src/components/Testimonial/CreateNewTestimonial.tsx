"use client";
import { TestimonialFace } from "@/ts/components";
import { IoMdClose } from "react-icons/io";
import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import PrimaryBtn from "../buttons/PrimaryBtn";
import Image from "next/image";
import { ImSad2 } from "react-icons/im";
import { FaFaceSmile } from "react-icons/fa6";
import { ImHappy2 } from "react-icons/im";

import { FaFaceMeh } from "react-icons/fa6";

import { FaAngry } from "react-icons/fa";

const emptyData = {
  name: "",
  profession: "",
  message: "",
  rate: 5,
  profile: "",
  email: "",
};

const CreateNewTestimonial = ({
  setTestimonialForm,
}: {
  setTestimonialForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [testimonial, setTestimonial] =
    useState<Omit<TestimonialFace, "_id" | "date">>(emptyData);
  const [loading, setLoading] = useState(false);

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

  const handleRatingChange = (rating: number) => {
    setTestimonial((prev) => ({
      ...prev,
      rate: rating,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/testimonial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testimonial),
      });

      if (response.ok) {
        alert("Testimonial created successfully!");
        setTestimonial(emptyData);
      } else {
        alert("Failed to create testimonial");
      }
    } catch (error) {
      console.error("Upload Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl mb-4 text-white">Create New Testimonial</h2>
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
        <div className="grid sm:grid-cols-2 w-full gap-4">
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
            <input
              type="email"
              id="email"
              value={testimonial.email}
              onChange={(e) =>
                setTestimonial({ ...testimonial, email: e.target.value })
              }
              className="w-full p-2 border text-black"
              required
            />
          </div>
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
            onClick={() => setTestimonialForm(false)}
          >
            Close
          </PrimaryBtn>
          <PrimaryBtn
            type="button"
            className="bg-gray-500 hover:bg-gray-600"
            onClick={() => setTestimonial(emptyData)}
          >
            Reset
          </PrimaryBtn>
          <PrimaryBtn type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Create Testimonial"}
          </PrimaryBtn>
        </div>
      </form>
    </div>
  );
};

export default CreateNewTestimonial;
