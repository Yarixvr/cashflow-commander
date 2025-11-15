import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface UploadResult {
  storageId: string;
  url: string;
}

export interface UseProfileImageUploadReturn {
  uploadImage: (file: File) => Promise<UploadResult | null>;
  uploading: boolean;
  progress: number;
  error: string | null;
}

export function useProfileImageUpload(): UseProfileImageUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadProfileImage = useMutation(api.auth.uploadProfileImage);

  const validateImageFile = useCallback((file: File): string | null => {
    // Check file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      return "Please upload JPG, PNG, or WebP images only";
    }

    // Check file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return "Image must be smaller than 5MB";
    }

    return null;
  }, []);

  const processImage = useCallback(async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 400x400)
        let { width, height } = img;
        const maxSize = 400;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and crop to circular shape
        ctx?.clearRect(0, 0, canvas.width, canvas.height);

        // Create circular clip
        ctx?.beginPath();
        ctx?.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI);
        ctx?.closePath();
        ctx?.clip();

        // Draw image centered and scaled
        ctx?.drawImage(img, (width - img.width) / 2, (height - img.height) / 2, img.width, img.height);

        // Convert to WebP for better compression
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to process image'));
            }
          },
          'image/webp',
          0.85 // Quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<UploadResult | null> => {
    // Reset state
    setError(null);
    setProgress(0);
    setUploading(true);

    try {
      // Validate file
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(validationError);
        toast.error(validationError);
        return null;
      }

      setProgress(20);

      // Process image (resize and optimize)
      const processedBlob = await processImage(file);
      setProgress(60);

      // Convert to bytes for Convex storage
      const arrayBuffer = await processedBlob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      setProgress(80);

      // Upload to Convex
      const result = await uploadProfileImage({
        file: Array.from(bytes),
        fileName: `profile-${Date.now()}.webp`,
      });

      setProgress(100);
      toast.success("Profile picture uploaded successfully!");

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setUploading(false);
      // Reset progress after a delay to show completion
      setTimeout(() => setProgress(0), 1000);
    }
  }, [validateImageFile, processImage, uploadProfileImage]);

  return {
    uploadImage,
    uploading,
    progress,
    error,
  };
}