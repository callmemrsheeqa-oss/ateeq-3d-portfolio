import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';

export type UploadBucket = 'cv' | 'gallery' | 'awards' | 'certificates';

const ALLOWED_IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
]);

export function getUploadRoot(): string {
  const configured = process.env.UPLOAD_DIR?.trim() || './uploads';
  return path.resolve(process.cwd(), configured);
}

export function ensureBucketDir(bucket: UploadBucket): string {
  const dir = path.join(getUploadRoot(), bucket);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function resolveSafeFilePath(bucket: UploadBucket, filename: string): string | null {
  const safeName = path.basename(filename);
  if (!safeName || safeName !== filename || safeName.includes('..')) {
    return null;
  }
  const bucketDir = ensureBucketDir(bucket);
  const fullPath = path.resolve(bucketDir, safeName);
  if (!fullPath.startsWith(bucketDir + path.sep)) {
    return null;
  }
  return fullPath;
}

export function deleteStoredFile(bucket: UploadBucket, filename: string): void {
  const fullPath = resolveSafeFilePath(bucket, filename);
  if (fullPath && fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch (err) {
      console.error(`Failed to delete stored file ${fullPath}:`, err);
    }
  }
}

export function verifyPdfMagicBytes(filePath: string): boolean {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(5);
    const bytesRead = fs.readSync(fd, buf, 0, 5, 0);
    fs.closeSync(fd);
    return bytesRead === 5 && buf.toString('ascii') === '%PDF-';
  } catch {
    return false;
  }
}

function createDiskStorage(bucket: UploadBucket) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, ensureBucketDir(bucket));
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
      const unique = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
      cb(null, `${unique}${ext}`);
    },
  });
}

export const cvUpload = multer({
  storage: createDiskStorage('cv'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const isPdf =
      file.mimetype === 'application/pdf' ||
      path.extname(file.originalname).toLowerCase() === '.pdf';
    if (!isPdf) {
      cb(new Error('Only valid PDF files are accepted for CV uploads.'));
      return;
    }
    cb(null, true);
  },
});

export function createImageUpload(bucket: UploadBucket) {
  return multer({
    storage: createDiskStorage(bucket),
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (!ALLOWED_IMAGE_MIMES.has(file.mimetype.toLowerCase())) {
        cb(new Error('Only JPG, PNG, WebP, or AVIF image files are accepted.'));
        return;
      }
      cb(null, true);
    },
  });
}

export function createMixedAssetUpload(bucket: 'awards' | 'certificates') {
  return multer({
    storage: createDiskStorage(bucket),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const mime = file.mimetype.toLowerCase();
      const ok = ALLOWED_IMAGE_MIMES.has(mime) || mime === 'application/pdf';
      if (!ok) {
        cb(new Error('Only image files (JPG, PNG, WebP) or PDF files are accepted.'));
        return;
      }
      cb(null, true);
    },
  });
}
