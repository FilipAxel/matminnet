/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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

  const data: Record<string, any> = {
    ...fields,
    "Content-Type": file.type,
    file,
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
