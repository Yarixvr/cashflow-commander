"use client";
import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface ProfileEditFormProps {
  profile?: {
    _id: string;
    username: string;
    bio?: string;
    avatarImageUrl?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export function ProfileEditForm({ profile, onClose, onSuccess }: ProfileEditFormProps) {
  const updateProfile = useMutation(api.profiles.updateProfile);
  const uploadProfileImage = useMutation(api.auth.uploadProfileImage);
  const deleteAvatar = useMutation(api.profiles.deleteAvatar);

  const [formData, setFormData] = useState({
    username: profile?.username || "",
    bio: profile?.bio || "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatarImageUrl || null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.username.trim().length < 2) {
      newErrors.username = "Username must be at least 2 characters";
    }
    if (formData.username.trim().length > 30) {
      newErrors.username = "Username cannot exceed 30 characters";
    }
    if (formData.bio && formData.bio.length > 150) {
      newErrors.bio = "Bio cannot exceed 150 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await updateProfile({
        username: formData.username.trim(),
        bio: formData.bio.trim() || undefined,
      });
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      toast.error("Please upload JPG, PNG, or WebP images only");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setImageUploading(true);
    try {
      // Process image and convert to base64
      const processedImage = await processImage(file);

      const result = await uploadProfileImage({
        imageUrl: processedImage,
      });

      setAvatarPreview(result.url);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await deleteAvatar();
      setAvatarPreview(null);
      toast.success("Profile picture removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove picture");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const processImage = async (file: File): Promise<string> => {
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

        // Convert to base64
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 oled:bg-black/90 flex items-center justify-center p-4 z-50 transition-all-fast">
      <div className="bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 navy:bg-[#0f172a] coral:bg-white mint:bg-emerald-900 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 oled:border-gray-900 cyber:border-purple-800 navy:border-blue-900 coral:border-pink-200 mint:border-emerald-400 transition-all-fast">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 oled:text-white cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-900 transition-all-fast">
              {profile ? "Edit Profile" : "Complete Your Profile"}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 oled:text-gray-500 oled:hover:text-gray-300 cyber:text-purple-400 cyber:hover:text-purple-300 navy:text-blue-400 navy:hover:text-blue-300 coral:text-pink-400 coral:hover:text-pink-300 mint:text-emerald-400 mint:hover:text-emerald-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500 dark:ring-blue-400 oled:ring-gray-600 cyber:ring-pink-500 navy:ring-blue-400 coral:ring-pink-400 mint:ring-emerald-400"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center ring-4 ring-blue-500 dark:ring-blue-400 oled:ring-gray-600 cyber:ring-pink-500 navy:ring-blue-400 coral:ring-pink-400 mint:ring-emerald-400">
                    <span className="text-white font-bold text-3xl">
                      {formData.username ? formData.username.charAt(0).toUpperCase() : "?"}
                    </span>
                  </div>
                )}
                {imageUploading && (
                  <div className="absolute inset-0 rounded-full bg-white/70 dark:bg-slate-800/70 oled:bg-black/70 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageUploading}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 oled:bg-blue-700 oled:hover:bg-blue-600 cyber:bg-pink-600 cyber:hover:bg-pink-700 navy:bg-blue-600 navy:hover:bg-blue-700 coral:bg-pink-600 coral:hover:bg-pink-700 mint:bg-emerald-600 mint:hover:bg-emerald-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
                >
                  {avatarPreview ? "Change" : "Upload"}
                </button>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-md font-medium transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-200 oled:text-gray-200 cyber:text-purple-200 navy:text-blue-200 coral:text-[#a21d4d] mint:text-emerald-800 mb-1 transition-all-fast">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.username
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-slate-300 dark:border-slate-600 oled:border-gray-700 cyber:border-purple-700 navy:border-blue-700 coral:border-pink-300 mint:border-emerald-300 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 oled:focus:ring-gray-500 oled:focus:border-gray-500'
                } rounded-lg bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 navy:bg-[#0f172a] coral:bg-white mint:bg-emerald-900 text-slate-900 dark:text-slate-100 oled:text-white cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-900 transition-colors`}
                placeholder="Enter your username"
                disabled={submitting}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-slate-700 dark:text-slate-200 oled:text-gray-200 cyber:text-purple-200 navy:text-blue-200 coral:text-[#a21d4d] mint:text-emerald-800 mb-1 transition-all-fast">
                Bio <span className="text-slate-500 dark:text-slate-400">(optional)</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                maxLength={150}
                className={`w-full px-3 py-2 border ${
                  errors.bio
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-slate-300 dark:border-slate-600 oled:border-gray-700 cyber:border-purple-700 navy:border-blue-700 coral:border-pink-300 mint:border-emerald-300 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 oled:focus:ring-gray-500 oled:focus:border-gray-500'
                } rounded-lg bg-white dark:bg-slate-800 oled:bg-black cyber:bg-purple-950 navy:bg-[#0f172a] coral:bg-white mint:bg-emerald-900 text-slate-900 dark:text-slate-100 oled:text-white cyber:text-purple-100 navy:text-blue-100 coral:text-[#7f1d1d] mint:text-emerald-900 transition-colors resize-none`}
                placeholder="Tell us about yourself..."
                disabled={submitting}
              />
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 oled:text-gray-500 cyber:text-purple-400 navy:text-blue-300 coral:text-[#9f1239] mint:text-emerald-600">
                {formData.bio.length}/150 characters
              </div>
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bio}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 oled:border-gray-700 cyber:border-purple-700 navy:border-blue-700 coral:border-pink-300 mint:border-emerald-300 text-slate-700 dark:text-slate-200 oled:text-gray-200 cyber:text-purple-200 navy:text-blue-200 coral:text-[#a21d4d] mint:text-emerald-800 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 oled:hover:bg-gray-900 cyber:hover:bg-purple-900 navy:hover:bg-blue-900 coral:hover:bg-pink-50 mint:hover:bg-emerald-800 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || imageUploading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 oled:bg-blue-700 oled:hover:bg-blue-600 cyber:bg-pink-600 cyber:hover:bg-pink-700 navy:bg-blue-600 navy:hover:bg-blue-700 coral:bg-pink-600 coral:hover:bg-pink-700 mint:bg-emerald-600 mint:hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}