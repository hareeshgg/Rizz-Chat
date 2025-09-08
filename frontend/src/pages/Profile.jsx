import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User, Mail, Camera } from "lucide-react";

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePic: base64Image });
      // Consider refreshing authUser here or in store after update
    };
  };

  return (
    <div className="min-h-[calc(100vh-4.05rem)] flex items-center justify-center">
      <div className="rounded-xl shadow-md max-w-5xl w-full lg:w-auto">
        <div className="block md:flex rounded-t-xl overflow-hidden">
          <div className="w-full md:w-2/5 p-4 sm:p-6 lg:p-8 relative ">
            <div className="flex flex-col justify-center items-center mb-2">
              <span className="text-2xl font-semibold block">Profile</span>
              <span className="text-gray-600 mb-4 block">
                Your profile information
              </span>
            </div>

            {/* Image container relative to position input */}
            <div className="w-auto p-8 mx-auto flex justify-center relative">
              <img
                id="showImage"
                className="size-32 object-cover rounded-full border-4"
                src={selectedImage || authUser?.profilePic || "/profile.jpg"}
                alt="Profile"
              />
              
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-7 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>

            {/* Paragraph in one line */}
            <p className="text-xs text-zinc-400 flex items-center justify-center gap-2">
              {isUpdatingProfile
                ? "Uploading"
                : "Click on the camera icon to update"}
            </p>
          </div>

          {/* Right section with user info */}
          <div className="w-full md:w-3/5 p-8 lg:ml-4 lg:w-auto">
            <div className="rounded shadow p-6">
              <div className="pb-6">
                <label
                  htmlFor="name"
                  className="font-semibold text-gray-600 block pb-1"
                >
                  <User className="h-5 w-5 text-gray-400 inline" /> Name
                </label>
                <input
                  disabled
                  id="username"
                  className="border rounded px-4 py-2 w-full"
                  type="text"
                  value={authUser?.fullName || "Jane Name"}
                />
              </div>
              <div className="pb-4">
                <label
                  htmlFor="about"
                  className="font-semibold text-gray-600 block pb-1"
                >
                  <Mail className="h-5 w-5 text-gray-400 inline" /> Email
                </label>
                <input
                  disabled
                  id="email"
                  className="border rounded px-4 py-2 w-full"
                  type="email"
                  value={authUser?.email || ""}
                />
                <span className="text-gray-600 pt-4 block opacity-70">
                  Personal login information of your account
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 ">
              <span>Member since</span>
              <span>{authUser?.createdAt?.split("T")[0]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
