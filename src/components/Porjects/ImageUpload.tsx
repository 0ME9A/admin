import React, { useState } from "react";
import Image from "next/image";
import { uploadImageToGitHub } from "@/utils/uploadImageToGitHub"; // Make sure this utility handles GitHub upload logic
import PrimaryBtn from "../buttons/PrimaryBtn";

const ImageUpload = ({
  img_id,
  src,
}: // setImgUploadStatus,
{
  img_id: string;
  src: string;
  setImgUploadStatus?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [renamedFile, setRenamedFile] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  // Function to handle image selection and preview generation
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Automatically rename the file based on your logic, ensuring consistent extensions
      //   const fileExtension = file.name.split(".").pop();
      const newFileName = img_id.split("/").at(-1) || "unknown"; // Rename and maintain consistent extensions

      setRenamedFile(newFileName); // Store the renamed file name

      // Create a preview for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result as string);
      };
      reader.readAsDataURL(file); // Convert file to base64 string for preview

      // Store the selected file
      setSelectedFile(file);
    }
  };

  // Function to upload the image to GitHub
  const handleGitHubUpload = async () => {
    if (selectedFile && renamedFile) {
      try {
        // Upload the selected image to GitHub
        const response = await uploadImageToGitHub(
          selectedFile,
          renamedFile,
          setLoading
        );

        if (response.success) {
          alert("Image successfully uploaded to GitHub");
          // previewSrc && setImgUploadStatus(true);
        } else {
          alert("Failed to upload image to GitHub");
        }
      } catch (error) {
        console.error("GitHub Upload Error:", error);
        alert("Error uploading image to GitHub");
      }
    } else {
      alert("No image selected or renamed");
    }
  };

  return (
    <div className="w-full mt-10 p-2 bg-navy-50 rounded-md">
      <div className="relative h-52 rounded-sm overflow-hidden">
        {previewSrc ? (
          <Image
            src={previewSrc}
            alt="Preview Image"
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={src}
            alt=""
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        )}
        {isLoading ? (
          <div className="absolute top-0 left-0 size-full bg-black/50 text-white duration-300 flex justify-center items-center gap-4">
            <p>Uploading image...</p>
            {/* Replace below div with your preferred loader image */}
            <div className="size-5 border-2 border-b-transparent border-white animate-spin rounded-full" />
          </div>
        ) : (
          <div className="absolute top-0 left-0 size-full opacity-0 bg-black/50 text-white hover:opacity-100 duration-300">
            <label
              htmlFor="upload-img"
              className="absolute top-0 left-0 size-full flex justify-center items-center"
            >
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="opacity-0"
              id="upload-img"
            />
          </div>
        )}
      </div>

      <PrimaryBtn
        className="mt-2 w-full bg-navy-700 hover:bg-navy-600 disabled:bg-navy-300"
        onClick={handleGitHubUpload}
        disabled={!previewSrc}
      >
        Upload the image first
      </PrimaryBtn>
    </div>
  );
};

export default ImageUpload;
