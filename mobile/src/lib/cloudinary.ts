const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Cloudinary] Thiếu cấu hình EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME hoặc EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET trong mobile/.env. Upload ảnh sẽ không hoạt động.",
  );
}

export async function uploadImageToCloudinary(localUri: string): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary chưa được cấu hình. Vui lòng thêm EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME và EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET vào mobile/.env",
    );
  }

  const formData = new FormData();

  const fileName = localUri.split("/").pop() ?? "upload.jpg";
  const file: any = {
    uri: localUri,
    type: "image/jpeg",
    name: fileName,
  };

  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Upload ảnh thất bại (status ${response.status}): ${text || response.statusText}`,
    );
  }

  const json = (await response.json()) as { secure_url?: string; url?: string };
  const url = json.secure_url ?? json.url;

  if (!url) {
    throw new Error("Upload ảnh thành công nhưng không nhận được URL từ Cloudinary");
  }

  return url;
}

