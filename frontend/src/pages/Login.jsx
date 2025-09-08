import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"; // Import icons
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-[calc(100vh-4.05rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full  rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center justify-center mb-6 gap-1 w-full">
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-sm text-white">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Dont have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
