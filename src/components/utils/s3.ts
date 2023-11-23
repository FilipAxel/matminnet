/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

const MAX_WIDTH = 1500;
const MAX_HEIGHT = 1500;
const MIME_TYPE = "image/webp";
const QUALITY = 0.8;

export const uploadFileToS3 = async ({
  getPresignedUrl,
  file,
}: {
  getPresignedUrl: () => Promise<{
    url: string;
    fields: Record<string, string>;
  }>;
  file: File;
}) => {
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
};

const resizeImage = async (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<Blob> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;

        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }

        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }
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
};

const compressImage = async (
  inputBlob: Blob,
  quality: number
): Promise<Blob> => {
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
};
