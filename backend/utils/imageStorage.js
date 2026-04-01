import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const uploadsRoot = path.resolve(process.cwd(), "uploads");
const productUploadsRoot = path.join(uploadsRoot, "products");
const avatarUploadsRoot = path.join(uploadsRoot, "avatars");

const ensureUploadDirectory = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

const getExtensionFromMimeType = (mimeType) => {
  const match = mimeType.match(/^image\/([a-zA-Z0-9.+-]+)$/);
  if (!match) {
    return "jpg";
  }

  const [, subtype] = match;
  if (subtype === "jpeg") {
    return "jpg";
  }

  return subtype.replace("svg+xml", "svg");
};

const parseDataUrl = (value) => {
  const match = String(value).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    return null;
  }

  const [, mimeType, base64Data] = match;
  return { mimeType, buffer: Buffer.from(base64Data, "base64") };
};

const removeLocalUpload = (imagePath, prefix, directoryPath) => {
  if (!imagePath || !imagePath.startsWith(prefix)) {
    return;
  }

  const fileName = imagePath.split("/").pop();
  if (!fileName) {
    return;
  }

  const absolutePath = path.join(directoryPath, fileName);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

const persistImage = (imageValue, existingImage, directoryPath, routePrefix) => {
  if (!imageValue) {
    return existingImage || "";
  }

  const parsed = parseDataUrl(imageValue);
  if (!parsed) {
    return imageValue;
  }

  ensureUploadDirectory(directoryPath);
  const extension = getExtensionFromMimeType(parsed.mimeType);
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const absolutePath = path.join(directoryPath, fileName);
  fs.writeFileSync(absolutePath, parsed.buffer);

  if (existingImage && existingImage !== imageValue) {
    removeLocalUpload(existingImage, routePrefix, directoryPath);
  }

  return `${routePrefix}${fileName}`;
};

export const persistProductImage = (imageValue, existingImage = "") => {
  return persistImage(imageValue, existingImage, productUploadsRoot, "/uploads/products/");
};

export const deleteProductImage = (imagePath) => {
  removeLocalUpload(imagePath, "/uploads/products/", productUploadsRoot);
};

export const persistAvatarImage = (imageValue, existingImage = "") => {
  return persistImage(imageValue, existingImage, avatarUploadsRoot, "/uploads/avatars/");
};

export const deleteAvatarImage = (imagePath) => {
  removeLocalUpload(imagePath, "/uploads/avatars/", avatarUploadsRoot);
};
