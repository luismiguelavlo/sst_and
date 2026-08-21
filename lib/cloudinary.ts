import "server-only";

import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

export type CloudinaryUpload = {
  url: string;
  publicId: string;
  resourceType: string;
  originalFilename: string;
};

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const DOCUMENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_BYTES = 8 * 1024 * 1024;

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Faltan credenciales de Cloudinary en .env.local.");
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export async function uploadCourseAsset(
  file: File,
  kind: "image" | "document",
): Promise<CloudinaryUpload> {
  return uploadFile(file, {
    folder: "campus-sst",
    kind,
  });
}

export async function uploadProfilePhotoFile(file: File): Promise<CloudinaryUpload> {
  return uploadFile(file, {
    folder: "campus-sst/avatars",
    kind: "image",
  });
}

async function uploadFile(
  file: File,
  options: { folder: string; kind: "image" | "document" },
): Promise<CloudinaryUpload> {
  if (file.size > MAX_BYTES) {
    throw new Error("El archivo supera 8 MB.");
  }
  if (options.kind === "image" && !IMAGE_TYPES.has(file.type)) {
    throw new Error("Usa una imagen JPG, PNG, WEBP o GIF.");
  }
  if (options.kind === "document" && !DOCUMENT_TYPES.has(file.type)) {
    throw new Error("Usa un documento PDF o Word.");
  }

  configureCloudinary();
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadBuffer(buffer, {
    folder: options.folder,
    resource_type: options.kind === "document" ? "raw" : "image",
    use_filename: true,
    unique_filename: true,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type,
    originalFilename: file.name,
  };
}

function uploadBuffer(
  buffer: Buffer,
  options: { folder: string; resource_type: "image" | "raw"; use_filename: boolean; unique_filename: boolean },
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        reject(error ?? new Error("Cloudinary no devolvió resultado."));
        return;
      }
      resolve(result);
    });
    stream.end(buffer);
  });
}
