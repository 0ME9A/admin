"use client";

import { CertificateFace } from "@/ts/components";
import { IoMdClose } from "react-icons/io";
import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import PrimaryBtn from "../buttons/PrimaryBtn";
import Image from "next/image";

const emptyData = {
  // _id: "",
  title: "",
  name: "",
  desc: "",
  certId: "",
  certSrc: "",
  issueDate: new Date().toISOString().split("T")[0],
};

const CreateNewCertificate = ({
  setCertificateForm,
}: {
  setCertificateForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [certificate, setCertificate] =
    useState<Omit<CertificateFace, "_id">>(emptyData);
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
        setCertificate((prev) => ({
          ...prev,
          certSrc: base64Image,
        }));
      }
    }
  };

  // Function to remove an image from previewImages
  const removeImage = () => {
    setCertificate((prevCertificate) => ({
      ...prevCertificate,
      certSrc: "",
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(certificate),
      });

      if (response.ok) {
        alert("Certificate uploaded successfully!");
        setCertificate(emptyData);
      } else {
        alert("Failed to upload certificate");
      }
    } catch (error) {
      console.error("Upload Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl mb-4 text-white">Create New Certificate</h2>
      <form onSubmit={handleSubmit} className="text-white">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">
            Certificate Title
          </label>
          <input
            type="text"
            id="title"
            value={certificate.title}
            onChange={(e) =>
              setCertificate({ ...certificate, title: e.target.value })
            }
            className="w-full p-2 border text-black"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            Recipient Name
          </label>
          <input
            type="text"
            id="name"
            value={certificate.name}
            onChange={(e) =>
              setCertificate({ ...certificate, name: e.target.value })
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
            value={certificate.desc}
            onChange={(e) =>
              setCertificate({ ...certificate, desc: e.target.value })
            }
            className="w-full p-2 border text-black"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="certId" className="block mb-2">
            Certificate ID
          </label>
          <input
            type="text"
            id="certId"
            value={certificate.certId}
            onChange={(e) =>
              setCertificate({ ...certificate, certId: e.target.value })
            }
            className="w-full p-2 border text-black"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="issueDate" className="block mb-2">
            Issue Date
          </label>
          <input
            type="date"
            id="issueDate"
            value={
              certificate.issueDate
                ? new Date(certificate.issueDate).toISOString().split("T")[0]
                : ""
            }
            onChange={
              (e) =>
                setCertificate({ ...certificate, issueDate: e.target.value }) // Use 'issueDate' instead of 'date'
            }
            className="w-full p-2 border text-black"
            required
          />
        </div>

        <div className="mb-4">
          <div>
            <label className="mb-2 flex justify-between gap-4">
              Upload Certificate Image{" "}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2"
            />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-4">
            <div className="w-full aspect-video relative">
              <Image
                width={500}
                height={500}
                src={`data:image/jpeg;base64,${certificate.certSrc}`}
                alt={`Certificate Preview`}
                className="object-cover rounded w-full"
              />

              <button
                type="button"
                className="absolute top-2 right-2 p-1 rounded-full bg-red-500 hover:bg-red-600"
                id="remove-image"
                onClick={() => removeImage()} // Remove image on button click
              >
                <IoMdClose />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <PrimaryBtn
            type="button"
            className="bg-gray-500 hover:bg-gray-600"
            onClick={() => setCertificateForm(false)}
          >
            Close
          </PrimaryBtn>
          <PrimaryBtn
            type="button"
            className="bg-gray-500 hover:bg-gray-600"
            onClick={() => setCertificate(emptyData)}
          >
            Reset
          </PrimaryBtn>
          <PrimaryBtn type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Certificate"}
          </PrimaryBtn>
        </div>
      </form>
    </div>
  );
};

export default CreateNewCertificate;
