/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

const MAX_WIDTH = 400;
const MAX_HEIGHT = 400;
const MIME_TYPE = "image/jpeg";
const QUALITY = 0.8;

export async function uploadFileToS3({
  getPresignedUrl,
  file,
}: {
  getPresignedUrl: () => Promise<{
    url: string;
    fields: Record<string, string>;
  }>;
  file: File;
}) {
  const { url, fields } = await getPresignedUrl();

  const resizedFile = await resizeImage(file, MAX_WIDTH, MAX_HEIGHT);

  const compressedBlob = await compressImage(resizedFile, QUALITY);

  const data: Record<string, any> = {
    ...fields,
    "Content-Type": compressedBlob.type,
    file: compressedBlob,
  };
  const formData = new FormData();
  for (const name in data) {
    formData.append(name, data[name]);
  }

  await fetch(url, {
    method: "POST",
    body: formData,
  });
}

async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw new Error("Error creating resized image blob.");
        }
      }, file.type);
    };
  });
}

async function compressImage(inputBlob: Blob, quality: number): Promise<Blob> {
  const img = new Image();
  img.src = URL.createObjectURL(inputBlob);

  return new Promise((resolve) => {
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            throw new Error("Error compressing image.");
          }
        },
        MIME_TYPE,
        quality
      );
    };
  });
}

// saving this for logging purposes or if i want to return an error in the feature with the image size.
function readableBytes(bytes) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}
