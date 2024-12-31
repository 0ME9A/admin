"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { CertificateFace } from "@/ts/components";
import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import PrimaryBtn from "../buttons/PrimaryBtn";
import Image from "next/image";

const emptyData = {
  title: "",
  name: "",
  desc: "",
  certId: "",
  certSrc: "",
  issueDate: "",
};

const GlobalEditDialog = () => {
  const [certificate, setCertificate] =
    useState<Omit<CertificateFace, "_id">>(emptyData);
  const [certificateFetchLoading, setCertificateFetchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const certId = searchParams.get("id");
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
        setCertificate((prev) => ({ ...prev, certSrc: base64Image }));
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (certificate) {
      try {
        const response = await fetch(`/api/admin/certificates/${certId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(certificate),
        });

        if (response.ok) {
          alert("Certificate updated successfully!");
          router.push("/admin/certificates"); // Redirect to the certificates page
        } else {
          alert("Failed to update certificate");
        }
      } catch (error) {
        console.error("Update Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchCertificate = async (id: string) => {
    try {
      setCertificateFetchLoading(true);
      const response = await fetch(`/api/admin/certificates/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCertificate(data);
        setCertificateFetchLoading(false);
      } else {
        setCertificateFetchLoading(false);
        console.error("Failed to fetch certificate");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (certId && action === "edit") {
      fetchCertificate(certId);
    }
  }, [action, certId]);

  if (!certId || action !== "edit") return null;

  return (
    <section className="fixed top-0 left-0 w-full bg-black/50 z-50 overflow-auto py-10 h-dvh backdrop-blur-sm">
      <div className="p-6 text-black max-w-xl w-full mx-auto bg-navy-800 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl mb-4 text-white">Edit Certificate</h2>
          {certificateFetchLoading ? (
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
              Name
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
            <label htmlFor="certSrc" className="block mb-2">
              Upload Certificate Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2"
            />
            {certificate.certSrc && (
              <div className="mt-2">
                <Image
                  width={500}
                  height={500}
                  src={`data:image/jpeg;base64,${certificate.certSrc}`}
                  alt="Certificate Preview"
                  className="object-cover rounded"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-5">
            <PrimaryBtn
              type="button"
              className="bg-gray-500 hover:bg-gray-600"
              onClick={() => router.push("/admin/certificates")}
            >
              Close
            </PrimaryBtn>
            <PrimaryBtn
              type="submit"
              disabled={loading}
              className="disabled:bg-accent-400"
            >
              {loading ? "Uploading..." : "Update Certificate"}
            </PrimaryBtn>
          </div>
        </form>
      </div>
    </section>
  );
};

export default GlobalEditDialog;
