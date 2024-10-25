import imageCompression from "browser-image-compression";

export const uploadImageToGitHub = async (
  file: File,
  fileName: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const GITHUB_REPO = "0ME9A/rudra-assets"; // Your GitHub repo
  const GITHUB_PATH = "images"; // The folder path in the repo
  const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_PATH}/${fileName}`;
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_IMG_STORAGE_TOKEN; // Your GitHub token (make sure it's secure)

  // Set the compression options to limit the file size to 500KB
  const options = {
    maxSizeMB: 0.5, // Max file size (in MB), 0.5 MB is 500KB
    maxWidthOrHeight: 1024, // Max width or height in pixels (adjust as needed)
    useWebWorker: true, // Use web worker for better performance
  };

  try {
    // Compress the image file
    const compressedFile = await imageCompression(file, options);

    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
      fileReader.onloadend = async () => {
        const content = fileReader.result?.toString().split(",")[1]; // Base64 encode the compressed file

        try {
          setLoading(true); // Start loading

          // Fetch the current file's sha if it exists
          const shaResponse = await fetch(GITHUB_API_URL, {
            headers: {
              Authorization: `token ${GITHUB_TOKEN}`,
              "Content-Type": "application/json",
            },
          });

          let sha = "";
          if (shaResponse.ok) {
            const shaData = await shaResponse.json();
            sha = shaData.sha; // Get the sha of the existing file (if any)
            console.log("SHA of existing file:", sha);
          } else {
            console.log("No existing file found, uploading new image.");
          }

          // Upload the new image or replace the existing one if it exists
          const uploadResponse = await fetch(GITHUB_API_URL, {
            method: "PUT",
            headers: {
              Authorization: `token ${GITHUB_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Add or update image ${fileName}`,
              content: content,
              sha: sha || undefined, // Only include sha if file exists
            }),
          });

          const responseData = await uploadResponse.json();
          console.log("GitHub response:", responseData);

          setLoading(false); // End loading

          if (uploadResponse.ok) {
            resolve({ success: true });
          } else {
            console.error("Failed to upload image:", responseData);
            reject({ success: false });
          }
        } catch (error) {
          setLoading(false);

          console.error("GitHub Upload Error:", error);
          reject({ success: false });
        }
      };

      fileReader.readAsDataURL(compressedFile); // Convert compressed file to base64
    });
  } catch (error) {
    console.error("Compression Error:", error);
    setLoading(false);

    return { success: false };
  }
};
